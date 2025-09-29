// Function to load translations
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const translations = await response.json();
        return translations;
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
        const country = data.country; // For example, "RU", "UZ", "GB"

        const countryToLang = {
            "UZ": "uz",
            "RU": "ru",
            "KZ": "ru",
            "GB": "en",
            "US": "en",
            // Add other countries if needed
        };

        return countryToLang[country] || "en"; // Fallback: English
    } catch (error) {
        console.error('Error detecting language by IP:', error);
        return "en";
    }
}

// Function to set language
function setLanguage(lang, translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (key === 'introduction') {  // Специальная обработка для введения
                const text = translations[lang][key];
                const paragraphs = text.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
                element.innerHTML = paragraphs;
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Update the displayed language and flag
    const currentFlag = document.getElementById('current-flag');
    const currentLang = document.getElementById('current-lang');
    const langMap = {
        'uz': { flagClass: 'uz', text: '' },
        'ru': { flagClass: 'ru', text: '' },
        'en': { flagClass: 'en', text: '' }
    };
    currentFlag.className = `flag ${langMap[lang].flagClass}`;
    currentLang.textContent = langMap[lang].text;

    document.getElementById('lang-select').value = lang;
    localStorage.setItem('selectedLanguage', lang);

    // Hide the dropdown after selection
    document.getElementById('lang-switcher').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', async () => {
    const placeholder = document.getElementById('lang-switcher-placeholder');
    const response = await fetch('header.html');
    if (response.ok) {
        const headerContent = await response.text();
        placeholder.innerHTML = headerContent;
    } else {
        console.error('Failed to load header.html');
    }
    
    const translations = await loadTranslations();
    let savedLang = localStorage.getItem('selectedLanguage');

    if (!savedLang) {
        savedLang = await detectLanguageByIP(); // Auto-detection
    }

    setLanguage(savedLang, translations);

    // Generate dropdown
    const langOptions = `
        <div class="lang-options">
            <div class="lang-option" data-lang="uz"><span class="flag uz"></span> O‘zbekcha</div>
            <div class="lang-option" data-lang="ru"><span class="flag ru"></span> Русский</div>
            <div class="lang-option" data-lang="en"><span class="flag en"></span> English</div>
        </div>
    `;
    document.getElementById('lang-switcher').insertAdjacentHTML('beforeend', langOptions);

    // Handler for opening/closing the dropdown on click
    document.getElementById('lang-switcher').addEventListener('click', (event) => {
        document.getElementById('lang-switcher').classList.toggle('active');
    });

    // Handler for language selection
    document.getElementById('lang-switcher').addEventListener('click', (event) => {
        const option = event.target.closest('.lang-option');
        if (option) {
            const selectedLang = option.getAttribute('data-lang');
            setLanguage(selectedLang, translations);
        }
    });

    // Close the dropdown on click outside
    document.addEventListener('click', (event) => {
        const langSwitcher = document.getElementById('lang-switcher');
        if (!langSwitcher.contains(event.target)) {
            langSwitcher.classList.remove('active');
        }
    });

    // Synchronization with native select for accessibility
    document.getElementById('lang-select').addEventListener('change', (event) => {
        setLanguage(event.target.value, translations);
    });
});