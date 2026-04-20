import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);

// Protéger la page
onAuthStateChanged(auth, (user) => {
    if (user) {
        const profileData = user.displayName ? user.displayName.split("|||") : ["", "client", ""];
        const name = profileData[0];
        const role = profileData[1] || "client";

        // Vérification stricte
        if (role !== "propriete") {
            window.location.href = "index.html";
        } else {
            // L'utilisateur est bien propriétaire, on charge ses infos
            document.getElementById('user-name').textContent = name || "Propriétaire";
        }
    } else {
        // Personne n'est connecté
        window.location.href = "connexion.html";
    }
});

// Gérer la déconnexion
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
            window.location.href = "index.html";
        });
    });
}

// Gérer le menu burger mobile
const burgerBtn = document.getElementById('dashboard-burger');
const sidebar = document.querySelector('.sidebar');

if (burgerBtn && sidebar) {
    burgerBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Validation et Sauvegarde visuelle d'ajout de maison
const form = document.getElementById('form-ajouter-maison');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btnSubmit = form.querySelector('.btn-submit');
        const originalHtml = btnSubmit.innerHTML;
        btnSubmit.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Publication...";
        btnSubmit.disabled = true;

        // Préparation de la nouvelle maison
        const titre = document.getElementById('titre').value;
        const localisation = document.getElementById('localisation').value;
        const prix = document.getElementById('prix').value;
        const description = document.getElementById('description').value;
        const fileInput = document.getElementById('image');

        // Fonction pour sauvegarder dans le localStorage
        const saveMaison = (imageUrl) => {
            const nvMaison = { titre, localisation, prix, description, image: imageUrl };
            const maisonsBDD = JSON.parse(localStorage.getItem('sunu_maisons') || '[]');
            maisonsBDD.push(nvMaison);
            
            try {
                localStorage.setItem('sunu_maisons', JSON.stringify(maisonsBDD));
            } catch (error) {
                console.error("Erreur de stockage :", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Image trop lourde limitant votre appareil',
                    text: 'L\'image dépasse le quota de la mémoire locale de votre navigateur (5Mo Max). Essayez avec une image plus légère !',
                    confirmButtonColor: '#d33'
                });
                btnSubmit.innerHTML = originalHtml;
                btnSubmit.disabled = false;
                return; // On empêche la suite du code
            }

            setTimeout(() => {
                btnSubmit.innerHTML = originalHtml;
                btnSubmit.disabled = false;

                Swal.fire({
                    icon: 'success',
                    title: 'Excellent !',
                    text: 'Votre maison a été publiée avec succès.',
                    confirmButtonColor: '#00bf63'
                }).then(() => {
                    form.reset();
                    window.location.href = "index.html"; // Redirection de suite sur l'accueil pour voir l'annonce
                });
            }, 800);
        };

        // Encodage Base64 de l'image (pour pouvoir la stocker localement sans Firebase Storage)
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                saveMaison(event.target.result);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            // Option de secours (bien que required soit présent)
            saveMaison("./Images/img-1.jpg");
        }
    });
}
