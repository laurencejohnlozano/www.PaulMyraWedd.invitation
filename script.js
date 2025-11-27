// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded');

    // Smooth Page Transition
    var links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href.startsWith('http') || href.startsWith('#')) {
                return;
            }
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(function () {
                window.location.href = href;
            }, 400);
        });
    });

    // Envelope interaction
    var envelope = document.getElementById("envelope");
    var invitation = document.getElementById("invitation");
    var isAnimating = false;

    console.log('Envelope:', envelope);
    console.log('Invitation:', invitation);

    if (envelope && invitation) {
        // Handle both click and touch events for mobile
        function openEnvelope(e) {
            console.log('Envelope clicked/touched');
            if (!envelope.classList.contains("open") && !isAnimating) {
                isAnimating = true;
                envelope.classList.add("open");
                console.log('Opening envelope');
                
                // Start music on user interaction
                var musicFrame = document.getElementById('musicFrame');
                if (musicFrame) {
                    setTimeout(function() {
                        try {
                            musicFrame.contentWindow.postMessage('startMusic', '*');
                            console.log('Music start message sent');
                        } catch (err) {
                            console.log('Music error:', err);
                        }
                    }, 100);
                }
                
                setTimeout(function () {
                    invitation.classList.add("show");
                    isAnimating = false;
                    console.log('Invitation shown');
                }, 600);
            }
            e.preventDefault();
            e.stopPropagation();
        }

        // Add both click and touchstart for mobile compatibility
        envelope.addEventListener("click", openEnvelope);
        envelope.addEventListener("touchstart", openEnvelope);

        function goToHomepage(e) {
            console.log('Invitation clicked/touched');
            if (invitation.classList.contains("show") && !isAnimating) {
                console.log('Navigating to homepage');
                window.location.href = "homepage/homepage.html";
            }
            e.preventDefault();
            e.stopPropagation();
        }

        invitation.addEventListener("click", goToHomepage);
        invitation.addEventListener("touchstart", goToHomepage);
    } else {
        console.error('Envelope or invitation element not found!');
    }

    // Music Toggle Control (only if elements exist)
    var musicFrame = document.getElementById('musicFrame');
    var musicToggle = document.getElementById('musicToggle');
    var musicIcon = document.querySelector('.music-icon');

    if (musicFrame) {
        musicFrame.onload = function () {
            console.log('Music frame loaded');
            if (musicFrame.contentWindow) {
                musicFrame.contentWindow.postMessage('getMusicState', '*');
            }
        };
    }

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

    if (musicToggle && musicFrame) {
        musicToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (musicFrame.contentWindow) {
                musicFrame.contentWindow.postMessage('toggleMusic', '*');
            }
        });
    }
});































