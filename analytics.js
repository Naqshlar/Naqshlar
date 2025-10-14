(function () {
    if (window.location.hostname === 'naqshlar.github.io') {
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());
        gtag('config', 'G-4BYQ7RYCKR');

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-4BYQ7RYCKR';
        document.head.appendChild(script);
    }
})();