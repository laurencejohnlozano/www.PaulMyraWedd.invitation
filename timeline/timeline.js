document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href.startsWith('http') || href.startsWith('#')) return;
            e.preventDefault();
            var bgMusic = document.getElementById('bgMusic');
            if (bgMusic && !bgMusic.paused) {
                localStorage.setItem('musicTime', bgMusic.currentTime);
                localStorage.setItem('musicPlaying', 'true');
            }
            document.body.classList.add('fade-out');
            setTimeout(function () { window.location.href = href; }, 400);
        });
    });
    var bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        var wasPlaying = localStorage.getItem('musicPlaying') === 'true';
        var savedTime = parseFloat(localStorage.getItem('musicTime') || '0');
        if (wasPlaying && savedTime > 0) bgMusic.currentTime = savedTime;
        if (wasPlaying) setTimeout(function() { bgMusic.play(); }, 300);
        setInterval(function() { if (!bgMusic.paused) localStorage.setItem('musicTime', bgMusic.currentTime); }, 1000);
    }
});
    }
});

