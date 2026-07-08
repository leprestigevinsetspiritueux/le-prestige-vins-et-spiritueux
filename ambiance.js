// =====================================
// AMBIANCE MUSICALE
// =====================================

const musique = document.getElementById("musique-ambiance");

const popup = document.getElementById("popup-musique");

const boutonOui = document.getElementById("activer-musique");

const boutonNon = document.getElementById("refuser-musique");

// Activation
boutonOui.addEventListener("click",function(){

    
popup.style.display="none";

    musique.volume=0;

    musique.play().catch(()=>{});

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
