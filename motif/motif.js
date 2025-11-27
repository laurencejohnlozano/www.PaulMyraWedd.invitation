// Smooth Page Transition
document.addEventListener('DOMContentLoaded', function () {
    // Intercept all navigation links
    var links = document.querySelectorAll('a[href$=".html"]');

    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');

            // Skip external links or anchors
            if (href.startsWith('http') || href.startsWith('#')) {
                return;
            }

            e.preventDefault();

            // Add fade-out animation
            document.body.classList.add('fade-out');

            // Navigate after animation
            setTimeout(function () {
                window.location.href = href;
            }, 400);
        });
    });
});
// Fade in animation on scroll
document.addEventListener('DOMContentLoaded', function () {
    var attireCards = document.querySelectorAll('.attire-card, .color-palette-section');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function () {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';

                    setTimeout(function () {
                        entry.target.style.transition = 'all 0.8s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 150);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    attireCards.forEach(function (card) {
        observer.observe(card);
    });
});
// Music Toggle Control
document.addEventListener('DOMContentLoaded', function () {
    var musicFrame = document.getElementById('musicFrame');
    var musicToggle = document.getElementById('musicToggle');
    var musicIcon = document.querySelector('.music-icon');

    // Check if elements exist
    if (!musicFrame || !musicToggle || !musicIcon) {
        console.error('Music toggle elements not found');
        return;
    }

    // Wait for iframe to load
    musicFrame.onload = function () {
        // Get initial music state and start music
        try {
            if (musicFrame.contentWindow) {
                setTimeout(function() {
                    musicFrame.contentWindow.postMessage('startMusic', '*');
                    musicFrame.contentWindow.postMessage('getMusicState', '*');
                }, 200);
            }
        } catch (e) {
            console.error('Error communicating with music frame:', e);
        }
    };

    // Immediate attempt
    setTimeout(function() {
        if (musicFrame.contentWindow) {
            try {
                musicFrame.contentWindow.postMessage('startMusic', '*');
            } catch (e) {}
        }
    }, 500);

    // Listen for music state updates
    window.addEventListener('message', function (event) {
        if (event.data.musicPlaying !== undefined) {
            if (event.data.musicPlaying) {
                musicIcon.textContent = '🔊';
                musicToggle.classList.remove('muted');
            } else {
                musicIcon.textContent = '🔇';
                musicToggle.classList.add('muted');
            }
        }
    });

    // Toggle music button
    musicToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        try {
            musicFrame.contentWindow.postMessage('toggleMusic', '*');
        } catch (e) {
            console.error('Error toggling music:', e);
        }
    });
});

