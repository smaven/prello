# prello

Trello's tiny cousin.

## Technologies used

- Next.js v14
- Prisma
- PostgreSQL
- Docker
- dnd-kit
- Mantine
- Tailwind CSS

## Local development

### Prerequisites

- Node.js v20
- PNPM v9
- Docker
- Docker Compose

### Setup

1. Clone the repository
1. Install dependencies with `pnpm install`
1. Start docker containers with `docker-compose up -d`
1. Setup environment variables: `cp .env.example .env`
1. Run migrations with `pnpm prisma migrate dev`
1. Seed database with `pnpm prisma db seed`
1. Start the development server with `pnpm dev`

### npm scripts

#### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

#### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `prettier:write` – formats all files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

## Screenshots

![Prello screenshots](https://github.com/user-attachments/assets/43d0f772-4cb2-46a9-8eaf-63277fe93787)
