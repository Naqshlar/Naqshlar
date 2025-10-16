(function () {
    if (window.location.hostname === CONFIG.ANALYTICS_DOMAIN) {
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());
        gtag('config', CONFIG.ANALYTICS_ID);

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.ANALYTICS_ID;
        document.head.appendChild(script);
    }
})();