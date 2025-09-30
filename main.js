// Function to load translations
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

// Function to detect language by IP (example using a public API)
async function detectLanguageByIP() {
    try {
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        const country = data.country; // Example: "RU", "UZ", "GB"

        const countryToLang = {
            "UZ": "uz",
            "RU": "ru",
            "KZ": "ru",
            "GB": "en",
            "US": "en"
        };

        return countryToLang[country] || "en"; // Default fallback: English
    } catch (error) {
        console.error('Error detecting language by IP:', error);
        return "en";
    }
}

// Function to apply translations to the page
function setLanguage(lang, translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            if (key === 'introduction') {
                // Special case: split into paragraphs
                const text = translations[key];
                const paragraphs = text
                    .split('\n')
                    .filter(p => p.trim() !== '')
                    .map(p => `<p>${p}</p>`)
                    .join('');
                element.innerHTML = paragraphs;
            } else {
                element.textContent = translations[key];
            }
        }
    });

    // Update the current flag and language text
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

    // Update the native select dropdown
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = lang;
    }

    // Save choice
    try {
        localStorage.setItem('selectedLanguage', lang);
    } catch (e) {
        console.warn('Could not save language to localStorage:', e);
    }

    // Hide dropdown after selection
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.classList.remove('active');
    }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Load header content if placeholder exists
    const placeholder = document.getElementById('lang-switcher-placeholder');
    if (placeholder) {
        try {
            const response = await fetch('header.html');
            if (response.ok) {
                const headerContent = await response.text();
                placeholder.innerHTML = headerContent;
            } else {
                console.error('Failed to load header.html');
            }
        } catch (e) {
            console.error('Error loading header.html:', e);
        }
    }

    // Detect or load saved language
    let savedLang = null;
    try {
        savedLang = localStorage.getItem('selectedLanguage');
    } catch (e) {
        console.warn('Could not read language from localStorage:', e);
    }
    if (!savedLang) {
        savedLang = await detectLanguageByIP();
    }

    // Load translations for the selected language
    const translations = await loadTranslations(savedLang);

    // Apply translations to the page
    setLanguage(savedLang, translations);

    // Generate dropdown with options
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        const langOptions = `
            <div class="lang-options">
                <div class="lang-option" data-lang="uz"><span class="flag uz"></span> O‘zbekcha</div>
                <div class="lang-option" data-lang="ru"><span class="flag ru"></span> Русский</div>
                <div class="lang-option" data-lang="en"><span class="flag en"></span> English</div>
            </div>
        `;
        langSwitcher.insertAdjacentHTML('beforeend', langOptions);

        // Handler for dropdown toggle
        langSwitcher.addEventListener('click', (event) => {
            langSwitcher.classList.toggle('active');
        });

        // Handler for selecting a language
        langSwitcher.addEventListener('click', async (event) => {
            const option = event.target.closest('.lang-option');
            if (option) {
                const selectedLang = option.getAttribute('data-lang');
                const newTranslations = await loadTranslations(selectedLang);
                setLanguage(selectedLang, newTranslations);
            }
        });
    }

    // Close the dropdown on outside click
    document.addEventListener('click', (event) => {
        const langSwitcher = document.getElementById('lang-switcher');
        if (langSwitcher && !langSwitcher.contains(event.target)) {
            langSwitcher.classList.remove('active');
        }
    });

    // Sync with native select (for accessibility)
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', async (event) => {
            const selectedLang = event.target.value;
            const newTranslations = await loadTranslations(selectedLang);
            setLanguage(selectedLang, newTranslations);
        });
    }
});
