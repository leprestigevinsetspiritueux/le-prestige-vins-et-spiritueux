// =====================================
// AMBIANCE MUSICALE
// =====================================

const musique = document.getElementById("musique-ambiance");
const vinyle = document.getElementById("vinyle-musique");

const popup = document.getElementById("popup-musique");

const boutonOui = document.getElementById("activer-musique");
const boutonNon = document.getElementById("refuser-musique");

const titrePopup = document.getElementById("titre-popup-musique");
const textePopup = document.getElementById("texte-popup-musique");

//=====================================
// MÉMOIRE DE L'AMBIANCE
//=====================================

const aujourdHui = new Date().toDateString();

const dernierJour = localStorage.getItem("ambiance-jour");
const ambianceActive = localStorage.getItem("ambiance-active");

//=====================================
// PERSONNALISATION DU MESSAGE
//=====================================

if (dernierJour) {

    titrePopup.innerHTML = "Heureux de vous retrouver";

    textePopup.innerHTML =
        "Souhaitez-vous profiter à nouveau de l'ambiance de la Maison ?";

} else {

    titrePopup.innerHTML = "Bienvenue dans notre Maison";

    textePopup.innerHTML =
        "La Maison vous propose de découvrir son ambiance musicale.";

}

//=====================================
// AFFICHAGE DE LA POPUP
//=====================================

if (dernierJour === aujourdHui) {

    if (ambianceActive === "oui") {

        popup.style.display = "none";

        musique.volume = 0;

        musique.play().catch(() => {});

        vinyle.classList.add("rotation");

        let volume = 0;

        const fondu = setInterval(function () {

            volume += 0.01;

            if(volume >= 0.25){

    musique.volume = 0.25;

    clearInterval(fondu);

}

    musique.volume = volume;

        }, 120);

    } else {

        popup.style.display = "none";

    }

} else {

    popup.style.display = "flex";

    localStorage.removeItem("ambiance-active");

}

//=====================================
// ACTIVATION
//=====================================

boutonOui.addEventListener("click", function () {

    popup.style.display = "none";

    localStorage.setItem("ambiance-active", "oui");
    localStorage.setItem("ambiance-jour", aujourdHui);

    musique.volume = 0;

    musique.play().catch(() => {});

    vinyle.classList.add("rotation");

    let volume = 0;

    const fondu = setInterval(function () {

        volume += 0.01;

        if (volume >= 0.15) {

            volume = 0.15;

            clearInterval(fondu);

        }

        musique.volume = volume;

    }, 120);

});

//=====================================
// REFUS
//=====================================

boutonNon.addEventListener("click", function () {

    popup.style.display = "none";

    localStorage.setItem("ambiance-active", "non");
    localStorage.setItem("ambiance-jour", aujourdHui);

});

//=====================================
// VINYLE MUSICAL
//=====================================

vinyle.addEventListener("click", function () {

    if (musique.paused) {

        musique.play();

       musique.volume = 0.25;

        vinyle.classList.add("rotation");

    } else {

        musique.pause();

        vinyle.classList.remove("rotation");

    }

});

//=====================================
// PAUSE SI L'ONGLET EST QUITTÉ
//=====================================

document.addEventListener("visibilitychange", function () {

    if (document.hidden) {

        musique.pause();

        vinyle.style.animationPlayState = "paused";

    } else {

        if (localStorage.getItem("ambiance-active") === "oui") {

            musique.play().catch(() => {});

            vinyle.style.animationPlayState = "running";

        }

    }

});

//=====================================
// AMBIANCE SOIRÉE
//=====================================

const heure = new Date().getHours();

if (heure >= 20 || heure < 6) {

    document.body.classList.add("ambiance-soiree");

}
