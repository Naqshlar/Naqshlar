async function loadAboutPage() {
    let lang = getStoredLanguage();
    if (!lang) {
        showChoosingLanguagePage();
        return;
    }

    const translations = await loadTranslations(lang);

    const logoAlts = {
        "focus-school-logo": "focusSchoolAlt",
        "focus-gravity-hub-logo": "focusGravityHubAlt",
        "swiss-logo": "swissAlt"
    };

    Object.entries(logoAlts).forEach(([id, key]) => {
        const element = document.getElementById(id);
        if (element) {
            element.alt = translations[key] || "";
        }
    });

    const linkAriaLabels = {
        "focus-school-link": "focusSchoolLink",
        "focus-gravity-hub-link": "focusGravityHubLink"
    };

    Object.entries(linkAriaLabels).forEach(([id, key]) => {
        const element = document.getElementById(id);
        if (element) {
            element.ariaLabel = translations[key] || "";
        }
    });

    setLanguage(lang, translations);
}

document.addEventListener("DOMContentLoaded", loadAboutPage);