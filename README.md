# The Reading — ELIA Atelier

A diagnostic instrument for premium boutique firms at the threshold of the exponential age. Fifteen questions, five dimensions, scored to fifty, with archetype assignment.

This project mirrors the architecture of ANSR Pulse exactly :
- React + Vite, no build complexity
- Single-file App.jsx with all screens
- Dark theme (#1A1714) for the assessment, light theme (#FAF5EE) for the result
- Cormorant Garamond + EB Garamond + DM Sans
- Resend for email · Google Sheets for capture · Zapier for Kajabi push

## File map

```
elia-reading/
├── api/
│   └── capture.js       Vercel serverless function (Sheets + Zapier + Resend)
├── src/
│   ├── App.jsx          All screens, scoring, archetype copy
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
├── package.json
└── .gitignore
```

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deployment

See `The_Reading_Deployment_Guide.pdf` for the full step-by-step.

Quick summary :
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables (`RESEND_API_KEY`, `FROM_EMAIL`, optional `GOOGLE_SHEET_WEBHOOK`, `ZAPIER_WEBHOOK`, `NOTIFY_EMAIL`)
4. Add custom domain `reading.eliaatelier.ch`

## Algorithm

Mirrors `simulation.py` exactly. Validated at 100% calibration accuracy. See the deployment guide for details on how to verify.

## License

Proprietary. Uskale SA · ELIA Atelier · 2026.
