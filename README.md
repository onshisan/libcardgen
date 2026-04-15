# libcardgen
Generate printable, barcoded library cards.

If you need a simple way for staff to generate a basic, temporary library card for patrons, this project offers a lightweight browser-based starting point.

This app uses [JsBarcode](https://github.com/lindell/JsBarcode) and is configured for [Codabar](https://github.com/lindell/JsBarcode/wiki/codabar).

## In-browser workflow (no Sierra API)

This version is fully in-browser and avoids external API dependencies:

1. Export patron data from your ILS as a CSV file.
2. Load the CSV in the browser.
3. Search patrons by name.
4. Select the patron to auto-fill barcode.
5. Generate and print a temporary card.

### Supported CSV format

Headers required:

- `name`
- `barcode`

Optional headers:

- `expires`
- `note`

Example:

```csv
name,barcode,expires,note
DOE, JANE,21234000012345,2026-12-31,Teen card
SMITH, JOHN,21234000067890,,
```

## Print quality & barcode performance

Testing has demonstrated baseline barcode functionality when printed. Barcode scanner performance varies based on printer/scanner quality. In many environments, printing to PDF first can improve sharpness.

## Library card graphics

You can add a background image to the card:

- `libcardgen.html` (`.card { background-image: ... }`)

## Alternative feature directions

If name search is not a priority, see `docs/BROWSER_FEATURE_ROADMAP.md` for browser-only enhancements such as sequential barcode generation, batch printing, keyboard-first workflows, and local audit/reprint logs.


## Thermal receipt printers (ESC/POS)

A browser app generally cannot send raw ESC/POS commands directly to a network printer by itself. For reliable thermal/network printing, use one of these patterns:

- OS printer + `window.print()` (simplest)
- Local desktop bridge service (`localhost`) that forwards ESC/POS
- Internal print-server API that emits ESC/POS to branch printers

See `docs/BROWSER_FEATURE_ROADMAP.md` for a detailed thermal mode proposal.
