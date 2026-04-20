import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);

// On demande à Firebase de "surveiller" si quelqu'un est connecté
onAuthStateChanged(auth, (user) => {
    // 1. On cherche le bouton "Connexion" par son lien (car il n'a pas d'ID)
    const authLink = document.querySelector('a[href="./connexion.html"]') || document.querySelector('a[href="connexion.html"]');

    // 2. Si on a trouvé ce bouton sur la page actuelle (ex: index.html)
    if (authLink) {
        if (user) {
            // Utilisateur CONNECTÉ !
            const profileData = user.displayName ? user.displayName.split("|||") : ["", "client", ""];
            const role = profileData[1] || "client";
            
            // On change le texte du bouton
            authLink.textContent = "Déconnexion";
            
            // On enlève le lien vers connexion.html pour empêcher la navigation
            authLink.href = "#"; 
            
            // Si c'est un propriétaire, on ajoute le bouton Dashboard juste avant
            if (role === 'propriete') {
                const dashboardBtn = document.createElement('a');
                dashboardBtn.href = 'dashboard.html';
                dashboardBtn.className = 'nav-btn dashboard-pro-btn';
                dashboardBtn.textContent = 'Espace Pro';
                dashboardBtn.style.backgroundColor = '#222';
                dashboardBtn.style.color = '#fff';
                dashboardBtn.style.marginRight = '10px';
                
                authLink.parentNode.insertBefore(dashboardBtn, authLink);
                authLink.classList.remove('m-space'); // Nettoyage de marge
            }
            
            // On ajoute l'action de déconnexion quand il clique dessus
            authLink.addEventListener('click', (e) => {
                e.preventDefault(); // On bloque le clic habituel
                
                // Déconnexion Firebase
                signOut(auth).then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Déconnecté',
                        text: 'Vous avez été déconnecté avec succès.',
                        confirmButtonColor: '#2dc653'
                    }).then(() => {
                        window.location.reload(); // On rafraîchit la page pour remettre tout à zéro
                    });
                }).catch((error) => {
                    console.error("Erreur de déconnexion :", error);
                });
            });
        } 
        /* Si l'utilisateur n'est pas connecté, on ne fait rien ! 
           Le code HTML original contenant "Connexion" s'affichera normalement. */
    }
});
