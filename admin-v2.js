// =========================================
// LE PRESTIGE ADMIN V2
// Partie 1 : Connexion et chargement
// =========================================

// ---------- MOT DE PASSE ----------
const MOT_DE_PASSE = "Prestige@2026";

const saisie = prompt("🔐 Entrez le mot de passe administrateur");

if (saisie !== MOT_DE_PASSE) {
    alert("Mot de passe incorrect.");
    window.location.href = "index.html";
}

// ---------- SUPABASE ----------
const SUPABASE_URL = "https://wkocqfkkoiohopqiohsc.supabase.co";

const SUPABASE_KEY = "sb_publishable_suHZGCWjt5j6oOA22ffUSg_uBYds41v";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ---------- VARIABLES ----------
let produitEnModification = null;

// ---------- AU CHARGEMENT ----------
window.onload = () => {

    chargerProduits();

};

// ---------- CHARGER LES PRODUITS ----------
async function chargerProduits(){

    const { data, error } = await supabaseClient
        .from("produits")
        .select("*")
        .order("id",{ascending:false});

    if(error){

        console.error(error);

        return;

    }

    afficherProduits(data);

}

// ---------- AFFICHAGE ----------
function afficherProduits(liste){

    const tbody = document.getElementById("listeProduits");

    if(!tbody) return;

    tbody.innerHTML="";

    liste.forEach(produit=>{

        tbody.innerHTML += `

<tr>

<td>
<img src="${produit.image}"
width="60">
</td>

<td>${produit.nom}</td>

<td>${produit.categorie}</td>

<td>${produit.stock}</td>

<td>${Number(produit.prix_vente).toLocaleString()} FCFA</td>

<td>

<button
onclick="modifierProduit(${produit.id})">
✏️
</button>

<button
onclick="supprimerProduit(${produit.id})">
🗑️
</button>

</td>

</tr>

`;

    });

}

// =========================================
// PARTIE 2 : AJOUT D'UN PRODUIT
// =========================================

const boutonAjouter = document.getElementById("btnAjouter");

if (boutonAjouter) {
    boutonAjouter.addEventListener("click", ajouterProduit);
}

async function ajouterProduit() {

    try {

        const fichier = document.getElementById("photo").files[0];

        if (!fichier) {
            alert("Veuillez sélectionner une photo.");
            return;
        }

        const nom = document.getElementById("nom").value.trim();
        const categorie = document.getElementById("categorie").value;
        const description = document.getElementById("description").value.trim();

        const prixAchat = Number(document.getElementById("prixAchat").value);
        const prixVente = Number(document.getElementById("prixVente").value);
        const ancienPrix = Number(document.getElementById("ancienPrix").value || 0);
        const stock = Number(document.getElementById("stock").value);
        const badge = document.getElementById("badge").value;

        if (
            nom === "" ||
            description === "" ||
            prixVente <= 0
        ) {
            alert("Veuillez remplir les champs obligatoires.");
            return;
        }

        // Nom unique de l'image

        const extension = fichier.name.split(".").pop();

        const nomImage =
            Date.now() + "-" +
            nom.toLowerCase().replace(/\s+/g, "-") +
            "." + extension;

        // Upload vers Storage

        const { error: erreurUpload } =
            await supabaseClient
            .storage
            .from("produits")
            .upload(nomImage, fichier);

        if (erreurUpload) {

            console.error(erreurUpload);

            alert("Erreur lors de l'envoi de l'image.");

            return;

        }

        // URL publique

        const { data } =
            supabaseClient
            .storage
            .from("produits")
            .getPublicUrl(nomImage);

        const imageURL = data.publicUrl;

        // Enregistrement

        const { error } =
            await supabaseClient
            .from("produits")
            .insert([{

                nom: nom,
                categorie: categorie,
                description: description,
                image: imageURL,

                prix_achat: prixAchat,
                prix_vente: prixVente,
                ancien_prix: ancienPrix,

                stock: stock,
                badge: badge,

                disponible: true

            }]);

        if (error) {

            console.error(error);

            alert("Impossible d'ajouter le produit.");

            return;

        }

        alert("Produit ajouté avec succès !");

        document.querySelector("form")?.reset();

        chargerProduits();

    }

    catch (e) {

        console.error(e);

        alert("Une erreur est survenue.");

    }

}
