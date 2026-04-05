# WordPressClone

A starter for a WordPress-style CMS built with React, TypeScript, Node.js, Prisma, and MySQL.

## Stack

- `apps/admin`: React + TypeScript + Vite admin panel
- `apps/api`: Express + TypeScript + Prisma API
- Database: MySQL

## Features In This Starter

- Dashboard stats for posts, pages, categories, and drafts
- CRUD APIs for posts, pages, and categories
- WordPress-inspired admin UI
- Prisma schema with MySQL models
- Seed script for demo content

## Project Structure

```text
apps/
  admin/  React admin dashboard
  api/    Express API + Prisma
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd install
```

2. Create the API environment file:

```bash
copy apps\\api\\.env.example apps\\api\\.env
```

Optional admin environment file:

```bash
copy apps\\admin\\.env.example apps\\admin\\.env
```

3. Update `DATABASE_URL` in `apps/api/.env` to point to your MySQL database.

4. Generate Prisma client and push schema:

```bash
npm run db:generate
npm run db:push
```

5. Seed demo data:

```bash
npm run db:seed
```

6. Run both apps in separate terminals:

```bash
npm run dev:api
npm run dev:admin
```

## Default URLs

- Admin UI: `http://localhost:5173`
- API: `http://localhost:4000`

## Next Steps

- Add authentication and role-based access
- Add rich text editor and media upload
- Add slug routing for public site pages
- Add theme/layout builder
