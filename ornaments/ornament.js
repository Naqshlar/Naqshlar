async function loadOrnamentPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);

    let lang = localStorage.getItem("selectedLanguage");
    if (!lang) {
        lang = await detectLanguageByIP();
    }

    const trRes = await fetch(`i18n/${lang}.json`);
    const translations = await trRes.json();

    const res = await fetch("ornaments.json");
    const ornaments = await res.json();

    const item = ornaments.find(o => o.id === id);

    if (!item) {
        document.getElementById("ornament-title").innerText = "Not found";
        return;
    }

    // Apply translations
    document.getElementById("ornament-title").innerText =
        translations[item.key + ".title"] || "Untitled";
    
    const contextText = translations[item.key + ".context"] || "";
    const contentParagraphs = contextText.split('\n')
                                                .filter(p => p.trim() !== '')
                                                .map(p => `<p>${p}</p>`)
                                                .join('');
    document.getElementById("ornament-context").innerHTML = contentParagraphs;

    const descriptionText = translations[item.key + ".description"] || "";
    const descriptionParagraphs = descriptionText.split('\n')
                                                        .filter(p => p.trim() !== '')
                                                        .map(p => `<p>${p}</p>`)
                                                        .join('');
    document.getElementById("ornament-description").innerHTML = descriptionParagraphs;

    document.getElementById("download-btn").href = `files/${item.filename}.stl`;
    
    document.getElementById("ornament-image").src = `images/${item.filename}.png`;
    document.getElementById("ornament-image").alt = translations[item.key + ".alt"] || "";
    document.getElementById("ornament-caption").innerText = translations[item.key + ".caption"] || "";

    // Previous / Next navigation
    const prevLink = document.getElementById("prev-link");
    const nextLink = document.getElementById("next-link");

    if (id > 1) {
        prevLink.href = `ornament.html?id=${id - 1}`;
    } else {
        prevLink.classList.add("disabled");
        prevLink.removeAttribute("href");
    }

    if (id < ornaments.length) {
        nextLink.href = `ornament.html?id=${id + 1}`;
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

document.addEventListener("DOMContentLoaded", loadOrnamentPage);