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
// Smooth scrolling for navigation links
var navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');

        // If it's an external page link, don't prevent default
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