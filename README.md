# libcardgen
Generate printable, barcoded library cards!

If you need a simple way for staff to generate a basic, temporary library card for your patrons then this may offer a useful starting point for further development.

This example uses [JsBarcode](https://github.com/lindell/JsBarcode) to generate barcodes from numeric input and is configured to generate [Codabar](https://github.com/lindell/JsBarcode/wiki/codabar) barcodes. See [JsBarcode documentation](https://github.com/lindell/JsBarcode/wiki) for info about how to generate other barcode types to suit your needs. 

## Print quality & barcode performance
Initial testing has demonstrated the basic functionality of these barcodes when printed; however, you should be aware that laser-printed barcodes do not always scan as easily as the "real McCoy". This may be acceptable for temporary applications, but perhaps not for long-term or mainstream use. YMMV based on printer quality as well as your specific barcode scanners. Contrast and clarity of barcodes seems to improve when printed to PDF first rather than directly from the browser as direct-from-browser printing may introduce dithering or other artifacts.

## Library card graphics
Try adding a background image for style points:
https://github.com/onshisan/libcardgen/blob/c685f2d93a71446afc6bb4df32a5ba435b2f5f09/libcardgen.html#L15
