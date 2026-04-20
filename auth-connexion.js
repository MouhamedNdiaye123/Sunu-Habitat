import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);
const form = document.querySelector('.connexion form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Décodage de la donnée cachée
            const profileData = user.displayName ? user.displayName.split("|||") : ["", "client", ""];
            const nomFelicitation = profileData[0];
            const role = profileData[1] || "client";
            const phone = profileData[2] || "";
            
            Swal.fire({
                icon: 'success',
                title: 'Connexion réussie',
                text: `Bienvenue de retour ${nomFelicitation} ! Vous êtes connecté en tant que ${role === 'propriete' ? 'Propriétaire' : 'Client'}.`,
                confirmButtonColor: '#2dc653'
            }).then(() => {
                // REDIRECTION INTELLIGENTE SELON LE RÔLE
                if (role === 'propriete') {
                    window.location.href = "dashboard.html";
                } else {
                    window.location.href = "index.html";
                }
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            
            // Gestion des erreurs classiques
            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Email ou mot de passe incorrect !',
                    confirmButtonColor: '#d33'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur de connexion',
                    text: error.message,
                    confirmButtonColor: '#d33'
                });
            }
        });
});
