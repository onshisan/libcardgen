# libcardgen
Generate printable, barcoded library cards!

If you need a simple way for staff to generate a basic, temporary library card for your patrons then this may offer a useful starting point for further development.

Uses [JsBarcode](https://github.com/lindell/JsBarcode) to generate barcodes from numeric input. This example is configured to generate [Codabar](https://github.com/lindell/JsBarcode/wiki/codabar) barcodes. See [JsBarcode documentation](https://github.com/lindell/JsBarcode/wiki) for info about how to generate other barcode types to suit your needs. 

## Functionality
Initial testing has demonstrated the basic functionality of these barcodes when printed; however, you should be aware that laser-printed barcodes do not seem to scan as easily as the "real McCoy". This may be acceptable for temporary applications, but perhaps not for long-term or mainstream use. YMMV based on printer quality.

## Graphics
Try adding a background image for style points:
https://github.com/onshisan/libcardgen/blob/c685f2d93a71446afc6bb4df32a5ba435b2f5f09/libcardgen.html#L15
