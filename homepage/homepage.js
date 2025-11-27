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

    // Music Control - Enhanced for mobile
    var musicFrame = document.getElementById('musicFrame');
    var musicToggle = document.getElementById('musicToggle');
    var musicIcon = document.querySelector('.music-icon');

    if (musicFrame) {
        console.log('Music frame found on homepage');

        // Wait for iframe to load
        musicFrame.onload = function () {
            console.log('Music frame loaded on homepage');
            if (musicFrame.contentWindow) {
                // Try to resume music on mobile
                setTimeout(function() {
                    try {
                        musicFrame.contentWindow.postMessage('startMusic', '*');
                        musicFrame.contentWindow.postMessage('getMusicState', '*');
                        console.log('Sent startMusic and getMusicState to iframe');
                    } catch (err) {
                        console.log('Music frame communication error:', err);
                    }
                }, 200);
            }
        };

        // Also try to start music immediately in case iframe is already loaded
        setTimeout(function() {
            if (musicFrame.contentWindow) {
                try {
                    musicFrame.contentWindow.postMessage('startMusic', '*');
                    console.log('Sent immediate startMusic message');
                } catch (err) {
                    console.log('Immediate music start error:', err);
                }
            }
        }, 500);
    }

    // Listen for music state updates
    window.addEventListener('message', function (event) {
        if (event.data.musicPlaying !== undefined && musicIcon && musicToggle) {
            console.log('Music state received:', event.data.musicPlaying);
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

    console.log('Homepage script initialization complete');
});

