const state = {
    patrons: [],
    selectedPatron: null
};

const el = {
    fileInput: document.getElementById("patron-file"),
    clearFileBtn: document.getElementById("clear-file"),
    nameSearch: document.getElementById("name-search"),
    searchBtn: document.getElementById("search-btn"),
    results: document.getElementById("search-results"),
    manualBarcode: document.getElementById("manual-barcode"),
    generateBtn: document.getElementById("generate-btn"),
    printBtn: document.getElementById("print-btn"),
    status: document.getElementById("status"),
    selectedName: document.getElementById("selected-name"),
    barcodeValue: document.getElementById("barcode-value")
};

el.fileInput.addEventListener("change", onPatronFileSelected);
el.clearFileBtn.addEventListener("click", clearLoadedPatrons);
el.searchBtn.addEventListener("click", () => searchByName(el.nameSearch.value));
el.nameSearch.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchByName(el.nameSearch.value);
    }
});
el.generateBtn.addEventListener("click", onGenerateCard);
el.printBtn.addEventListener("click", () => window.print());

function setStatus(message, type = "") {
    el.status.textContent = message;
    el.status.className = "status";
    if (type) {
        el.status.classList.add(type);
    }
}

function normalizeText(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function parseCsv(text) {
    const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);

    if (lines.length < 2) {
        throw new Error("CSV must include a header row and at least one patron row.");
    }

    const headers = lines[0].split(",").map(item => item.trim().toLowerCase());
    const nameIdx = headers.indexOf("name");
    const barcodeIdx = headers.indexOf("barcode");
    const expiresIdx = headers.indexOf("expires");
    const noteIdx = headers.indexOf("note");

    if (nameIdx < 0 || barcodeIdx < 0) {
        throw new Error("CSV must include 'name' and 'barcode' headers.");
    }

    const patrons = [];
    for (let i = 1; i < lines.length; i += 1) {
        const cells = lines[i].split(",").map(item => item.trim());
        const name = cells[nameIdx] || "";
        const barcode = cells[barcodeIdx] || "";

        if (!name || !barcode) {
            continue;
        }

        patrons.push({
            id: i,
            name,
            barcode,
            expires: expiresIdx >= 0 ? cells[expiresIdx] || "" : "",
            note: noteIdx >= 0 ? cells[noteIdx] || "" : "",
            normalizedName: normalizeText(name)
        });
    }

    if (!patrons.length) {
        throw new Error("No valid patrons were found in the uploaded file.");
    }

    return patrons;
}

function onPatronFileSelected(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        try {
            state.patrons = parseCsv(String(reader.result || ""));
            state.selectedPatron = null;
            clearSearchResults();
            setStatus(`Loaded ${state.patrons.length} patron records.`, "success");
        } catch (error) {
            state.patrons = [];
            clearSearchResults();
            setStatus(error.message, "error");
        }
    };
    reader.onerror = () => setStatus("Failed to read the selected file.", "error");
    reader.readAsText(file);
}

function clearLoadedPatrons() {
    state.patrons = [];
    state.selectedPatron = null;
    el.fileInput.value = "";
    clearSearchResults();
    el.selectedName.textContent = "";
    setStatus("Loaded patron data cleared.", "success");
}

function clearSearchResults() {
    el.results.innerHTML = "";
}

function searchByName(rawQuery) {
    const query = normalizeText(rawQuery);
    clearSearchResults();

    if (!query) {
        setStatus("Enter a name to search.", "error");
        return;
    }

    if (!state.patrons.length) {
        setStatus("Load a patron CSV first, then search by name.", "error");
        return;
    }

    const matches = state.patrons
        .filter(p => p.normalizedName.includes(query))
        .slice(0, 25);

    if (!matches.length) {
        setStatus(`No patrons found for “${rawQuery}”.`, "error");
        return;
    }

    matches.forEach(patron => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        const metadata = [patron.expires ? `exp ${patron.expires}` : "", patron.note]
            .filter(Boolean)
            .join(" • ");

        button.className = "result-btn";
        button.type = "button";
        button.textContent = metadata ? `${patron.name} (${metadata})` : patron.name;
        button.addEventListener("click", () => selectPatron(patron));

        item.appendChild(button);
        el.results.appendChild(item);
    });

    setStatus(`Found ${matches.length} matching patron(s).`, "success");
}

function selectPatron(patron) {
    state.selectedPatron = patron;
    el.selectedName.textContent = patron.name;
    el.manualBarcode.value = patron.barcode;
    setStatus(`Selected ${patron.name}. Barcode loaded.`, "success");
}

function isLikelyBarcode(value) {
    return /^\d{6,20}$/.test(value);
}

function renderBarcode(barcode) {
    JsBarcode("#barcode", barcode, {
        format: "codabar",
        width: 1,
        height: 40,
        text: barcode,
        displayValue: false
    });
    el.barcodeValue.textContent = barcode;
}

function onGenerateCard() {
    const barcodeInput = el.manualBarcode.value.trim();

    if (!barcodeInput) {
        setStatus("Enter a barcode or choose a patron search result.", "error");
        return;
    }

    if (!isLikelyBarcode(barcodeInput)) {
        setStatus("Barcode must be numeric and 6-20 digits.", "error");
        return;
    }

    renderBarcode(barcodeInput);
    setStatus("Card preview generated. Ready to print.", "success");
}
