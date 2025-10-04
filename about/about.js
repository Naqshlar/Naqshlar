async function loadAboutPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);

    let lang = localStorage.getItem("selectedLanguage");
    if (!lang) {
        lang = await detectLanguageByIP();
    }

    const translateResource = await fetch(`i18n/${lang}.json`);
    const translations = await translateResource.json();
    
    document.getElementById("focus-school-logo").alt = translations["focusSchoolAlt"] || "";
    document.getElementById("focus-gravity-hub-logo").alt = translations["focusGravityHubAlt"] || "";
    document.getElementById("swiss-logo").alt = translations["swissAlt"] || "";
    
    document.getElementById("focus-school-link").ariaLabel = translations["focusSchoolLink"] || "";
    document.getElementById("focus-gravity-hub-link").ariaLabel = translations["focusGravityHubLink"] || "";
 
    setLanguage(lang, translations);

    document.body.classList.remove("preload");
    document.getElementById("content")?.removeAttribute("aria-busy");
}

document.addEventListener("DOMContentLoaded", loadAboutPage);