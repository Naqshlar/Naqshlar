async function loadPatternPage() {
    try {
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get("id"), 10);

        if (isNaN(id)) {
            showError("Invalid pattern ID");
            return;
        }

        const pageLoader = new PageLoader();
        const initialized = await pageLoader.initialize();

        if (!initialized) return;

        const patternsRes = await fetch("patterns.json");
        if (!patternsRes.ok) {
            throw new Error(`Failed to load patterns: ${patternsRes.status}`);
        }

        const patterns = await patternsRes.json();
        const item = patterns.find(o => o.id === id);

        if (!item) {
            showError("Pattern not found");
            return;
        }

        updatePatternContent(item, pageLoader.translations);
        setupNavigation(id, patterns.length);
    } catch (error) {
        console.error('Error loading pattern page:', error);
        showError("Failed to load pattern");
    }
}

function updatePatternContent(item, translations) {
    const elements = {
        "pattern-title": translations[item.key + ".title"] || "Untitled",
        "pattern-description": translations[item.key + ".description"] || ""
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.innerHTML = value;
    });

    document.getElementById("pattern-context").innerHTML =
        splitIntoParagraphs(translations[item.key + ".context"] || "");

    document.getElementById("download-btn").href = `../assets/stls/${item.filename}.stl`;

    const patternImage = document.getElementById("pattern-image");
    patternImage.src = `../assets/images/patterns/${item.filename}.png`;
    patternImage.alt = translations[item.key + ".alt"] || "";

    document.getElementById("pattern-caption").innerText =
        translations[item.key + ".caption"] || "";
}

function showError(message) {
    const titleElement = document.getElementById("pattern-title");
    if (titleElement) {
        titleElement.innerText = message;
    }

    const elementsToHide = [
        "pattern-context",
        "pattern-image",
        "pattern-caption",
        "pattern-description",
        "download-btn",
        "prev-link",
        "next-link"
    ];

    elementsToHide.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = "none";
        }
    });

    const descriptionLabel = document.querySelector('[data-i18n="descriptionLabel"]');
    if (descriptionLabel) {
        descriptionLabel.style.display = "none";
    }
}

function setupNavigation(currentId, totalPatterns) {
    const prevLink = document.getElementById("prev-link");
    const nextLink = document.getElementById("next-link");

    if (!prevLink || !nextLink) return;

    if (currentId > 1) {
        prevLink.href = `pattern.html?id=${currentId - 1}`;
        prevLink.classList.remove("disabled");
    } else {
        prevLink.classList.add("disabled");
        prevLink.removeAttribute("href");
    }

    if (currentId < totalPatterns) {
        nextLink.href = `pattern.html?id=${currentId + 1}`;
        nextLink.classList.remove("disabled");
    } else {
        nextLink.classList.add("disabled");
        nextLink.removeAttribute("href");
    }
}

document.addEventListener("DOMContentLoaded", loadPatternPage);