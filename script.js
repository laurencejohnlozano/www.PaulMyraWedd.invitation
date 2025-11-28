// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Envelope page loaded');

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

    // Envelope interaction
    var envelope = document.getElementById("envelope");
    var invitation = document.getElementById("invitation");
    var isAnimating = false;
    var hasOpened = false;

    if (envelope && invitation) {
        function openEnvelope(e) {
            if (!hasOpened && !isAnimating) {
                hasOpened = true;
                isAnimating = true;
                envelope.classList.add("open");
                
                setTimeout(function () {
                    invitation.classList.add("show");
                    isAnimating = false;
                }, 600);
            }
            e.preventDefault();
            e.stopPropagation();
        }

        envelope.addEventListener("click", openEnvelope);
        envelope.addEventListener("touchend", openEnvelope, { passive: false });

        function goToHomepage(e) {
            if (invitation.classList.contains("show") && !isAnimating) {
                window.location.href = "homepage/homepage.html";
            }
            e.preventDefault();
            e.stopPropagation();
        }

        invitation.addEventListener("click", goToHomepage);
        invitation.addEventListener("touchend", goToHomepage, { passive: false });
    }

    console.log('Envelope initialization complete');
});




