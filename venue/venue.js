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
    var galleryItems = document.querySelectorAll('.gallery-item'); var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.style.opacity = '0'; entry.target.style.transform = 'translateY(30px)'; setTimeout(function () { entry.target.style.transition = 'all 0.8s ease'; entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }, 100); observer.unobserve(entry.target); } }); }, { threshold: 0.1 }); galleryItems.forEach(function (item) { observer.observe(item); });
    
    var bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        var musicIcon = document.createElement('div');
        musicIcon.innerHTML = '🔊';
        musicIcon.style.cssText = 'position:fixed;bottom:80px;right:20px;width:50px;height:50px;background:linear-gradient(135deg,#5C0A0A,#3D0707);color:#F8F4F0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;z-index:9999;box-shadow:0 4px 15px rgba(0,0,0,0.3);border:2px solid rgba(248,244,240,0.3)';
        document.body.appendChild(musicIcon);
        
        var wasPlaying = localStorage.getItem('musicPlaying') === 'true';
        var savedTime = parseFloat(localStorage.getItem('musicTime') || '0');
        var timeRestored = false;
        
        bgMusic.addEventListener('loadedmetadata', function() {
            if (savedTime > 0 && !timeRestored) {
                bgMusic.currentTime = savedTime;
                timeRestored = true;
            }
        });
        
        function updateIcon() {
            musicIcon.innerHTML = bgMusic.paused ? '🔇' : '🔊';
        }
        
        musicIcon.addEventListener('click', function() {
            if (!timeRestored && savedTime > 0) {
                bgMusic.currentTime = savedTime;
                timeRestored = true;
            }
            if (bgMusic.paused) {
                bgMusic.play();
                localStorage.setItem('musicPlaying', 'true');
            } else {
                bgMusic.pause();
                localStorage.setItem('musicPlaying', 'false');
            }
            updateIcon();
        });
        
        // TRICK: Try muted autoplay first, then unmute
        if (wasPlaying) {
            bgMusic.muted = true;
            setTimeout(function() { 
                bgMusic.play().then(function() {
                    // Successfully playing muted, now unmute
                    setTimeout(function() {
                        bgMusic.muted = false;
                        updateIcon();
                        console.log('venue: Muted autoplay trick worked!');
                    }, 100);
                }).catch(function() {
                    // Even muted autoplay blocked, need user click
                    bgMusic.muted = false;
                    updateIcon();
                    console.log('venue: Autoplay blocked - click icon');
                });
            }, 300);
        }
        
        updateIcon();
        setInterval(function() { 
            if (!bgMusic.paused) {
                localStorage.setItem('musicTime', bgMusic.currentTime);
            }
        }, 1000);
    }
});
