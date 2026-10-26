# frontend-practica

Práctica Integradora 1 a 5 — DevOps Testing Automation (SOFT-689).
Frontend (Vite + JavaScript) con pruebas unitarias, imagen Docker y un pipeline de CI/CD con análisis de seguridad.

## Ejecución local

```bash
npm install
npm run dev -- --host      # http://<IP>:5173  → botón "Fetch Data"
npm run test               # Jest con cobertura
```

## Imagen Docker

```bash
docker build -t vladmazolski/frontend-practica:v1.0.0-practica .
docker run --rm -p 8080:8080 vladmazolski/frontend-practica:v1.0.0-practica   # http://localhost:8080
```

- Build multi-stage: Node 22 compila (`vite build`) y `nginx-unprivileged` sirve el resultado.
- Corre como usuario **no-root** (uid 101) en el puerto 8080.
- Paquetes del sistema parchados con `apk upgrade` (CVE detectados por Trivy).
- Publicada en Docker Hub: `vladmazolski/frontend-practica:v1.0.0-practica`.

## Pipeline (`.github/workflows/ci.yaml`)

Se ejecuta en cada `push` a `main`.

| Job | Qué hace | Falla el workflow si… |
|---|---|---|
| `test` | `npm ci` + `npm run test` (Jest). Exporta la cobertura como artefacto | alguna prueba falla |
| `codeScan` | SonarCloud (calidad de código). Exporta el estado del Quality Gate | `SONAR_GATE_STRICT=true` y el gate da `ERROR` |
| `security` | Snyk sobre las dependencias. Exporta el SARIF | hay vulnerabilidades **CRITICAL** |
| `image` | Construye la imagen, la etiqueta, la **escanea con Trivy** y solo si pasa la publica en Docker Hub | Trivy encuentra **CRITICAL/HIGH** con fix disponible |

Orden: las pruebas corren primero (fallar a tiempo) y la imagen solo se publica si el escaneo pasa.

### Secrets requeridos

| Secret | Uso |
|---|---|
| `DOCKER_USERNAME`, `DOCKER_PASSWORD` | Publicar la imagen en Docker Hub |
| `SONAR_TOKEN`, `SONAR_ORGANIZATION`, `SONAR_PROJECT_KEY` | SonarCloud |
| `SNYK_TOKEN` | Snyk |

Si falta alguno, el job correspondiente se **omite con un aviso visible** (no falla en silencio).

### Artefactos exportados

`coverage` · `sonar-results` · `snyk-results` · `trivy-results`

## Pruebas unitarias

`utils.test.js` traía una prueba que fallaba a propósito (`Expected: "Fallo"`, `Received: "Error"`).
Se corrigió la expectativa (la función es correcta) y se agregaron pruebas de borde. Resultado: 6/6, 100 % de cobertura en `utils.js`.
