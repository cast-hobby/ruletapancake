# ruletapancake

Ruleta promocional para activaciones de marca: el visitante gira y obtiene un premio, y el resultado queda guardado en Supabase.

- **Stack:** Next.js (App Router) + TypeScript + Tailwind + Supabase
- **Estado:** pausado

## Correr en local

```bash
npm install
cp .env.example .env.local
npm run dev                        # http://localhost:3000
```

Antes del primer arranque, correr `supabase-setup.sql` en el proyecto de Supabase para crear las tablas.

## Variables de entorno

| Variable | Para que |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave publica, se usa desde el navegador |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servidor. **Nunca** exponerla en el cliente |

## Scripts

`npm run dev` · `npm run build` · `npm start` · `npm run lint`
