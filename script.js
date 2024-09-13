function generateBarcode() {
    const barcodeInput = prompt("Enter the barcode number:");
    if (barcodeInput) {
        document.getElementById("barcode-value").textContent = barcodeInput;
        JsBarcode("#barcode", barcodeInput, {
            format: "codabar",  // Use correct format for your application
            width: 2,
            height: 40,
			text: barcodeInput
        });
    } else {
        alert("Please enter a valid barcode.");
    }
}
