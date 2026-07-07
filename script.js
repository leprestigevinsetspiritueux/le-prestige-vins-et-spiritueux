//====================================================
// LE PRESTIGE V3
// Script officiel
//====================================================

"use strict";

//====================================================
// VARIABLES
//====================================================

let panier = JSON.parse(localStorage.getItem("panier")) || [];

const listePanier = document.getElementById("liste-panier");
const totalPanier = document.getElementById("total");
const nombrePanier = document.getElementById("nombre-panier");
const overlayPanier = document.getElementById("overlay-panier");
const panierLateral = document.getElementById("panier-lateral");

//====================================================
// SAUVEGARDE
//====================================================

function sauvegarderPanier(){

    localStorage.setItem(
        "panier",
        JSON.stringify(panier)
    );

}

//====================================================
// OUVRIR PANIER
//====================================================

function ouvrirPanier(){

    const panierLateral = document.getElementById("panier-lateral");
    const overlayPanier = document.getElementById("overlay-panier");

    if(!panierLateral || !overlayPanier){
        console.error("Panier ou overlay introuvable.");
        return;
    }

    panierLateral.classList.add("ouvert");
    overlayPanier.style.display = "block";

}
//====================================================
// FERMER PANIER
//====================================================

function fermerPanier(){

    panierLateral.classList.remove("ouvert");

    overlayPanier.style.display = "none";

}

//====================================================
// AJOUTER UN PRODUIT AU PANIER
//====================================================

function ajouterPanier(nom, prix){

    const produit = panier.find(item => item.nom === nom);

    if(produit){

        produit.quantite++;

    }else{

        panier.push({

            nom: nom,
            prix: prix,
            quantite: 1

        });

    }

    sauvegarderPanier();

    afficherPanier();

    afficherNotification();

}

//====================================================
// AFFICHER LE PANIER
//====================================================

function afficherPanier(){

    listePanier.innerHTML = "";

    let total = 0;

    let nombre = 0;

    if(panier.length === 0){

        listePanier.innerHTML = `
        <div class="ligne-panier panier-vide">
        <div class="infos-panier">
        <strong>Votre panier est vide</strong>
        <span>Ajoutez un produit pour commencer votre commande.</span>
    </div>
</div>
`;
    }

    panier.forEach((produit,index)=>{

        total += produit.prix * produit.quantite;

        nombre += produit.quantite;

        listePanier.innerHTML += `

<div class="ligne-panier">

<div class="infos-panier">

<strong>${produit.nom}</strong>

<br>

${produit.prix.toLocaleString()} FCFA

</div>

<div class="actions-panier">

<button onclick="modifierQuantite(${index},-1)">

−

</button>

<span>

${produit.quantite}

</span>

<button onclick="modifierQuantite(${index},1)">

+

</button>

<button onclick="supprimerProduit(${index})">

🗑️

</button>

</div>

</div>

`;

    });

    totalPanier.textContent = total.toLocaleString();

    nombrePanier.textContent = nombre;

}

//====================================================
// MODIFIER LA QUANTITÉ
//====================================================

function modifierQuantite(index, variation){

    panier[index].quantite += variation;

    if(panier[index].quantite <= 0){

        panier.splice(index,1);

    }

    sauvegarderPanier();

    afficherPanier();

}

//====================================================
// SUPPRIMER UN PRODUIT
//====================================================

function supprimerProduit(index){

    if(confirm("Supprimer ce produit du panier ?")){

        panier.splice(index,1);

        sauvegarderPanier();

        afficherPanier();

    }

}

//====================================================
// VIDER LE PANIER
//====================================================

function viderPanier(){

    if(panier.length===0){

        return;

    }

    if(confirm("Voulez-vous vraiment vider votre panier ?")){

        panier=[];

        sauvegarderPanier();

        afficherPanier();

    }

}

//====================================================
// NOTIFICATION
//====================================================

function afficherNotification(){

    const notification=document.getElementById("notification-panier");

    if(!notification){

        return;

    }

    notification.classList.add("active");

    setTimeout(()=>{

        notification.classList.remove("active");

    },2000);

}

//====================================================
// COMMANDER SUR WHATSAPP
//====================================================

function commanderWhatsApp(){

    if(panier.length===0){

        alert("Votre panier est vide.");

        return;

    }

    let message =
`🛒 Bonjour Le Prestige Vins et Spiritueux,

Je souhaite commander :

`;

    let total = 0;

    panier.forEach((produit)=>{

        const sousTotal =
            produit.prix * produit.quantite;

        total += sousTotal;

        message +=

`🍷 ${produit.nom}

Quantité : ${produit.quantite}

Prix : ${produit.prix.toLocaleString()} FCFA

Sous-total : ${sousTotal.toLocaleString()} FCFA

--------------------------

`;

    });

    message +=

`💰 TOTAL : ${total.toLocaleString()} FCFA

Merci de confirmer ma commande.`;

    window.open(

"https://wa.me/2290197592841?text="

+ encodeURIComponent(message),

"_blank"

    );

}

//====================================================
// RECHERCHE DES PRODUITS
//====================================================

function rechercherProduit(){

    const recherche =
        document.getElementById("recherche")
        .value
        .toLowerCase()
        .trim();

    const cartes =
        document.querySelectorAll("#catalogue .carte");

    const suggestions =
        document.getElementById("suggestions");

    const resultat =
        document.getElementById("nb-resultats");

    suggestions.innerHTML="";

    let compteur=0;

    cartes.forEach(carte=>{

        const titre =
            carte.querySelector("h3")
            .textContent
            .toLowerCase();

        if(recherche===""){

            carte.style.display="";

            return;

        }

        if(titre.includes(recherche)){

            carte.style.display="";

            compteur++;

            const proposition=document.createElement("div");

            proposition.textContent=
                carte.querySelector("h3").textContent;

            proposition.onclick=function(){

                document.getElementById("recherche").value=
                    this.textContent;

                suggestions.innerHTML="";

                rechercherProduit();

                carte.scrollIntoView({

                    behavior:"smooth",

                    block:"center"

                });

            };

            suggestions.appendChild(proposition);

        }

        else{

            carte.style.display="none";

        }

    });

    if(recherche===""){

        resultat.textContent="";

    }

    else{

        resultat.textContent=
        compteur+" produit(s) trouvé(s)";

    }

}

//====================================================
// EFFACER LA RECHERCHE
//====================================================

function viderRecherche(){

    document.getElementById("recherche").value="";

    document.getElementById("suggestions").innerHTML="";

    document.getElementById("nb-resultats").textContent="";

    document
        .querySelectorAll("#catalogue .carte")
        .forEach(carte=>{

            carte.style.display="";

        });

}

//====================================================
// FERMER LES SUGGESTIONS
//====================================================

document.addEventListener("click",function(e){

    if(!e.target.closest(".recherche")){

        document.getElementById("suggestions").innerHTML="";

    }

});

//====================================================
// FILTRER LES CATÉGORIES
//====================================================

function filtrerCategorie(categorie){

    const cartes =
        document.querySelectorAll("#catalogue .carte");

    const recherche =
        document.getElementById("recherche");

    const suggestions =
        document.getElementById("suggestions");

    const resultat =
        document.getElementById("nb-resultats");

    recherche.value = "";

    suggestions.innerHTML = "";

    resultat.textContent = "";

    let compteur = 0;

    cartes.forEach(carte=>{

        if(categorie==="tous"){

            carte.style.display="";

            compteur++;

        }

        else if(carte.classList.contains(categorie)){

            carte.style.display="";

            compteur++;

        }

        else{

            carte.style.display="none";

        }

    });

    if(categorie!=="tous"){

        resultat.textContent =
        compteur + " produit(s) dans cette catégorie";

    }

}

//====================================================
// AFFICHER TOUS LES PRODUITS
//====================================================

function afficherTousProduits(){

    document
    .querySelectorAll("#catalogue .carte")
    .forEach(carte=>{

        carte.style.display="";

    });

    document.getElementById("nb-resultats").textContent="";

}

//====================================================
// RACCOURCI CLAVIER
//====================================================

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        viderRecherche();

        afficherTousProduits();

    }

});

//====================================================
// AVIS WHATSAPP
//====================================================

function envoyerAvisWhatsApp(){

    const nom =
        document.getElementById("nom-client")
        .value
        .trim();

    const commentaire =
        document.getElementById("commentaire-client")
        .value
        .trim();

    if(nom===""){

        alert("Veuillez saisir votre prénom.");

        return;

    }

    if(commentaire===""){

        alert("Veuillez écrire votre avis.");

        return;

    }

    const message =

`Bonjour Le Prestige Vins et Spiritueux,

Je souhaite partager mon avis.

👤 Prénom :
${nom}

💬 Mon avis :

${commentaire}

Merci.`;

    window.open(

        "https://wa.me/2290197592841?text=" +

        encodeURIComponent(message),

        "_blank"

    );

    document.getElementById("nom-client").value="";

    document.getElementById("commentaire-client").value="";

    alert("Merci pour votre avis !");

}

//====================================================
// ENTRÉE = ENVOI
//====================================================

document
.getElementById("commentaire-client")
.addEventListener("keydown",function(e){

    if(e.ctrlKey && e.key==="Enter"){

        envoyerAvisWhatsApp();

    }

});


//====================================================
// RETOUR EN HAUT
//====================================================

function retourHaut(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

window.addEventListener("scroll",function(){

    const bouton =
        document.getElementById("retour-haut");

    if(!bouton){

        return;

    }

    if(window.scrollY>400){

        bouton.style.display="flex";

    }

    else{

        bouton.style.display="none";

    }

});

//====================================================
// FERMER LE PANIER AVEC ÉCHAP
//====================================================

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        fermerPanier();

    }

});

//====================================================
// FERMER EN CLIQUANT SUR L'OVERLAY
//====================================================

const overlay =
document.getElementById("overlay-panier");

if(overlay){

    overlay.addEventListener("click",fermerPanier);

}

//====================================================
// INITIALISATION DU SITE
//====================================================

document.addEventListener("DOMContentLoaded",function(){

    // Restaurer le panier
    afficherPanier();

    // Masquer le bouton Retour en haut
    const boutonRetour =
        document.getElementById("retour-haut");

    if(boutonRetour){

        boutonRetour.style.display="none";

    }

    // Initialiser le compteur de résultats
    const resultat =
        document.getElementById("nb-resultats");

    if(resultat){

        resultat.textContent="";

    }

    // Initialiser les suggestions
    const suggestions =
        document.getElementById("suggestions");

    if(suggestions){

        suggestions.innerHTML="";

    }

});

//====================================================
// MISE À JOUR AUTOMATIQUE DU PANIER
//====================================================

window.addEventListener("storage",function(){

    panier =
        JSON.parse(localStorage.getItem("panier")) || [];

    afficherPanier();

});

//====================================================
// RACCOURCI CLAVIER
//====================================================

document.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        const recherche =
            document.getElementById("recherche");

        if(document.activeElement===recherche){

            rechercherProduit();

        }

    }

});

//====================================================
// PROTECTION CONTRE LES ERREURS
//====================================================

window.onerror=function(message,source,line){

    console.log(

        "Erreur JavaScript :",

        message,

        "Ligne :",

        line

    );

};

function verifierElements(){

    const ids = [

        "panier-lateral",
        "liste-panier",
        "total",
        "nombre-panier",
        "overlay-panier",
        "recherche",
        "suggestions",
        "notification-panier",
        "retour-haut"

    ];

    ids.forEach(id=>{

        if(!document.getElementById(id)){

            console.warn("Élément introuvable :",id);

        }

    });

}

//====================================================
// FERMER LES SUGGESTIONS
//====================================================

document.addEventListener("click",function(e){

    const recherche=document.querySelector(".recherche");

    if(!recherche){

        return;

    }

    if(!recherche.contains(e.target)){

        const suggestions=
        document.getElementById("suggestions");

        if(suggestions){

            suggestions.innerHTML="";

        }

    }

});

//====================================================
// INITIALISATION FINALE
//====================================================

document.addEventListener("DOMContentLoaded",function(){

    verifierElements();

    afficherPanier();

});



