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
                console.log('Saved music time:', bgMusic.currentTime);
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

    // Music Control - Starts on Homepage
    var bgMusic = document.getElementById('bgMusic');
    var musicToggle = document.getElementById('musicToggle');
    var musicIcon = document.querySelector('.music-icon');
    
    if (bgMusic) {
        console.log('Music element found');

        // Check if coming from another page or first time on homepage
        var musicState = sessionStorage.getItem('musicPlaying');
        var savedTime = parseFloat(sessionStorage.getItem('musicTime') || '0');
        var isFirstVisit = !sessionStorage.getItem('hasVisitedHomepage');
        
        console.log('Music state:', { musicState, savedTime, isFirstVisit });

        // Mark that we've visited homepage
        if (isFirstVisit) {
            sessionStorage.setItem('hasVisitedHomepage', 'true');
        }

        // Create "Start Music" button for first-time visitors
        var startBtn = document.createElement('div');
        startBtn.id = 'musicStartBtn';
        startBtn.innerHTML = '🎵 Play Music';
        startBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #5C0A0A, #3D0707);
            color: #F8F4F0;
            padding: 12px 25px;
            border-radius: 30px;
            font-family: 'Playfair Display', serif;
            font-size: 14px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            display: none;
        `;
        document.body.appendChild(startBtn);

        // Show button on first visit
        if (isFirstVisit) {
            startBtn.style.display = 'block';
            console.log('First visit - showing start button');
        }

        // Function to start music
        function startMusic() {
            console.log('Starting music');
            bgMusic.play().then(function() {
                console.log('✓ Music playing');
                sessionStorage.setItem('musicPlaying', 'true');
                sessionStorage.setItem('hasInteracted', 'true');
                startBtn.style.display = 'none';
                if (musicIcon && musicToggle) {
                    musicIcon.textContent = '🔊';
                    musicToggle.classList.remove('muted');
                }
            }).catch(function(error) {
                console.log('✗ Play blocked:', error.message);
            });
        }

        // Start button click
        startBtn.addEventListener('click', function() {
            console.log('Start button clicked');
            startMusic();
        });

        // If returning from another page, try to continue music
        if (!isFirstVisit && musicState === 'true') {
            // Set saved time if exists
            if (savedTime > 0) {
                bgMusic.addEventListener('loadedmetadata', function() {
                    bgMusic.currentTime = savedTime;
                    console.log('Restored time to:', savedTime);
                }, { once: true });
            }

            // Try autoplay (works on PC)
            setTimeout(function() {
                bgMusic.play().then(function() {
                    console.log('✓ Continued music automatically');
                    if (musicIcon && musicToggle) {
                        musicIcon.textContent = '🔊';
                        musicToggle.classList.remove('muted');
                    }
                }).catch(function() {
                    console.log('✗ Autoplay blocked - showing button');
                    startBtn.innerHTML = '🎵 Continue Music';
                    startBtn.style.display = 'block';
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
                    startMusic();
                } else {
                    bgMusic.pause();
                    sessionStorage.setItem('musicPlaying', 'false');
                    console.log('Music paused');
                    if (musicIcon) {
                        musicIcon.textContent = '🔇';
                        musicToggle.classList.add('muted');
                    }
                }
            });
        }
    }

    console.log('Homepage initialization complete');
});

