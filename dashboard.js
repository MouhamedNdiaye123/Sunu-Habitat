import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);

// Protéger la page
onAuthStateChanged(auth, (user) => {
    if (user) {
        // L'utilisateur est connecté, on décode ses infos cachées
        const profileData = user.displayName ? user.displayName.split("|||") : ["", "client", ""];
        const name = profileData[0];
        const role = profileData[1] || "client";

        // Vérification stricte
        if (role !== "propriete") {
            Swal.fire({
                icon: 'error',
                title: 'Accès Refusé',
                text: 'Cette page est réservée aux propriétaires.',
            }).then(() => {
                window.location.href = "index.html";
            });
        } else {
            // L'utilisateur est bien propriétaire, on charge ses infos
            document.getElementById('user-name').textContent = name || "Propriétaire";
        }
    } else {
        // Personne n'est connecté
        window.location.href = "connexion.html";
    }
});

// Gérer la déconnexion depuis le dashboard
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Déconnecté',
                text: 'À bientôt !',
                confirmButtonColor: '#00bf63'
            }).then(() => {
                window.location.href = "index.html";
            });
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

// -------------------------------------------------------------
// CHARGEMENT DYNAMIQUE DES ANNONCES DANS LE TABLEAU
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById('dashboard-table-body');
    const maisonsBDD = JSON.parse(localStorage.getItem('sunu_maisons') || '[]');

    if (tableBody && maisonsBDD.length > 0) {
        // On insère nos vraies maisons au début du tableau
        maisonsBDD.reverse().forEach(maison => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${maison.image}" alt="House" class="table-img" style="object-fit:cover; height: 45px; width: 60px; border-radius:5px;"></td>
                <td style="font-weight: 500;">${maison.titre}</td>
                <td><i class='bx bx-map' style="color:#777;"></i> ${maison.localisation}</td>
                <td style="color: #00bf63; font-weight: 600;">${maison.prix} CFA</td>
                <td><span class="status active" style="background: rgba(40,167,69,0.1); color:#28a745; padding: 5px 12px; border-radius: 20px; font-size:12px;">En ligne</span></td>
                <td><a href="#" class="action-btn" style="color:#00bf63; font-size:20px;"><i class='bx bx-edit-alt'></i></a></td>
            `;
            tableBody.insertBefore(tr, tableBody.firstChild);
        });
    }
});
