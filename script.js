// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - Wedding invitation script starting');

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
    var hasOpened = false;

    console.log('Envelope element:', envelope);
    console.log('Invitation element:', invitation);

    if (envelope && invitation) {
        // Function to open envelope
        function openEnvelope() {
            console.log('openEnvelope called - hasOpened:', hasOpened, 'isAnimating:', isAnimating);
            if (!hasOpened && !isAnimating) {
                hasOpened = true;
                isAnimating = true;
                envelope.classList.add("open");
                console.log('Envelope opened - class added');
                
                // Start music on user interaction
                var musicFrame = document.getElementById('musicFrame');
                if (musicFrame) {
                    setTimeout(function() {
                        try {
                            if (musicFrame.contentWindow) {
                                musicFrame.contentWindow.postMessage('startMusic', '*');
                                console.log('Music start message sent');
                            }
                        } catch (err) {
                            console.log('Music error:', err);
                        }
                    }, 100);
                }
                
                setTimeout(function () {
                    invitation.classList.add("show");
                    isAnimating = false;
                    console.log('Invitation card shown');
                }, 600);
            }
        }

        // Handle envelope click/touch - use multiple event types for better mobile support
        envelope.addEventListener("click", function (e) {
            console.log('Envelope CLICK event');
            openEnvelope();
        });

        envelope.addEventListener("touchend", function (e) {
            console.log('Envelope TOUCHEND event');
            e.preventDefault(); // Prevent click event from also firing
            openEnvelope();
        }, { passive: false });

        // Handle invitation card click/touch
        function goToHomepage() {
            console.log('goToHomepage called - invitation has show class:', invitation.classList.contains("show"));
            if (invitation.classList.contains("show") && !isAnimating) {
                console.log('Navigating to homepage');
                window.location.href = "homepage/homepage.html";
            }
        }

        invitation.addEventListener("click", function (e) {
            console.log('Invitation CLICK event');
            goToHomepage();
        });

        invitation.addEventListener("touchend", function (e) {
            console.log('Invitation TOUCHEND event');
            e.preventDefault();
            goToHomepage();
        }, { passive: false });

        console.log('Event listeners attached successfully');
    } else {
        console.error('ERROR: Envelope or invitation element not found!');
        if (!envelope) console.error('Envelope element is null');
        if (!invitation) console.error('Invitation element is null');
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

    console.log('Script initialization complete');
});
