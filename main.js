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

function applyLanguage(lang, translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) element.innerHTML = translations[key];
    });

    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('selectedLanguage', lang);
    document.body.classList.remove("preload");
    document.getElementById("content")?.removeAttribute("aria-busy");
}

function showChoosingLanguagePage() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'choose-language.html') {
        localStorage.setItem('languageRedirectRef', document.URL);
        window.location.href = '/choose-language.html';
    }
}

function setLanguage(lang, translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            if (key === 'introduction') {
                const text = translations[key];
                const paragraphs = text
                    .split('\n')
                    .filter(p => p.trim() !== '')
                    .map(p => `<p>${p}</p>`)
                    .join('');
                element.innerHTML = paragraphs;
            } else {
                element.innerHTML = translations[key];
            }
        }
    });

    const currentFlag = document.getElementById('current-flag');
    const currentLang = document.getElementById('current-lang');
    const langMap = {
        'uz': {flagClass: 'uz', text: ''},
        'ru': {flagClass: 'ru', text: ''},
        'en': {flagClass: 'en', text: ''}
    };
    if (currentFlag && currentLang && langMap[lang]) {
        currentFlag.className = `flag ${langMap[lang].flagClass}`;
        currentLang.textContent = langMap[lang].text;
    }

    try {
        localStorage.setItem('selectedLanguage', lang);
    } catch (e) {
        console.warn('Could not save language to localStorage:', e);
    }

    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.classList.remove('active');
    }

    // For better WCAG compatibility in Uzbek 
    document.querySelectorAll('div, h1, h2, h3, h4, a').forEach(div => {
        if (div.getAttribute('aria-label')) return;
        div.setAttribute('aria-label', div.textContent.toLowerCase());
    });
    
    if (document.title !== 'Choose a language') {
        document.documentElement.setAttribute('lang', lang);
    }

    document.body.classList.remove("preload");
    document.getElementById("content")?.removeAttribute("aria-busy");

}

document.addEventListener('DOMContentLoaded', async () => {

    const isDynamic = document.querySelector('#pattern-title') !== null;
    if (isDynamic) {
        return;
    }

    let savedLang = null;
    try {
        savedLang = localStorage.getItem('selectedLanguage');
    } catch (e) {
        console.warn('Could not read language from localStorage:', e);
    }
    if (!savedLang) {
        showChoosingLanguagePage();
    } else {
        const translations = await loadTranslations(savedLang);
        setLanguage(savedLang, translations);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.language a').forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const lang = link.dataset.lang;
            const translations = await loadTranslations(lang);
            await applyLanguage(lang, translations);
            window.location.href = localStorage.getItem('languageRedirectRef') || "/";
        });
    });
});