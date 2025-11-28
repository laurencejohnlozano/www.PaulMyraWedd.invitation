// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Smooth Page Transition
    var links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href.startsWith('http') || href.startsWith('#')) {
                return;
            }
            e.preventDefault();
            
            // Save music state before leaving
            var bgMusic = document.getElementById('bgMusic');
            if (bgMusic && !bgMusic.paused) {
                localStorage.setItem('musicTime', bgMusic.currentTime);
                localStorage.setItem('musicPlaying', 'true');
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

    // Music Control with Continuation
    var bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        var playBtn = document.createElement('div');
        playBtn.innerHTML = '🎵 Play Music';
        playBtn.style.cssText = 'position:fixed;bottom:30px;right:30px;background:linear-gradient(135deg,#5C0A0A,#3D0707);color:#F8F4F0;padding:15px 25px;border-radius:50px;font-family:Playfair Display,serif;font-size:16px;cursor:pointer;z-index:10000;box-shadow:0 4px 15px rgba(0,0,0,0.3)';
        document.body.appendChild(playBtn);

        // Check if music was playing before
        var wasPlaying = localStorage.getItem('musicPlaying') === 'true';
        var savedTime = parseFloat(localStorage.getItem('musicTime') || '0');

        if (wasPlaying && savedTime > 0) {
            bgMusic.currentTime = savedTime;
        }

        playBtn.addEventListener('click', function() {
            if (bgMusic.paused) {
                bgMusic.play();
                playBtn.innerHTML = '⏸️ Pause';
                localStorage.setItem('musicPlaying', 'true');
            } else {
                bgMusic.pause();
                playBtn.innerHTML = '🎵 Play Music';
                localStorage.setItem('musicPlaying', 'false');
            }
        });

        // Auto-continue if was playing
        if (wasPlaying) {
            setTimeout(function() {
                bgMusic.play().then(function() {
                    playBtn.innerHTML = '⏸️ Pause';
                }).catch(function() {
                    playBtn.innerHTML = '🎵 Play Music';
                });
            }, 300);
        }

        // Save time every second
        setInterval(function() {
            if (!bgMusic.paused) {
                localStorage.setItem('musicTime', bgMusic.currentTime);
            }
        }, 1000);
    }
});
