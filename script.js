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

    // Envelope interaction
    var envelope = document.getElementById("envelope");
    var invitation = document.getElementById("invitation");
    var isAnimating = false;

    if (envelope && invitation) {
        envelope.addEventListener("click", function (e) {
            if (!envelope.classList.contains("open") && !isAnimating) {
                isAnimating = true;
                envelope.classList.add("open");
                
                // Start music on mobile when user interacts
                var musicFrame = document.getElementById('musicFrame');
                if (musicFrame && musicFrame.contentWindow) {
                    musicFrame.contentWindow.postMessage('startMusic', '*');
                }
                
                setTimeout(function () {
                    invitation.classList.add("show");
                    isAnimating = false;
                }, 600);
            }
            e.stopPropagation();
        });

        invitation.addEventListener("click", function (e) {
            if (invitation.classList.contains("show") && !isAnimating) {
                window.location.href = "homepage/homepage.html";
            }
            e.stopPropagation();
        });
    }

    // Music Toggle Control (only if elements exist)
    var musicFrame = document.getElementById('musicFrame');
    var musicToggle = document.getElementById('musicToggle');
    var musicIcon = document.querySelector('.music-icon');

    if (musicFrame) {
        // Wait for iframe to load
        musicFrame.onload = function () {
            // Get initial music state
            if (musicFrame.contentWindow) {
                musicFrame.contentWindow.postMessage('getMusicState', '*');
            }
        };
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


