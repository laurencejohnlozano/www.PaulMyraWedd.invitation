// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Homepage loaded');

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
            }
            
            document.body.classList.add('fade-out');
            setTimeout(function () {
                window.location.href = href;
            }, 400);
        });
    });

    // Smooth scrolling for navigation links
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href.includes('.html')) {
                return;
            }
            e.preventDefault();
            navLinks.forEach(function (navLink) {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            var targetId = href;
            var targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Countdown Timer
    function updateCountdown() {
        var weddingDate = new Date('January 16, 2026 00:00:00').getTime();
        var now = new Date().getTime();
        var distance = weddingDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days < 10 ? '0' + days : days;
        document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Music Control with Resume Button
    var bgMusic = document.getElementById('bgMusic');
    var musicToggle = document.getElementById('musicToggle');
    var musicIcon = document.querySelector('.music-icon');
    
    console.log('bgMusic element:', bgMusic);
    
    if (bgMusic) {
        // Get saved music state
        var musicState = sessionStorage.getItem('musicPlaying');
        var savedTime = parseFloat(sessionStorage.getItem('musicTime') || '0');
        var hasInteracted = sessionStorage.getItem('hasInteracted') === 'true';
        
        console.log('Music state from sessionStorage:', {
            musicState: musicState,
            savedTime: savedTime,
            hasInteracted: hasInteracted,
            bgMusicPaused: bgMusic.paused
        });

        // Create resume button IMMEDIATELY
        var resumeBtn = document.createElement('div');
        resumeBtn.id = 'musicResumeBtn';
        resumeBtn.innerHTML = '🎵 Tap to Continue Music';
        resumeBtn.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #5C0A0A, #3D0707);
            color: #F8F4F0;
            padding: 20px 40px;
            border-radius: 50px;
            font-family: 'Playfair Display', serif;
            font-size: 18px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
            display: none;
        `;

        document.body.appendChild(resumeBtn);
        console.log('Resume button created and added to page');

        // ALWAYS show button if music should be playing
        if (musicState === 'true' && hasInteracted) {
            console.log('Music should be playing - showing button immediately');
            resumeBtn.style.display = 'block';
        }

        // Set saved time when metadata loads
        if (savedTime > 0) {
            bgMusic.addEventListener('loadedmetadata', function() {
                bgMusic.currentTime = savedTime;
                console.log('Restored music time to:', savedTime);
            }, { once: true });
        }

        // Function to start music
        function startMusic() {
            console.log('startMusic() called');
            bgMusic.play().then(function() {
                console.log('✓ Music playing successfully');
                sessionStorage.setItem('musicPlaying', 'true');
                resumeBtn.style.display = 'none';
                if (musicIcon && musicToggle) {
                    musicIcon.textContent = '🔊';
                    musicToggle.classList.remove('muted');
                }
            }).catch(function(error) {
                console.log('✗ Music blocked:', error.message);
                resumeBtn.style.display = 'block';
            });
        }

        // Resume button click
        resumeBtn.addEventListener('click', function() {
            console.log('Resume button clicked!');
            startMusic();
        });

        // Try auto-start (works on PC only)
        if (musicState === 'true' && hasInteracted) {
            setTimeout(function() {
                console.log('Attempting auto-start...');
                bgMusic.play().then(function() {
                    console.log('✓ Auto-start successful (PC)');
                    resumeBtn.style.display = 'none';
                    sessionStorage.setItem('musicPlaying', 'true');
                    if (musicIcon && musicToggle) {
                        musicIcon.textContent = '🔊';
                        musicToggle.classList.remove('muted');
                    }
                }).catch(function(error) {
                    console.log('✗ Auto-start blocked (Mobile) - button should be visible');
                    // Button already visible from above
                });
            }, 500);
        }

        // Save time periodically
        setInterval(function () {
            if (!bgMusic.paused) {
                sessionStorage.setItem('musicTime', bgMusic.currentTime);
            }
        }, 1000);

        // Toggle button
        if (musicToggle) {
            musicToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                if (bgMusic.paused) {
                    sessionStorage.setItem('hasInteracted', 'true');
                    startMusic();
                } else {
                    bgMusic.pause();
                    sessionStorage.setItem('musicPlaying', 'false');
                    resumeBtn.style.display = 'none';
                    if (musicIcon) {
                        musicIcon.textContent = '🔇';
                        musicToggle.classList.add('muted');
                    }
                }
            });
        }
    } else {
        console.error('❌ bgMusic element NOT FOUND!');
    }

    console.log('Homepage initialization complete');
});

