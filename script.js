// ULTRA SIMPLE TEST - Does audio work at all on mobile?
document.addEventListener('DOMContentLoaded', function () {
    var envelope = document.getElementById("envelope");
    var invitation = document.getElementById("invitation");
    var bgMusic = document.getElementById('bgMusic');

    if (envelope) {
        envelope.addEventListener("click", function (e) {
            console.log('Envelope clicked!');
            envelope.classList.add("open");
            
            // Try to play music IMMEDIATELY in click handler
            if (bgMusic) {
                bgMusic.play().then(function() {
                    console.log('SUCCESS: Music is playing!');
                    alert('Music started!'); // Visual confirmation
                }).catch(function(error) {
                    console.log('FAILED:', error);
                    alert('Music blocked: ' + error.message); // See the error
                });
            }
            
            setTimeout(function () {
                invitation.classList.add("show");
            }, 600);
            
            e.stopPropagation();
        });

        invitation.addEventListener("click", function (e) {
            if (invitation.classList.contains("show")) {
                window.location.href = "homepage/homepage.html";
            }
            e.stopPropagation();
        });
    }
});


