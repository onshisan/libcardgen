# Browser-Only Feature Roadmap for libcardgen

This roadmap intentionally avoids Sierra/API dependencies and focuses on practical, high-impact features for circulation desks.

## 1) Fast Temporary Card Issuance (No Patron Lookup)

### Why
For many desks, the biggest pain point is speed. Staff often already have a paper form or verbal confirmation and just need a scannable temporary card quickly.

### Feature
- Add a **one-click barcode generator** with configurable prefix and sequence.
- Option to generate:
  - single card,
  - next 5 cards,
  - next 10 cards.
- Keep generated values in a local “recent cards” list for instant reprint.

### Implementation sketch
- Add settings controls in UI:
  - barcode prefix (string)
  - next sequence number (integer)
  - total barcode length
- Persist settings in `localStorage`.
- Derive barcode with zero-padding and validate uniqueness against recent history.

## 2) Batch Sheet Printing (Avery/Label Stock)

### Why
Libraries often print multiple temp cards at once. Single-card print is slow.

### Feature
- Add a **batch queue** where each card entry has:
  - barcode
  - optional name/initials
  - optional expiration date
- Print queue as grid (e.g., 2x5 or 3x10 layout).
- “Mark as printed” to clear completed items.

### Implementation sketch
- Use a queue array in JS and render to a print-only section.
- Add print CSS media rules for fixed card dimensions.
- Include “duplicate barcode” warning before printing.

## 3) Keyboard-First Desk Workflow

### Why
Desk staff work quickly and often avoid mouse-heavy workflows.

### Feature
- Keyboard shortcuts:
  - `Enter`: generate/confirm
  - `Ctrl/Cmd+P`: print current/selected
  - `Ctrl/Cmd+Shift+N`: next sequential barcode
- Auto-focus behavior after each action.
- Audible/visual confirmation of successful generation.

### Implementation sketch
- Add global `keydown` handler and visible shortcut hints.
- Keep focus return map (which control gets focus next).

## 4) Better Print Reliability Tools

### Why
Scanner success is the core value. Print consistency matters more than aesthetics.

### Feature
- Add “barcode calibration” page:
  - test barcodes at multiple widths/heights
  - one-page printable test grid
- Let staff choose output profile:
  - thermal label
  - laser paper
  - plain fallback

### Implementation sketch
- Add profile presets for JsBarcode options.
- Save profile preference in `localStorage`.

## 5) Local Audit Trail (Privacy-Preserving)

### Why
Supervisors may need short-term accountability for reprints/issues without storing patron PII externally.

### Feature
- Keep local event log for this workstation:
  - timestamp
  - barcode
  - action (`generated`, `printed`, `reprinted`)
- Optional auto-purge window (e.g., 24h or 7d).
- CSV export for troubleshooting.

### Implementation sketch
- Store event entries in `localStorage`.
- Redact optional name fields by default.
- Add “clear log now” control.

## 6) Offline-First Packaging

### Why
Many circulation desks have constrained networks or locked-down environments.

### Feature
- Turn app into a simple PWA:
  - cached assets
  - works with no internet after first load
- Bundle JsBarcode locally so CDN outage does not block card generation.

### Implementation sketch
- Add service worker + manifest.
- Replace CDN import with local vendor asset.

## Suggested priority order

1. Fast Temporary Card Issuance
2. Batch Sheet Printing
3. Better Print Reliability Tools
4. Keyboard-First Workflow
5. Local Audit Trail
6. Offline-First Packaging

## First milestone recommendation (1 sprint)

Deliver a “high-utility desk bundle”:
- sequential barcode generator,
- recent cards + reprint,
- barcode profile presets,
- keyboard shortcuts,
- local JsBarcode copy (no CDN dependency).

This gives immediate operational value without any backend work.


## 7) Thermal Receipt-Printer Mode (ESC/POS)

### Why
For very fast, low-cost temp-card slips, some libraries use thermal receipt printers instead of card stock.

### Can a modern web app print directly to a network ESC/POS printer?
Short answer: **not reliably from a browser alone**.

- Browsers do not expose raw TCP socket access needed for typical ESC/POS-over-port-9100 printing.
- `window.print()` can print through OS-installed printers, but does not provide precise ESC/POS command control.
- Browser APIs like WebUSB/WebSerial can help for directly connected printers, but are not a general solution for shared/networked printers and often need user permission each session.

### Practical architecture options
1. **Local print bridge (recommended for on-prem desks)**
   - Browser app calls a local agent (desktop service) via `http://localhost`.
   - Agent sends ESC/POS bytes to network printer IP/port.
   - Good control of cuts, drawers, code pages, and barcode commands.
2. **CUPS / OS driver path**
   - Use normal print dialog with a tuned thermal template.
   - Easier deployment, less command-level control.
3. **Print-server API**
   - Browser sends job payload to an internal print service.
   - Service routes and emits ESC/POS commands.
   - Best for multi-branch centralized management.

### Implementation sketch
- Add `Printer Mode` toggle:
  - `Browser Print (existing)`
  - `Thermal ESC/POS`
- Define a compact receipt template (library, barcode, expiry).
- If `Thermal ESC/POS` is selected:
  - send JSON payload to bridge/print-server endpoint,
  - include printer profile (paper width, cut behavior, charset),
  - show “printed / failed / retry” status.

### Security and operations
- Require authenticated print endpoints.
- Restrict printer destination allowlist.
- Add job/audit IDs for troubleshooting.
- Add fallback to browser print if bridge unavailable.
