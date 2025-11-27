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
var envelope = document.getElementById("envelope");
var invitation = document.getElementById("invitation");
var isAnimating = false;

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
// Music Toggle Control
var musicFrame = document.getElementById('musicFrame');
var musicToggle = document.getElementById('musicToggle');
var musicIcon = document.querySelector('.music-icon');

// Wait for iframe to load
musicFrame.onload = function () {
    // Get initial music state
    musicFrame.contentWindow.postMessage('getMusicState', '*');
};

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
    musicFrame.contentWindow.postMessage('toggleMusic', '*');
});

        // Try to play immediately (works on desktop)
        startMusic();

        // Save time every second
        setInterval(function () {
            if (!bgMusic.paused) {
                sessionStorage.setItem('musicTime', bgMusic.currentTime);
            }
        }, 1000);

        // Listen for commands from parent pages
        window.addEventListener('message', function (event) {
            if (event.data === 'startMusic') {
                // Force start music when envelope is clicked
                startMusic();
            } else if (event.data === 'toggleMusic') {
                if (bgMusic.paused) {
                    bgMusic.play();
                    sessionStorage.setItem('musicPlaying', 'true');
                    event.source.postMessage({ musicPlaying: true }, '*');
                } else {
                    bgMusic.pause();
                    sessionStorage.setItem('musicPlaying', 'false');
                    event.source.postMessage({ musicPlaying: false }, '*');
                }
            } else if (event.data === 'getMusicState') {
                event.source.postMessage({
                    musicPlaying: !bgMusic.paused
                }, '*');
            }
        });

        // Save time before page unload
        window.addEventListener('beforeunload', function () {
            sessionStorage.setItem('musicTime', bgMusic.currentTime);
        });
    </script>
</body>
</html>

