async function loadPatternPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);

    let lang = localStorage.getItem("selectedLanguage");
    if (!lang) {
        lang = await detectLanguageByIP();
    }

    const trRes = await fetch(`i18n/${lang}.json`);
    const translations = await trRes.json();

    const res = await fetch("patterns.json");
    const patterns = await res.json();

    const item = patterns.find(o => o.id === id);

    if (!item) {
        document.getElementById("pattern-title").innerText = "Not found";
        return;
    }

    // Apply translations
    document.getElementById("pattern-title").innerText =
        translations[item.key + ".title"] || "Untitled";
    
    const contextText = translations[item.key + ".context"] || "";
    const contentParagraphs = contextText.split('\n')
                                                .filter(p => p.trim() !== '')
                                                .map(p => `<p>${p}</p>`)
                                                .join('');
    document.getElementById("pattern-context").innerHTML = contentParagraphs;

    const descriptionText = translations[item.key + ".description"] || "";
    const descriptionParagraphs = descriptionText.split('\n')
                                                        .filter(p => p.trim() !== '')
                                                        .map(p => `<p>${p}</p>`)
                                                        .join('');
    document.getElementById("pattern-description").innerHTML = descriptionParagraphs;

    document.getElementById("download-btn").href = `files/${item.filename}.stl`;
    
    document.getElementById("pattern-image").src = `images/${item.filename}.png`;
    document.getElementById("pattern-image").alt = translations[item.key + ".alt"] || "";
    document.getElementById("pattern-caption").innerText = translations[item.key + ".caption"] || "";

    // Previous / Next navigation
    const prevLink = document.getElementById("prev-link");
    const nextLink = document.getElementById("next-link");

    if (id > 1) {
        prevLink.href = `pattern.html?id=${id - 1}`;
    } else {
        prevLink.classList.add("disabled");
        prevLink.removeAttribute("href");
    }

    if (id < patterns.length) {
        nextLink.href = `pattern.html?id=${id + 1}`;
    } else {
        nextLink.classList.add("disabled");
        nextLink.removeAttribute("href");
    }

    // Apply static translations from data-i18n attributes
    setLanguage(lang, translations);

    // Now safe to show the page
    document.body.classList.remove("preload");
    document.getElementById("content")?.removeAttribute("aria-busy");
}

document.addEventListener("DOMContentLoaded", loadPatternPage);