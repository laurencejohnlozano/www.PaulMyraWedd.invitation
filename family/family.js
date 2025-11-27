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
    var parentCards = document.querySelectorAll('.parent-card');

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
                }, index * 200);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    parentCards.forEach(function (card) {
        observer.observe(card);
    });
});
// Music Toggle Control
document.addEventListener('DOMContentLoaded', function () {
    var musicFrame = document.getElementById('musicFrame');
    var musicToggle = document.getElementById('musicToggle');
    var musicIcon = document.querySelector('.music-icon');

    if (musicFrame) {
        // Wait for iframe to load
        musicFrame.onload = function () {
            if (musicFrame.contentWindow) {
                setTimeout(function() {
                    try {
                        musicFrame.contentWindow.postMessage('startMusic', '*');
                        musicFrame.contentWindow.postMessage('getMusicState', '*');
                    } catch (err) {
                        console.log('Music error:', err);
                    }
                }, 200);
            }
        };

        // Immediate attempt
        setTimeout(function() {
            if (musicFrame.contentWindow) {
                try {
                    musicFrame.contentWindow.postMessage('startMusic', '*');
                } catch (err) {}
            }
        }, 500);
    }

    // Listen for music state updates
    window.addEventListener('message', function (event) {
        if (event.data.musicPlaying !== undefined && musicIcon && musicToggle) {
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
    if (musicToggle && musicFrame) {
        musicToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (musicFrame.contentWindow) {
                musicFrame.contentWindow.postMessage('toggleMusic', '*');
            }
        });
    }
});
