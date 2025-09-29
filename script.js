async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const translations = await response.json();
        return translations;
    } catch (error) {
        console.error('Ошибка загрузки переводов:', error);
        return {};
    }
}

function setLanguage(lang, translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Обновляем отображаемый язык и флаг
    const currentFlag = document.getElementById('current-flag');
    const currentLang = document.getElementById('current-lang');
    const langMap = {
        'uz': { flagClass: 'uz', text: 'O‘zbekcha' },
        'ru': { flagClass: 'ru', text: 'Русский' },
        'en': { flagClass: 'en', text: 'English' }
    };
    currentFlag.className = `flag ${langMap[lang].flagClass}`;
    currentLang.textContent = langMap[lang].text;

    document.getElementById('lang-select').value = lang;
    localStorage.setItem('selectedLanguage', lang);

    // Скрываем дропдаун после выбора
    document.getElementById('lang-switcher').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', async () => {
    const translations = await loadTranslations();
    const langSwitcher = document.getElementById('lang-switcher');
    const langSelect = document.getElementById('lang-select');

    const savedLang = localStorage.getItem('selectedLanguage') || 'uz';
    setLanguage(savedLang, translations);

    // Генерация дропдауна
    const langOptions = `
        <div class="lang-options">
            <div class="lang-option" data-lang="uz"><span class="flag uz"></span> O‘zbekcha</div>
            <div class="lang-option" data-lang="ru"><span class="flag ru"></span> Русский</div>
            <div class="lang-option" data-lang="en"><span class="flag en"></span> English</div>
        </div>
    `;
    langSwitcher.insertAdjacentHTML('beforeend', langOptions);

    // Обработчик клика для открытия/закрытия дропдауна
    langSwitcher.addEventListener('click', (event) => {
        langSwitcher.classList.toggle('active');
    });

    // Обработчик выбора языка
    langSwitcher.addEventListener('click', (event) => {
        const option = event.target.closest('.lang-option');
        if (option) {
            const selectedLang = option.getAttribute('data-lang');
            setLanguage(selectedLang, translations);
        }
    });

    // Закрытие дропдауна при клике вне его
    document.addEventListener('click', (event) => {
        if (!langSwitcher.contains(event.target)) {
            langSwitcher.classList.remove('active');
        }
    });

    // Синхронизация с нативным select для доступности
    langSelect.addEventListener('change', (event) => {
        setLanguage(event.target.value, translations);
    });
});