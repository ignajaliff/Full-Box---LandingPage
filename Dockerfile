# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Full Box — landing (Next.js 16, App Router con SSR).
# Build multi-stage: deps -> build -> runtime mínimo.
# No requiere ningún cambio en el código de la app.
# ---------------------------------------------------------------------------

FROM node:22-alpine AS base
# libc6-compat: lo piden los binarios nativos de Next/SWC en Alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app


# --- 1) Dependencias completas (las devDeps hacen falta para compilar) ------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci


# --- 2) Build --------------------------------------------------------------
# Importante: las NEXT_PUBLIC_* se incrustan en el bundle DURANTE el build,
# y `generateStaticParams()` consulta Supabase en este paso. Por eso las
# credenciales tienen que llegar como build args, no solo en runtime.
# CapRover pasa las "Environmental Variables" de la app también como build args.
FROM base AS builder

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_TELEMETRY_DISABLED=1

# Falla temprano y con un mensaje claro: sin credenciales el build revienta
# más adelante con un error críptico de Supabase.
RUN if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then \
      echo "============================================================"; \
      echo " ERROR: faltan las credenciales de Supabase para el build."; \
      echo ""; \
      echo " En CapRover -> tu app -> App Configs -> Environmental"; \
      echo " Variables, agregá estas dos y volvé a deployar:"; \
      echo "   NEXT_PUBLIC_SUPABASE_URL"; \
      echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY"; \
      echo "============================================================"; \
      exit 1; \
    fi

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build


# --- 3) Runtime: solo deps de producción + artefactos del build -------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Puerto 80 = el "Container HTTP Port" que CapRover usa por defecto.
# Así no hace falta tocar nada en la config de la app.
ENV PORT=80
ENV HOSTNAME=0.0.0.0

# Usuario sin privilegios + permiso puntual para escuchar en el puerto 80
# (por defecto sólo root puede usar puertos < 1024).
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001 -G nodejs \
 && apk add --no-cache libcap \
 && setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# next.config.ts se lee en runtime; Next lo transpila con su compilador
# interno, sin necesitar el paquete `typescript` (verificado).
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Con revalidate (ISR) Next escribe páginas regeneradas en .next/cache.
# Sin esto los archivos quedan de root y el proceso no puede escribir.
RUN mkdir -p .next/cache && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 80
# Binario directo en vez de `npm run start`: npm no propaga bien SIGTERM
# y el contenedor tardaría en frenar en cada redeploy.
CMD ["node_modules/.bin/next", "start"]
