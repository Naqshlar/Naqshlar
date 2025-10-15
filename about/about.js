async function loadAboutPage() {
    const pageLoader = new PageLoader();
    const initialized = await pageLoader.initialize();

    if (!initialized) return;

    const elementsConfig = {
        "focus-school-logo": { alt: "focusSchoolAlt" },
        "focus-gravity-hub-logo": { alt: "focusGravityHubAlt" },
        "swiss-logo": { alt: "swissAlt" },
    };

    pageLoader.setElementsAttributes(elementsConfig);
}

document.addEventListener("DOMContentLoaded", loadAboutPage);