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

    // Music Control - Works on both PC and Mobile
    var bgMusic = document.getElementById('bgMusic');
    var musicToggle = document.getElementById('musicToggle');
    var musicIcon = document.querySelector('.music-icon');
    
    if (bgMusic) {
        console.log('Music element found');
        
        // Get saved music state
        var musicState = sessionStorage.getItem('musicPlaying');
        var savedTime = parseFloat(sessionStorage.getItem('musicTime') || '0');
        var hasInteracted = sessionStorage.getItem('hasInteracted') === 'true';
        
        console.log('Music state:', { musicState, savedTime, hasInteracted });

        // Set saved time when metadata loads
        if (savedTime > 0) {
            bgMusic.addEventListener('loadedmetadata', function() {
                bgMusic.currentTime = savedTime;
                console.log('Restored music time to:', savedTime);
            }, { once: true });
        }

        // Function to start music
        function startMusic() {
            console.log('Attempting to start music');
            bgMusic.play().then(function() {
                console.log('✓ Music playing');
                sessionStorage.setItem('musicPlaying', 'true');
                if (musicIcon && musicToggle) {
                    musicIcon.textContent = '🔊';
                    musicToggle.classList.remove('muted');
                }
            }).catch(function(error) {
                console.log('✗ Music blocked:', error.message);
            });
        }

        // Try to auto-start (works on PC, blocked on mobile)
        if (musicState === 'true' && hasInteracted) {
            setTimeout(startMusic, 300);
        }

        // Save time periodically
        setInterval(function () {
            if (!bgMusic.paused) {
                sessionStorage.setItem('musicTime', bgMusic.currentTime);
            }
        }, 1000);

        // CRITICAL FOR MOBILE: Resume music on ANY user interaction
        var musicResumed = false;
        function resumeMusic() {
            if (!musicResumed && musicState === 'true' && hasInteracted && bgMusic.paused) {
                musicResumed = true;
                console.log('User touched screen - resuming music');
                startMusic();
            }
        }

        // Listen for ANY touch/click to resume music
        document.addEventListener('touchstart', resumeMusic, { once: true, passive: true });
        document.addEventListener('touchend', resumeMusic, { once: true, passive: true });
        document.addEventListener('click', resumeMusic, { once: true });

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
                    console.log('Music paused by user');
                    if (musicIcon) {
                        musicIcon.textContent = '🔇';
                        musicToggle.classList.add('muted');
                    }
                }
            });
        }
    } else {
        console.error('bgMusic element not found!');
    }

    console.log('Homepage initialization complete');
});


