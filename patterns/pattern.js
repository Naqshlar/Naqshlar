async function loadPatternPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);

    let lang = getStoredLanguage();
    if (!lang) {
        showChoosingLanguagePage();
        return;
    }

    const [translations, patternsRes] = await Promise.all([
        loadTranslations(lang),
        fetch("patterns.json")
    ]);

    const patterns = await patternsRes.json();
    const item = patterns.find(o => o.id === id);

    if (!item) {
        document.getElementById("pattern-title").innerText = "Not found";
        return;
    }

    document.getElementById("pattern-title").innerText = translations[item.key + ".title"] || "Untitled";
    document.getElementById("pattern-context").innerHTML = splitIntoParagraphs(translations[item.key + ".context"] || "");
    document.getElementById("pattern-description").innerHTML = translations[item.key + ".description"] || "";
    document.getElementById("download-btn").href = `files/${item.filename}.stl`;

    const patternImage = document.getElementById("pattern-image");
    patternImage.src = `images/${item.filename}.png`;
    patternImage.alt = translations[item.key + ".alt"] || "";

    document.getElementById("pattern-caption").innerText = translations[item.key + ".caption"] || "";

    setupNavigation(id, patterns.length);
    setLanguage(lang, translations);
}

function setupNavigation(currentId, totalPatterns) {
    const prevLink = document.getElementById("prev-link");
    const nextLink = document.getElementById("next-link");

    if (currentId > 1) {
        prevLink.href = `pattern.html?id=${currentId - 1}`;
    } else {
        prevLink.classList.add("disabled");
        prevLink.removeAttribute("href");
    }

    if (currentId < totalPatterns) {
        nextLink.href = `pattern.html?id=${currentId + 1}`;
    } else {
        nextLink.classList.add("disabled");
        nextLink.removeAttribute("href");
    }
}

document.addEventListener("DOMContentLoaded", loadPatternPage);