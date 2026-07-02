// =====================================================
// LE PRESTIGE V2
// PANIER
// =====================================================

let panier = JSON.parse(localStorage.getItem("panier")) || [];
let total = 0;

// =====================================================
// Ajouter un produit
// =====================================================

function ajouterPanier(nom, prix, image){

    const existe = panier.find(produit => produit.nom === nom);

    if(existe){

        existe.quantite++;

    }else{

 panier.push({
    nom,
    prix,
    image,
    quantite: 1
 });

    }

    afficherPanier();

    ouvrirPanier();

    afficherNotification(nom + " ajouté au panier");

}
// =====================================================
// Afficher le panier
// =====================================================

function afficherPanier(){

    const liste = document.getElementById("liste-panier");
    const totalElement = document.getElementById("total");
    const compteur = document.getElementById("nombre-panier");

    if(!liste || !totalElement) return;

    liste.innerHTML = "";
    total = 0;

    panier.forEach((produit,index)=>{

        total += produit.prix * produit.quantite;

        liste.innerHTML += `
        <div class="ligne-panier">

            <div class="infos-panier">
                <strong>${produit.nom}</strong><br>
                ${produit.prix.toLocaleString()} FCFA
            </div>

            <div class="quantite-zone">

                <button class="quantite-btn"
                    onclick="diminuerQuantite(${index})">
                    −
                </button>

                <span class="quantite">
                    ${produit.quantite}
                </span>

                <button class="quantite-btn"
                    onclick="augmenterQuantite(${index})">
                    +
                </button>

            </div>

            <button class="btn-supprimer"
                onclick="supprimerProduit(${index})">
                ❌
            </button>

        </div>
        `;
    });

    if(panier.length===0){
        liste.innerHTML = "<p>Votre panier est vide.</p>";
    }

    totalElement.textContent = total.toLocaleString();

    if(compteur){

        let nbArticles = 0;

        panier.forEach(produit=>{
            nbArticles += produit.quantite;
        });

        compteur.textContent = nbArticles;
    }

    localStorage.setItem("panier", JSON.stringify(panier));
}
// =====================================================
// Supprimer un produit
// =====================================================

function supprimerProduit(index){

    panier.splice(index,1);

    afficherPanier();

}

// =====================================================
// Augmenter la quantité
// =====================================================

function augmenterQuantite(index){

    panier[index].quantite++;

    afficherPanier();

}

// =====================================================
// Diminuer la quantité
// =====================================================

function diminuerQuantite(index){

    if(panier[index].quantite > 1){

        panier[index].quantite--;

    }else{

        supprimerProduit(index);

        return;

    }

    afficherPanier();

}

// =====================================================
// Vider le panier
// =====================================================

function viderPanier(){

    panier = [];

    localStorage.removeItem("panier");

    afficherPanier();

}

// =====================================================
// Commander via WhatsApp
// =====================================================

function commanderWhatsApp(){

    if(panier.length===0){

        alert("Votre panier est vide.");

        return;

    }

    let message =
`Bonjour Le Prestige Vins & Spiritueux,

Je souhaite commander :

`;

    panier.forEach(produit=>{

        message +=
`• ${produit.nom}
${produit.prix.toLocaleString()} FCFA

`;

    });

    message +=
`Total : ${total.toLocaleString()} FCFA

Nom :
Téléphone :
Adresse :

Merci.`;

const url =
"https://wa.me/2290197592841?text=" + encodeURIComponent(message);

window.open(url, "_blank", "noopener,noreferrer");
}

// =====================================================
// RECHERCHE + SUGGESTIONS
// =====================================================

function rechercherProduit(){

    const recherche = document.getElementById("recherche");
    const suggestions = document.getElementById("suggestions");
    const nbResultats = document.getElementById("nb-resultats");

    if(!recherche) return;

    const filtre = recherche.value.toLowerCase().trim();

    const cartes = document.querySelectorAll(".produits .carte");

    let compteur = 0;
    let dejaAjoutes = [];

    indexSuggestion = -1;

    if(suggestions){

        suggestions.innerHTML = "";

    }

    cartes.forEach(carte=>{

        const texte = carte.innerText.toLowerCase();

        const titre = carte.querySelector("h3");

        if(!titre) return;

        const nom = titre.innerText;

        if(texte.includes(filtre)){

            carte.style.display = "flex";

            compteur++;

            if(
                suggestions &&
                filtre.length > 0 &&
                nom.toLowerCase().includes(filtre) &&
                !dejaAjoutes.includes(nom) &&
                dejaAjoutes.length < 5
            ){

                dejaAjoutes.push(nom);

                suggestions.innerHTML +=
                `<div onclick="choisirProduit('${nom.replace(/'/g,"\\'")}')">
                    🔍 ${nom}
                </div>`;

            }

        }else{

            carte.style.display = "none";

        }

    });

    if(nbResultats){

        nbResultats.textContent =
        compteur + " produit(s) trouvé(s)";

    }

    if(suggestions){

        suggestions.style.display =
        suggestions.innerHTML ? "block" : "none";

    }

}


// =====================================================
// VIDER LA RECHERCHE
// =====================================================

function viderRecherche(){

    const recherche = document.getElementById("recherche");
    const suggestions = document.getElementById("suggestions");
    const resultat = document.getElementById("nb-resultats");

    if(recherche){

        recherche.value = "";

        recherche.focus();

    }

    if(suggestions){

        suggestions.innerHTML = "";

        suggestions.style.display = "none";

    }

    if(resultat){

        resultat.textContent = "";

    }

    document.querySelectorAll(".produits .carte").forEach(carte=>{

        carte.style.display = "flex";

    });

    indexSuggestion = -1;

}

// =====================================================
// CHOISIR UNE SUGGESTION
// =====================================================
function choisirProduit(nom){

    const recherche = document.getElementById("recherche");
    const suggestions = document.getElementById("suggestions");
    const cartes = document.querySelectorAll(".produits .carte");

    recherche.value = nom;

    suggestions.innerHTML = "";
    suggestions.style.display = "none";

    cartes.forEach(carte=>{

        const titre = carte.querySelector("h3");

        if(titre && titre.innerText === nom){

            carte.style.display = "flex";

            carte.scrollIntoView({
                behavior:"smooth",
                block:"center"
            });

        }else{

            carte.style.display = "none";

        }

    });

    document.getElementById("nb-resultats").textContent = "1 produit trouvé";

}

// =====================================================
// FILTRER PAR CATÉGORIE
// =====================================================

function filtrerCategorie(categorie){

    const cartes = document.querySelectorAll(".produits .carte");

    cartes.forEach(carte=>{

        if(categorie==="tous"){

            carte.style.display="flex";

        }

        else if(carte.classList.contains(categorie)){

            carte.style.display="flex";

        }

        else{

            carte.style.display="none";

        }

    });

}
// =====================================================
// COMPTE À REBOURS
// =====================================================

const dateFin = new Date(2026, 11, 31, 23, 59, 59).getTime();

function mettreAJourCompteRebours(){

    const timer = document.getElementById("timer");

    if(!timer) return;

    const maintenant = new Date().getTime();

    const difference = dateFin - maintenant;

    if(difference <= 0){

        timer.textContent = "Promotion terminée";

        return;

    }

    const jours = Math.floor(difference / (1000*60*60*24));

    const heures = Math.floor((difference % (1000*60*60*24)) / (1000*60*60));

    const minutes = Math.floor((difference % (1000*60*60)) / (1000*60));

    const secondes = Math.floor((difference % (1000*60)) / 1000);

    timer.textContent =
        `${jours} j ${heures} h ${minutes} min ${secondes} s`;

}

setInterval(mettreAJourCompteRebours,1000);



// =====================================================
// NAVIGATION CLAVIER
// =====================================================

let indexSuggestion = -1;

const champRecherche = document.getElementById("recherche");

if(champRecherche){

    champRecherche.addEventListener("keydown",function(e){

        const items = document.querySelectorAll("#suggestions div");

        if(items.length===0) return;

        if(e.key==="ArrowDown"){

            e.preventDefault();

            indexSuggestion++;

            if(indexSuggestion>=items.length){

                indexSuggestion=0;

            }

            majSuggestion(items);

        }

        else if(e.key==="ArrowUp"){

            e.preventDefault();

            indexSuggestion--;

            if(indexSuggestion<0){

                indexSuggestion=items.length-1;

            }

            majSuggestion(items);

        }

        else if(e.key==="Enter"){

            if(indexSuggestion>=0){

                e.preventDefault();

                items[indexSuggestion].click();

            }

        }

        else if(e.key==="Escape"){

            document.getElementById("suggestions").style.display="none";

            indexSuggestion=-1;

        }

    });

}

function majSuggestion(items){

    items.forEach(item=>item.classList.remove("active"));

    if(indexSuggestion>=0){

        items[indexSuggestion].classList.add("active");

    }

}  

// =====================================================
// NOTIFICATION PANIER
// =====================================================

function afficherNotification(message){

    const notification = document.getElementById("notification-panier");

    if(!notification) return;

    notification.textContent = "✅ " + message;

    notification.classList.add("active");

    setTimeout(function(){

        notification.classList.remove("active");

    }, 2000);

}

// =====================================================
// INITIALISATION
// =====================================================

document.addEventListener("DOMContentLoaded",function(){

    afficherPanier();

    mettreAJourCompteRebours();

});

// =====================================
// MENU HAMBURGER
// =====================================

document.querySelectorAll("#menu a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("menu").classList.remove("active");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("menu").classList.remove("active");
});

function retourHaut(){
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

window.addEventListener("scroll",function(){

    const bouton=document.getElementById("retour-haut");

    if(window.scrollY>500){
        bouton.style.display="flex";
    }else{
        bouton.style.display="none";
    }

});

function ouvrirPanier(){

    document.getElementById("panier-lateral").classList.add("ouvert");

    document.getElementById("overlay-panier").style.display="block";

}

function fermerPanier(){

    document.getElementById("panier-lateral").classList.remove("ouvert");

    document.getElementById("overlay-panier").style.display="none";

}

    const etoiles = "⭐".repeat(noteSelectionnee);

    const message =
`Bonjour Le Prestige Vins et Spiritueux,

Je souhaite laisser un avis.

👤 Nom : ${nom}

⭐ Note : ${etoiles}

💬 Avis :
${commentaire}

Merci.`;

    window.open(
        "https://wa.me/2290197592841?text=" + encodeURIComponent(message),
        "_blank"
    );

    document.getElementById("nom-client").value = "";
    document.getElementById("commentaire-client").value = "";

}


