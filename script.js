// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Envelope page loaded');

    // Smooth Page Transition
    var links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href.startsWith('http') || href.startsWith('#')) {
                return;
            }
            e.preventDefault();
            
            // Save music state before navigation
            var bgMusic = document.getElementById('bgMusic');
            if (bgMusic && !bgMusic.paused) {
                sessionStorage.setItem('musicTime', bgMusic.currentTime);
                sessionStorage.setItem('musicPlaying', 'true');
                console.log('Saved music state before navigation:', bgMusic.currentTime);
            }
            
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
        function openEnvelope(e) {
            console.log('Envelope clicked/touched');
            if (!hasOpened && !isAnimating) {
                hasOpened = true;
                isAnimating = true;
                envelope.classList.add("open");
                console.log('Opening envelope');
                
                // Start music when envelope opens
                var bgMusic = document.getElementById('bgMusic');
                if (bgMusic) {
                    // CRITICAL: Set these BEFORE playing
                    sessionStorage.setItem('hasInteracted', 'true');
                    sessionStorage.setItem('musicPlaying', 'true');
                    sessionStorage.setItem('musicTime', '0');
                    
                    console.log('Set sessionStorage - hasInteracted: true, musicPlaying: true');
                    
                    bgMusic.play().then(function() {
                        console.log('✓ Music started on envelope open');
                        console.log('Current sessionStorage:', {
                            hasInteracted: sessionStorage.getItem('hasInteracted'),
                            musicPlaying: sessionStorage.getItem('musicPlaying'),
                            musicTime: sessionStorage.getItem('musicTime')
                        });
                    }).catch(function(error) {
                        console.log('✗ Music play error:', error);
                    });
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

        envelope.addEventListener("click", openEnvelope);
        envelope.addEventListener("touchend", openEnvelope, { passive: false });

        function goToHomepage(e) {
            console.log('Invitation clicked/touched');
            if (invitation.classList.contains("show") && !isAnimating) {
                console.log('Navigating to homepage');
                
                // Save music state AGAIN to be sure
                var bgMusic = document.getElementById('bgMusic');
                if (bgMusic) {
                    if (!bgMusic.paused) {
                        sessionStorage.setItem('musicTime', bgMusic.currentTime);
                        sessionStorage.setItem('musicPlaying', 'true');
                    }
                    sessionStorage.setItem('hasInteracted', 'true');
                    
                    console.log('Final sessionStorage before navigation:', {
                        hasInteracted: sessionStorage.getItem('hasInteracted'),
                        musicPlaying: sessionStorage.getItem('musicPlaying'),
                        musicTime: sessionStorage.getItem('musicTime')
                    });
                }
                
                window.location.href = "homepage/homepage.html";
            }
            e.preventDefault();
            e.stopPropagation();
        }

        invitation.addEventListener("click", goToHomepage);
        invitation.addEventListener("touchend", goToHomepage, { passive: false });
    } else {
        console.error('Envelope or invitation element not found!');
    }

    console.log('Script initialization complete');
});



