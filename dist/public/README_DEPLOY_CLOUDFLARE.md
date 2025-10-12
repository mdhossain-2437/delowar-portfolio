# Cloudflare Pages Deployment Checklist

Your build output directory is:

```
dist/public
```

## SPA Routing

A `_redirects` file is present with:

```
/* /index.html 200
```

This ensures all routes are handled by your React/Vite SPA.

## index.html

Your `dist/public/index.html` exists and is valid.

## Build Command

Set this in Cloudflare Pages:

```
npm run build
```

## Output Directory

Set this in Cloudflare Pages:

```
dist/public
```

---

If you follow these, your site will not show 404 on refresh or deep links.
