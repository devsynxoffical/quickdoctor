# QuickDoctor Client Documentation

## Files

| File | Description |
|------|-------------|
| `QuickDoctor-User-Manual.pdf` | **Give this to your client** — full platform manual |
| `QuickDoctor-User-Manual.md` | Source markdown (edit here, then regenerate PDF) |
| `QuickDoctor-User-Manual-print.html` | Print-ready HTML (auto-generated) |
| `generate-pdf.mjs` | Regenerate PDF after editing markdown |

## Regenerate PDF

```bash
node docs/client/generate-pdf.mjs
```

Requires Google Chrome on macOS (or open the `.html` file in any browser → Print → Save as PDF).

## Manual contents

- Patient flows (register, OTP, booking, video, prescriptions, certificates)
- Doctor flows (apply, settings, consultations, issuing documents)
- Admin flows (every admin page)
- Payments, emails, refunds, timezone, troubleshooting
- Demo login credentials
- Full URL reference
