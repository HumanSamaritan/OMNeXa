# SwayamITR — an OMNeXa initiative

Privacy-first Next.js Preview for preparing an Indian individual income-tax return for AY 2026–27.

## Current Preview scope

- ITR form eligibility screening for common individual cases.
- AY 2026–27 old/new regime estimate for normal-rate income.
- Salary, interest, positive house-property income, Chapter VI-A deductions and tax-credit capture.
- Browser-only working state with internal XML import/export.
- Filing-readiness checks and official portal hand-off.

This Preview does not create an Income Tax Department-compatible JSON file and does not submit or e-verify a return. Direct filing requires an approved e-Return Intermediary integration and current-schema validation.

## Local setup

```bash
npm install
npm run dev
```

## Deployment

The project is designed for Vercel Preview deployments. Set `NEXT_PUBLIC_SITE_URL` after selecting the final OMNeXa subdomain. Suggested future domain: `swayamitr.omnexagoc.com`.

## Production roadmap

1. Add Supabase authentication and encrypted user-owned return storage.
2. Import official prefilled JSON plus structured Form 16/AIS/26AS data.
3. Implement the complete current ITR-1 JSON schema and validation rules.
4. Add Type-2 ERI integration or an approved filing partner for prefill, submission and e-verification.
5. Complete security, privacy, tax-domain and audit-control assurance before production use.
