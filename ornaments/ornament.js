async function loadOrnamentPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);

    const res = await fetch("ornaments.json");
    const ornaments = await res.json();

    // Берём сохранённый язык
    const lang = localStorage.getItem("selectedLanguage") || "en";

    // Загружаем переводы
    const trRes = await fetch(`i18n/${lang}.json`);
    const translations = await trRes.json();

    const item = ornaments.find(o => o.id === id);

    if (!item) {
        document.getElementById("ornament-title").innerText = "Not found";
        return;
    }

    // Подставляем переводы
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
}

document.addEventListener("DOMContentLoaded", loadOrnamentPage);
