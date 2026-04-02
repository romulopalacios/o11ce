<div align="center">
  <h1>🏆 O11CE | Mundial 2026</h1>
  <p><strong>Plataforma Analítica y Deportiva Full-Stack de Alto Rendimiento</strong></p>

  <p>
    <a href="#-sobre-el-proyecto"><strong>Explorar Proyecto</strong></a> ·
    <a href="#-stack-tecnológico"><strong>Ver Arquitectura</strong></a> ·
    <a href="https://o11ce.netlify.app" target="_blank"><strong>Ver Demo en Vivo ➔</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/tRPC-11-2596be?style=for-the-badge&logo=trpc" alt="tRPC" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
  </p>
</div>

<hr />

## 📖 Sobre el Proyecto

**O11CE** no es solo un marcador en vivo; es una plataforma deportiva construida con estándares de la industria para soportar alto tráfico. Diseñada para la **Copa del Mundo 2026**, integra estadísticas avanzadas, sistemas interactivos de predicción (quinielas) y comparativas *Head-to-Head* utilizando tecnologías de vanguardia y arquitectura Serverless.

Este proyecto demuestra habilidades avanzadas en **Frontend SSR/RSC**, conexiones tipadas **E2E**, bases de datos relacionales, manejo agresivo de **Caché en Memoria** y pipelines **DevOps**.

---

## ✨ Funcionalidades Destacadas

| 🔴 **Live Dashboard** | 🎮 **Quiniela Interactiva** |
| :--- | :--- |
| Sistema de *long-polling* eficiente para actualizar resultados en vivo sin saturar el cliente. Renderizado inicial rápido y SEO optimizado. | Sistema CRUD (tRPC + Prisma) persistente donde los usuarios ingresan su alias y compiten prediciendo los resultados (Local, Empate, Visita). |

| ⚔️ **Arena Head-to-Head** | 🏆 **Bracket & Grupos Dinámicos** |
| :--- | :--- |
| Comparador interactivo de selecciones midiendo rachas históricas (W/D/L) con una UI construida sobre `shadcn/ui` y transiciones fluidas. | Generación al vuelo de las tablas de clasificación matemáticas y árbol de cruces de eliminación directa. |

---

## 📸 Interfaz de Usuario

> **💡 Nota:** *¡Echa un vistazo a la interfaz de usuario de O11CE!*

<details>
  <summary><strong>Ver Capturas del Sistema (Clic para expandir)</strong></summary>

  <br />
  <p align="center">
    <img src="public/img/01-dashboard.png" width="49%" alt="Dashboard" />
    <img src="public/img/02-matches.png" width="49%" alt="Partidos en Vivo" />
  </p>
  <p align="center">
    <img src="public/img/03-groups.png" width="49%" alt="Grupos" />
    <img src="public/img/04-bracket.png" width="49%" alt="Eliminatorias" />
  </p>
  <p align="center">
    <img src="public/img/05-compare.png" width="49%" alt="Comparador Directo" />
    <img src="public/img/06-predictions.png" width="49%" alt="Sistema de Quinielas" />
  </p>
  <p align="center">
    <img src="public/img/07-teams.png" width="49%" alt="Selecciones" />
    <img src="public/img/08-stats.png" width="49%" alt="Estadísticas" />
  </p>

</details>

---

## 🧩 Arquitectura Inteligente

El proyecto utiliza un acercamiento moderno de "Capas" dentro del ecosistema Next.js App Router:

<details>
  <summary><strong>Explorar Árbol de Directorios (Clic para expandir)</strong></summary>

```text
o11ce/
┣ 📁 prisma/                # Esquema de Base de Datos y migraciones
┣ 📁 src/
┃ ┣ 📁 app/                 # Configuración del App Router (Layouts, Páginas, API Routes)
┃ ┣ 📁 components/          # Componentes Reutilizables (Separación UI estúpida vs inteligente)
┃ ┃ ┣ 📁 ui/                # Componentes base (shadcn/ui, botones, inputs)
┃ ┃ ┗ 📁 [features]/        # Componentes agrupados por dominio (compare, match, predictions)
┃ ┣ 📁 hooks/               # Custom Hooks (ej. useMatchPolling, useSearch)
┃ ┣ 📁 lib/                 # Utilidades (Merge Tailwind, trpcClient, env validation)
┃ ┗ 📁 server/              # Lógica de Backend Segura
┃ ┃ ┣ 📁 db/                # Instancia Singleton de Prisma (PostgreSQL)
┃ ┃ ┣ 📁 services/          # Lógica de Negocio (Football API, Upstash Redis)
┃ ┃ ┗ 📁 trpc/              # Routers E2E (Mutaciones, Consultas seguras)
┣ 📜 netlify.toml           # Infraestructura como Código (Headers de Seguridad y Build)
┗ 📜 Dockerfile             # Containerización Optimizada para Despliegues Agnósticos
```
</details>

### 🏎️ Estrategia de Caché (Redis)
Para eludir los estrictos `rate-limits` de APIs deportivas externas (como *football-data.org*), se implementó un patrón Singleton con **Upstash Redis**. Las peticiones interceptan la caché local entregando respuestas en `~15ms` e invalidando dinámicamente según la duración del evento (TTL Inteligente).

---

## ⚙️ Uso en Entorno de Desarrollo Local

### Prerrequisitos
- **Node.js** v18+ y **pnpm** (recomendado).
- Una base de datos PostgreSQL (ej. **Neon**).
- Una cuenta en **Upstash** (Redis).
- Token de la [API de Football-Data](https://www.football-data.org/).

### Pasos de Instalación

1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/tu-usuario/o11ce.git
   cd o11ce
   ```

2. **Instalar Dependencias**
   ```bash
   pnpm install
   ```

3. **Variables de Entorno**
   <details>
     <summary>Crear archivo <code>.env</code> en la raíz (Clic para ver credenciales requeridas)</summary>
     
     ```env
     # 1. Base de Datos Relacional (Neon / PostgreSQL)
     DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

     # 2. Redis Caché (Upstash REST)
     UPSTASH_REDIS_REST_URL="https://tu-endpoint.upstash.io"
     UPSTASH_REDIS_REST_TOKEN="tu-token-seguro"

     # 3. Datos Deportivos Externos
     FOOTBALL_DATA_API_KEY="tu-api-key"
     ```
   </details>

4. **Inicializar Base de Datos**
   Sincroniza tu esquema DB y genera el cliente Prisma:
   ```bash
   pnpm prisma db push
   pnpm prisma generate
   ```

5. **Lanzar Entorno de Desarrollo**
   ```bash
   pnpm dev
   ```
   > 🔗 *Visita [http://localhost:3000](http://localhost:3000) para ver la magia.*

---

## ☁️ Continuous Deployment & DevOps

El proyecto está parametrizado con `output: "standalone"` para empaquetados ultraligeros. Configurado para CI/CD de **$0 Coste en Netlify**:

- **Construcción Inteligente:** El archivo `netlify.toml` inyecta automáticamente la compilación de Prisma antes del bundle de Next.js.
- **Seguridad Perimetral:** Políticas anti-Clickjacking (`X-Frame-Options: DENY`) y mitigación XSS incluídas en la capa edge.
- **Fail-Fast (Zod):** Compilaciones abortadas preventivamente si faltan variables de entorno, evitando caídas en producción.

---

## 👨‍💻 Acerca de

Desarrollado y mantenido de 0 a 100 por **Rómulo Palacios** para los fanaticos del fútbol.

- 💼 [Mi Perfil en LinkedIn](https://www.linkedin.com/in/romulo-palacios-dev/)
- 🐙 [Mi Perfil en GitHub](https://github.com/romulopalacios)

<br />
<p align="center"><i>¿Te parece interesante la arquitectura o el código?<br/> ¡No dudes en dejar una ⭐️ en el repositorio!</i></p>
