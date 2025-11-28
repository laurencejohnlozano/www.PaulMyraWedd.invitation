document.addEventListener('DOMContentLoaded', function () {
    // Smooth Page Transition
    var links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href.startsWith('http') || href.startsWith('#')) return;
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(function () { window.location.href = href; }, 400);
        });
    });
    
    // Gallery fade-in animations
    var galleryItems = document.querySelectorAll('.gallery-item');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                setTimeout(function () {
                    entry.target.style.transition = 'all 0.8s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    galleryItems.forEach(function (item) { observer.observe(item); });
});
