# OMNeXa ValueGraph

Enterprise Value Intelligence: AI-assisted revenue attribution, human-capital ROI and resource optimisation.

## MVP included

- Executive Overview with influenced revenue, margin, RIS, AEM and confidence
- Revenue Intelligence opportunity view
- Interactive ValueGraph relationship map
- Resource Optimizer scenario simulator
- AI Advisor demonstration interface
- AI Governance / model-card screen
- Synthetic NovaTech demo data so preview works before Firebase provisioning
- Tenant-aware Firestore security rules and indexes

## Local run

```bash
npm install
npm run dev
```

The UI runs with synthetic data and requires no Firebase credentials for the first preview.

## Vercel

Create a **separate Vercel project** named `omnexa-valuegraph` from the `HumanSamaritan/OMNeXa` repository and set **Root Directory** to `products/valuegraph`. Do not point the existing OMNeXa corporate website project at this folder.

Suggested future domain: `valuegraph.omnexagoc.com`.

## Firebase

Create a separate development Firebase project (suggested id `omnexa-valuegraph-dev`, subject to availability), enable Authentication and Cloud Firestore, then register a Web App and add the `NEXT_PUBLIC_FIREBASE_*` values from `.env.example` to Vercel.

Deploy rules/indexes from this folder with Firebase CLI:

```bash
firebase use <project-id>
firebase deploy --only firestore:rules,firestore:indexes
```

Recommended tenant layout:

- `/organizations/{orgId}`
- `/organizations/{orgId}/members/{uid}`
- `/organizations/{orgId}/accounts/{id}`
- `/organizations/{orgId}/opportunities/{id}`
- `/organizations/{orgId}/activities/{id}`
- `/organizations/{orgId}/relationships/{id}`
- `/organizations/{orgId}/outcomes/{id}`
- `/organizations/{orgId}/attributionScores/{id}`
- `/organizations/{orgId}/recommendations/{id}`
- `/organizations/{orgId}/modelMetrics/{id}`
- `/organizations/{orgId}/auditLogs/{id}`

## Security / governance constraints

- Use separate Firebase projects for dev/staging/prod.
- Never expose Firebase Admin credentials as `NEXT_PUBLIC_*` variables.
- Customer collaboration content should not be ingested by default; start with structured metadata and explicit approved connectors.
- RIS v0.1 and optimizer projections are demonstrator heuristics, not empirically validated models.
- Do not use demo scores for automated employment, compensation or autonomous budget decisions.
- Production attribution must retain model version, confidence, evidence scope, AEM and human override/audit history.
