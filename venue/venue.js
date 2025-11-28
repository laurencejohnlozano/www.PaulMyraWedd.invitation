/// Smooth Page Transition
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

            // Save music state before navigation
            var bgMusic = document.getElementById('bgMusic');
            if (bgMusic && !bgMusic.paused) {
                sessionStorage.setItem('musicTime', bgMusic.currentTime);
                sessionStorage.setItem('musicPlaying', 'true');
            }

            // Add fade-out animation (ensure your CSS has .fade-out class)
            document.body.classList.add('fade-out');

            // Navigate after animation
            setTimeout(function () {
                window.location.href = href;
            }, 400);
        });
    });
});

// Music Control & Animations
document.addEventListener('DOMContentLoaded', function () {
    
    // --- 1. Gallery Animation (From Venue) ---
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

    galleryItems.forEach(function (item) {
        observer.observe(item);
    });

    // --- 2. Music Logic (Copied from Venue) ---
    var bgMusic = document.getElementById('bgMusic');
    var musicToggle = document.getElementById('musicToggle');
    var musicIcon = document.querySelector('.music-icon');

    if (bgMusic) {
        var musicState = sessionStorage.getItem('musicPlaying');
        var savedTime = parseFloat(sessionStorage.getItem('musicTime') || '0');
        var hasInteracted = sessionStorage.getItem('hasInteracted') === 'true';

        // Create continue button for autoplay blocks
        var continueBtn = document.createElement('div');
        continueBtn.innerHTML = '🎵 Continue Music';
        continueBtn.style.cssText = `
            position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(135deg, #5C0A0A, #3D0707); color: #F8F4F0;
            padding: 12px 25px; border-radius: 30px; font-family: 'Playfair Display', serif;
            font-size: 14px; cursor: pointer; z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: none;
        `;
        document.body.appendChild(continueBtn);

        // Restore saved time
        if (savedTime > 0) {
            bgMusic.addEventListener('loadedmetadata', function() {
                bgMusic.currentTime = savedTime;
            }, { once: true });
        }

        function startMusic() {
            bgMusic.play().then(function() {
                sessionStorage.setItem('musicPlaying', 'true');
                continueBtn.style.display = 'none';
                if (musicIcon && musicToggle) {
                    musicIcon.textContent = '🔊';
                    musicToggle.classList.remove('muted');
                }
            }).catch(function() {
                continueBtn.style.display = 'block';
            });
        }

        // Continue button click
        continueBtn.addEventListener('click', function() {
            startMusic();
        });

        // Try auto-continue if it was playing previously
        if (musicState === 'true') {
            setTimeout(function() {
                bgMusic.play().then(function() {
                    continueBtn.style.display = 'none';
                    if (musicIcon && musicToggle) {
                        musicIcon.textContent = '🔊';
                        musicToggle.classList.remove('muted');
                    }
                }).catch(function() {
                    continueBtn.style.display = 'block';
                });
            }, 500);
        }

        // Save time constantly
        setInterval(function () {
            if (!bgMusic.paused) {
                sessionStorage.setItem('musicTime', bgMusic.currentTime);
            }
        }, 1000);

        // Toggle Button Click
        if (musicToggle) {
            musicToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                if (bgMusic.paused) {
                    startMusic();
                } else {
                    bgMusic.pause();
                    sessionStorage.setItem('musicPlaying', 'false');
                    continueBtn.style.display = 'none';
                    if (musicIcon) {
                        musicIcon.textContent = '🔇';
                        musicToggle.classList.add('muted');
                    }
                }
            });
        }
    }
});
