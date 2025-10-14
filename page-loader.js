class PageLoader {
    constructor() {
        this.lang = null;
        this.translations = null;
    }

    async initialize() {
        this.lang = getStoredLanguage();
        if (!this.lang) {
            showChoosingLanguagePage();
            return false;
        }

        this.translations = await loadTranslations(this.lang);
        setLanguage(this.lang, this.translations);
        return true;
    }

    getTranslation(key) {
        return this.translations?.[key] || '';
    }

    setElementsAttributes(elementsConfig) {
        Object.entries(elementsConfig).forEach(([id, attributes]) => {
            const element = document.getElementById(id);
            if (!element) return;

            Object.entries(attributes).forEach(([attr, translationKey]) => {
                const value = this.getTranslation(translationKey);
                if (value) {
                    if (attr === 'ariaLabel') {
                        element.ariaLabel = value;
                    } else {
                        element.setAttribute(attr, value);
                    }
                }
            });
        });
    }
}