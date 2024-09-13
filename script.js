function generateBarcode() {
    const barcodeInput = prompt("Enter the barcode number:");
    if (barcodeInput) {
        document.getElementById("barcode-value").textContent = barcodeInput;
        JsBarcode("#barcode", barcodeInput, {
            format: "CODABAR",  // Use CODABAR format
            displayValue: true,
            width: 2,
            height: 40
        });
    } else {
        alert("Please enter a valid barcode.");
    }
}
