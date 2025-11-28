// Smooth Page Transition
document.addEventListener('DOMContentLoaded', function () {
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
});

// Fade in animation on scroll
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
    galleryItems.forEach(function (item) {
        observer.observe(item);
    });

    // Music Control with Continuation
    var bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        var playBtn = document.createElement('div');
        playBtn.innerHTML = '🎵 Play Music';
        playBtn.style.cssText = 'position:fixed;top:80px;right:20px;background:linear-gradient(135deg,#5C0A0A,#3D0707);color:#F8F4F0;padding:10px 20px;border-radius:50px;font-family:Playfair Display,serif;font-size:14px;cursor:pointer;z-index:10000;box-shadow:0 4px 15px rgba(0,0,0,0.3)';
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
