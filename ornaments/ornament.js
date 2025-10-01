async function loadOrnamentPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);

    const res = await fetch("ornaments.json");
    const ornaments = await res.json();

    const lang = localStorage.getItem("selectedLanguage") || "en";

    // Loading translations
    const trRes = await fetch(`i18n/${lang}.json`);
    const translations = await trRes.json();

    const item = ornaments.find(o => o.id === id);

    if (!item) {
        document.getElementById("ornament-title").innerText = "Not found";
        return;
    }

    // Apply translations
    document.getElementById("ornament-title").innerText =
        translations[item.key + ".title"] || "Untitled";
    document.getElementById("ornament-description").innerText =
        translations[item.key + ".description"] || "";

    document.getElementById("download-btn").href = `files/${item.file}`;

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

    document.body.classList.remove("preload");
    document.getElementById("content")?.removeAttribute("aria-busy");
}

document.addEventListener("DOMContentLoaded", loadOrnamentPage);
