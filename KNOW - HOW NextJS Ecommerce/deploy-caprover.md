# Deploy de Next.js en CapRover — receta y trampas conocidas

> Documentado a partir del deploy de **Full Box** (2026-08-11), Next.js 16 + Supabase.
> Todos los problemas de acá se dieron en la vida real y costaron un 502 en producción.

CapRover espera un archivo `captain-definition` en la raíz del repo. Para Next.js
(que necesita un servidor Node, no archivos estáticos) apunta a un `Dockerfile`.

Se necesitan **3 archivos nuevos**, ninguno toca el código de la app:

| Archivo | Para qué |
|---|---|
| `captain-definition` | Lo que CapRover busca al deployar |
| `Dockerfile` | Build multi-stage: deps → build → runtime |
| `.dockerignore` | Excluye `node_modules`, `.git` y **todos los `.env`** |

```json
// captain-definition
{ "schemaVersion": 2, "dockerfilePath": "./Dockerfile" }
```

---

## Las 5 trampas (en orden de dolor)

### 1. El puerto — causa el clásico 502 "NGINX 502 Error :/"

**El síntoma más común y el más confuso.** El build termina bien, el contenedor
levanta, y aun así la web muestra el 502 azul de CapRover.

* CapRover usa por defecto **`Container HTTP Port = 80`**.
* Next.js con `next start` escucha por defecto en el **3000**.
* Nginx reenvía al 80 del contenedor, donde no hay nadie → **502**.

**Solución elegida**: que la app escuche en el 80, así funciona con la config por
defecto de CapRover y no hay que tocar nada en el panel. Como los puertos < 1024
están reservados a root y conviene NO correr como root, se le da al binario de
Node ese permiso puntual:

```dockerfile
ENV PORT=80
RUN apk add --no-cache libcap \
 && setcap 'cap_net_bind_service=+ep' /usr/local/bin/node
EXPOSE 80
```

> Alternativa válida: dejar `PORT=3000` y poner **Container HTTP Port = 3000** en
> el panel. Lo importante es que **los dos números coincidan**. Elegir uno y documentarlo.

**Dónde se configura ese número**: CapRover → Apps → (tu app) → pestaña
**HTTP Settings** → campo *Container HTTP Port*. **No** es la plantilla de Nginx
(`listen 80; server_name ...`): esa es del reverse proxy del servidor, se ve
parecida y no hay que tocarla — romperla deja sin SSL y sin health check.

### 2. Permisos de escritura con ISR

Si se copian los archivos como root y después se hace `USER nextjs`, los archivos
quedan de root y el proceso **no puede escribir**. Con `export const revalidate`
(ISR) Next necesita escribir las páginas regeneradas en `.next/cache`.

No rompe el arranque, así que **no se nota hasta que falla la revalidación**.

```dockerfile
RUN mkdir -p .next/cache && chown -R nextjs:nodejs /app
USER nextjs
```

### 3. Las `NEXT_PUBLIC_*` se necesitan en BUILD, no solo en runtime

Dos motivos independientes:

1. Las variables `NEXT_PUBLIC_*` se **incrustan en el bundle durante el build**.
2. Si hay `generateStaticParams()` que consulta la base (catálogo por slug),
   **el build hace queries reales**. Sin credenciales el build falla.

CapRover pasa las *Environmental Variables* de la app también como build args, así
que alcanza con cargarlas en el panel. En el Dockerfile hay que **declararlas**:

```dockerfile
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Conviene además **fallar temprano con un mensaje claro** si faltan, porque el error
nativo de Supabase aparece 200 líneas después y no dice qué hacer:

```dockerfile
RUN if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then \
      echo "ERROR: faltan las credenciales de Supabase (App Configs > Environmental Variables)"; \
      exit 1; \
    fi
```

> Las variables también hacen falta **en runtime**: las páginas dinámicas (`ƒ`)
> leen `process.env` en cada request. Cargarlas en el panel cubre ambos casos.

### 4. `npm run start` no propaga SIGTERM

npm no reenvía bien la señal de apagado al proceso hijo, así que el contenedor
tarda ~10s extra en frenar en cada redeploy. Ejecutar el binario directo:

```dockerfile
CMD ["node_modules/.bin/next", "start"]
```

### 5. El repo tiene que estar público al momento del deploy

Si se deploya por Git, CapRover clona el repo. Privado → falla el clone.
Es fácil olvidarse cuando se privatiza después de cada deploy: **verificar la
visibilidad ANTES de darle Redeploy**, no solo que el push haya salido bien.

---

## Podar devDependencies: sí se puede (verificado)

En el stage de runtime se puede hacer `npm ci --omit=dev` sin romper nada, aunque
`next.config.ts` sea TypeScript y `typescript` sea devDependency.

**Next.js transpila `next.config.ts` con su compilador interno (SWC), no necesita
el paquete `typescript` instalado.** Verificado empíricamente: se quitó el paquete,
arrancó `next start` y se comprobó que la config se aplicaba comparando el
optimizador de imágenes (un dominio de `remotePatterns` responde *"url is valid"*
y uno no permitido *"url is not allowed"*).

Ahorra ~300 MB de imagen. Si en alguna versión futura fallara, el síntoma sería
que la config se ignora (p. ej. imágenes remotas rechazadas), no un crash.

---

## Checklist antes del primer deploy

- [ ] `captain-definition`, `Dockerfile` y `.dockerignore` en la raíz y **commiteados**
- [ ] `.dockerignore` excluye `.env*` (que ningún secreto entre a la imagen)
- [ ] Variables de entorno cargadas en **App Configs → Environmental Variables**
- [ ] **HTTP Settings → Container HTTP Port** coincide con el `ENV PORT` del Dockerfile
- [ ] Repo **público** en el momento del Redeploy
- [ ] Todos los archivos que el build necesita están **trackeados en git**
      (CapRover clona el repo, no usa el disco local: ojo con lo que esté en `.gitignore`)

## Cómo diagnosticar

| Síntoma | Dónde mirar | Causa típica |
|---|---|---|
| Falla el build | **Build logs** | Faltan env vars, o error de compilación |
| Deploy OK pero **502** | **App Logs** (del contenedor) | Puerto que no coincide, o el proceso crasheó |
| 502 y App Logs vacíos | — | El contenedor ni arrancó: revisar `CMD` y permisos |
| Anda pero no revalida | **App Logs** | Permisos de escritura en `.next/cache` |

> Distinguir siempre **Build logs** (compilación de la imagen) de **App Logs**
> (contenedor corriendo). Para un 502 el que sirve es el segundo.

## Verificar sin tener Docker a mano

Si en la máquina de desarrollo no hay Docker, igual se puede validar casi todo
antes de deployar — replicando a mano el stage de runtime:

1. Carpeta temporal + `package.json` y `package-lock.json`
2. `npm ci --omit=dev`
3. Copiar `.next`, `public` y `next.config.ts` del build
4. `PORT=3200 ./node_modules/.bin/next start` y probar las rutas con `curl`

Eso valida dependencias de runtime, arranque y puerto. Lo único que queda sin
probar es el armado de la imagen en sí.
