function getStoredLanguage() {
    try {
        return localStorage.getItem('selectedLanguage');
    } catch (e) {
        console.warn('Could not read language from localStorage:', e);
        return null;
    }
}

function showChoosingLanguagePage() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'choose-language.html') {
        localStorage.setItem('languageRedirectRef', document.URL);
        window.location.href = '/choose-language.html';
    }
}

async function initializePage(lang, callback = null) {
    const translations = await loadTranslations(lang);
    setLanguage(lang, translations);

    if (callback) {
        await callback(lang, translations);
    }

    return translations;
}

async function loadTranslations(lang) {
    try {
        const response = await fetch(`i18n/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        return {};
    }
}

function setLanguage(lang, translations) {
    applyTranslations(translations);

    try {
        localStorage.setItem('selectedLanguage', lang);
    } catch (e) {
        console.warn('Could not save language to localStorage:', e);
    }

    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.classList.remove('active');
    }

    if (document.title !== 'Choose a language') {
        document.documentElement.setAttribute('lang', lang);
    }

    finalizePageLoad();
}

function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        applyTranslationToElement(element, key, translations);
    });
}


function finalizePageLoad() {
    document.body.classList.remove("preload");
    const content = document.getElementById("content") || document.getElementById("main-content");
    content?.removeAttribute("aria-busy");
}

function applyTranslationToElement(element, key, translations) {
    if (!translations[key]) return;

    if (key === 'introduction') {
        element.innerHTML = splitIntoParagraphs(translations[key]);
    } else {
        element.innerHTML = translations[key];
    }
}

function splitIntoParagraphs(text) {
    return text.split('\n')
        .filter(p => p.trim() !== '')
        .map(p => `<p>${p}</p>`)
        .join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    const isDynamicPage = document.querySelector('#pattern-title') !== null;
    if (isDynamicPage) {
        return;
    }

    const savedLang = getStoredLanguage();
    if (!savedLang) {
        showChoosingLanguagePage();
    } else {
        await initializePage(savedLang);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.language a').forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const lang = link.dataset.lang;
            const translations = await loadTranslations(lang);

            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[key]) element.innerHTML = translations[key];
            });

            document.documentElement.setAttribute('lang', lang);
            localStorage.setItem('selectedLanguage', lang);

            window.location.href = localStorage.getItem('languageRedirectRef') || "/";
        });
    });
});