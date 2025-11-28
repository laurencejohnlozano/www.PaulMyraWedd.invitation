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
});
document.addEventListener('DOMContentLoaded', function () {
    var galleryItems = document.querySelectorAll('.gallery-item');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                setTimeout(function () {
                    entry.target.style.transition = 'all 0.8s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    galleryItems.forEach(function (item) { observer.observe(item); });
    
    var bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        var musicIcon = document.createElement('div');
        musicIcon.innerHTML = '🔊';
        musicIcon.style.cssText = 'position:fixed;bottom:150px;right:20px;width:50px;height:50px;background:linear-gradient(135deg,#5C0A0A,#3D0707);color:#F8F4F0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;z-index:9999;box-shadow:0 4px 15px rgba(0,0,0,0.3);border:2px solid rgba(248,244,240,0.3);transition:transform 0.2s';
        document.body.appendChild(musicIcon);
        
        var wasPlaying = localStorage.getItem('musicPlaying') === 'true';
        var savedTime = parseFloat(localStorage.getItem('musicTime') || '0');
        if (wasPlaying && savedTime > 0) bgMusic.currentTime = savedTime;
        
        function updateIcon() {
            musicIcon.innerHTML = bgMusic.paused ? '🔇' : '🔊';
        }
        
        musicIcon.addEventListener('click', function() {
            if (bgMusic.paused) {
                bgMusic.play();
                localStorage.setItem('musicPlaying', 'true');
            } else {
                bgMusic.pause();
                localStorage.setItem('musicPlaying', 'false');
            }
            updateIcon();
        });
        
        if (wasPlaying) {
            setTimeout(function() { 
                bgMusic.play().then(updateIcon).catch(updateIcon);
            }, 300);
        }
        updateIcon();
        setInterval(function() { if (!bgMusic.paused) localStorage.setItem('musicTime', bgMusic.currentTime); }, 1000);
    }
});

