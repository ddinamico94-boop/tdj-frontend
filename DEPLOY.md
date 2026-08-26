# Deploy en Vercel

Guía completa (Render + Vercel, en orden) en `tdj-backend/DEPLOY.md`.
Resumen de la parte que corresponde a este proyecto:

1. Importar el repo en [vercel.com](https://vercel.com) — Vite se detecta solo.
2. `vercel.json` (ya incluido) agrega el rewrite necesario para que React
   Router funcione al refrescar rutas como `/unidades` o `/admin` (sin esto,
   Vercel tira 404 en esas URLs).
3. Variable de entorno en **Settings → Environment Variables**:
   ```
   VITE_API_URL=https://tu-backend.onrender.com/api
   ```
4. Deploy. Después, volver a Render y actualizar `CORS_ORIGIN` del backend
   con la URL final de Vercel.

Sin `VITE_API_URL`, el sitio funciona igual pero en modo demo local (login
demo + localStorage) — útil para mostrar el proyecto sin depender del backend.
