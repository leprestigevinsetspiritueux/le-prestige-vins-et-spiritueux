// =====================================
// AMBIANCE MUSICALE
// =====================================

const musique = document.getElementById("musique-ambiance");

const vinyle = document.getElementById("vinyle-musique");

const popup = document.getElementById("popup-musique");

const boutonOui = document.getElementById("activer-musique");

const boutonNon = document.getElementById("refuser-musique");

//=====================================
// MÉMOIRE DE L'AMBIANCE
//=====================================

const derniereVisite = localStorage.getItem("ambiance-date");
const ambianceActive = localStorage.getItem("ambiance-active");

const maintenant = Date.now();

const delai = 12 * 60 * 60 * 1000; // 12 heures

if(derniereVisite && (maintenant - Number(derniereVisite)) < delai){

    if(ambianceActive === "oui"){

        popup.style.display = "none";

        musique.volume = 0;

        musique.play().catch(()=>{});

        vinyle.classList.add("rotation");

        let volume = 0;

        const fondu = setInterval(function(){

            volume += 0.05;

            musique.volume = volume;

            if(volume >= 1){

                musique.volume = 1;

                clearInterval(fondu);

            }

        },200);

    }else{

        popup.style.display = "none";

    }

}
// Activation

boutonOui.addEventListener("click",function(){

popup.style.display="none";

localStorage.setItem("ambiance-active","oui");

localStorage.setItem("ambiance-date",Date.now());

vinyle.style.animationPlayState = "paused";
    musique.volume=0;

    musique.play().catch(()=>{});

    vinyle.style.animationPlayState = "running";

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

localStorage.setItem("ambiance-active","non");

localStorage.setItem("ambiance-date",Date.now());

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

    // =====================================
// PAUSE AUTOMATIQUE SI L'ONGLET EST QUITTÉ
// =====================================

document.addEventListener("visibilitychange", function () {

    if (document.hidden) {

        musique.pause();
        vinyle.style.animationPlayState = "paused";

    } else {

        musique.play().catch(() => {});
        vinyle.style.animationPlayState = "running";

    }

});

    //=====================================
// AMBIANCE SOIRÉE
//=====================================

const heure = new Date().getHours();

if (heure >= 20 || heure < 6) {
    document.body.classList.add("ambiance-soiree");
}

});
