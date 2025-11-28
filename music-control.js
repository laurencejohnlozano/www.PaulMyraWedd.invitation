// ═══════════════════════════════════════════════════════════════
// UNIVERSAL MUSIC PLAYER - Add this to ALL pages
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';
    
    // Create audio element (only one instance needed)
    var audio = document.createElement('audio');
    audio.id = 'globalMusic';
    audio.loop = true;
    audio.src = '/www.PaulMyraWedd.invitation/homepage/wedding-music.mp3';
    document.body.appendChild(audio);
    
    // Create music player button
    var playerBtn = document.createElement('div');
    playerBtn.id = 'musicPlayerBtn';
    playerBtn.innerHTML = '▶️';
    playerBtn.style.cssText = 'position:fixed;bottom:110px;right:20px;width:55px;height:55px;background:linear-gradient(135deg,#5C0A0A,#3D0707);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;z-index:999999;box-shadow:0 4px 20px rgba(0,0,0,0.5);border:2px solid rgba(248,244,240,0.3);transition:transform 0.2s;user-select:none;';
    document.body.appendChild(playerBtn);
    
    // Load saved state
    var savedPlaying = localStorage.getItem('weddingMusicPlaying') === 'true';
    var savedTime = parseFloat(localStorage.getItem('weddingMusicTime') || '0');
    
    // Restore position
    if (savedTime > 0) {
        audio.addEventListener('loadedmetadata', function() {
            audio.currentTime = savedTime;
        });
    }
    
    // Update button
    function updateButton() {
        playerBtn.innerHTML = audio.paused ? '▶️' : '⏸️';
    }
    
    // Click handler
    playerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (audio.paused) {
            audio.play().then(function() {
                localStorage.setItem('weddingMusicPlaying', 'true');
                updateButton();
            }).catch(function(err) {
                console.log('Play failed:', err);
            });
        } else {
            audio.pause();
            localStorage.setItem('weddingMusicPlaying', 'false');
            updateButton();
        }
    });
    
    // Hover effect
    playerBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    playerBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Active effect
    playerBtn.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    playerBtn.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    // Auto-resume if was playing
    if (savedPlaying) {
        setTimeout(function() {
            audio.play().then(function() {
                updateButton();
            }).catch(function() {
                updateButton();
            });
        }, 500);
    }
    
    // Save time continuously
    audio.addEventListener('timeupdate', function() {
        localStorage.setItem('weddingMusicTime', audio.currentTime);
    });
    
    // Update button on play/pause
    audio.addEventListener('play', updateButton);
    audio.addEventListener('pause', updateButton);
    
    updateButton();
    
})();
