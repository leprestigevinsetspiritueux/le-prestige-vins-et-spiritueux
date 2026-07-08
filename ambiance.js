// =====================================
// AMBIANCE MUSICALE
// =====================================

const musique = document.getElementById("musique-ambiance");

const vinyle = document.getElementById("vinyle-musique");

const popup = document.getElementById("popup-musique");

const boutonOui = document.getElementById("activer-musique");

const boutonNon = document.getElementById("refuser-musique");

// Activation
boutonOui.addEventListener("click",function(){

popup.style.display="none";

vinyle.classList.remove("rotation");

    musique.volume=0;

    musique.play().catch(()=>{});

    vinyle.classList.add("rotation");

    let volume=0;

    const fondu=setInterval(function(){

        volume+=0.01;

        musique.volume=volume;

        if(volume>=0.15){

            musique.volume=0.15;

            clearInterval(fondu);

        }

    },120);

});

// Refus
boutonNon.addEventListener("click",function(){

popup.style.display="none";

});

// =====================================
// VINYLE MUSICAL
// =====================================

vinyle.addEventListener("click", function () {

    if (musique.paused) {

        musique.play();

        musique.volume = 0.15;

        vinyle.classList.add("rotation");

    } else {

        musique.pause();

        vinyle.classList.remove("rotation");

    }

});
