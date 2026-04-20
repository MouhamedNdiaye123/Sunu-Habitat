import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { app } from "./firebase-config.js";

// Initialisation du module Authentification
const auth = getAuth(app);

// On sélectionne le formulaire d'inscription
const form = document.querySelector('.connexion form');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Empêche la page de se recharger

    const name = form.querySelector('input[type="text"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const role = document.getElementById('Selection').value;
    const email = form.querySelector('input[type="email"]').value;
    const passwords = form.querySelectorAll('input[type="password"]');
    const password = passwords[0].value;
    const confirmPassword = passwords[1].value;

    if (password !== confirmPassword) {
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Les mots de passe ne correspondent pas !', confirmButtonColor: '#d33' });
        return;
    }
    if (role === "selectionner") {
        Swal.fire({ icon: 'warning', title: 'Attention', text: 'Veuillez sélectionner un rôle (Client ou Propriétaire).', confirmButtonColor: '#f39c12' });
        return;
    }
    if (password.length < 6) {
        Swal.fire({ icon: 'warning', title: 'Attention', text: 'Le mot de passe doit contenir au moins 6 caractères.', confirmButtonColor: '#f39c12' });
        return;
    }

    // Création de l'utilisateur dans Firebase Auth
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // ASTUCE : Comme Google demande une carte bleue pour la Base de Données,
            // nous allons concaténer le nom, le rôle et le numéro dans le 'displayName' !
            // Format : "NomComplet|||Role|||Telephone"
            const specialProfileData = `${name}|||${role}|||${phone}`;

            updateProfile(user, {
                displayName: specialProfileData
            }).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Compte créé !',
                    text: `Félicitations ${name} ! Votre compte a été créé avec succès.`,
                    confirmButtonColor: '#2dc653'
                }).then(() => {
                    window.location.href = "connexion.html";
                });
            }).catch((error) => {
                console.error("Erreur mise à jour profil : ", error);
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                Swal.fire({ icon: 'error', title: 'Erreur', text: 'Cet email possède déjà un compte ! Essayez de vous connecter.', confirmButtonColor: '#d33' });
            } else if (errorCode === 'auth/weak-password') {
                Swal.fire({ icon: 'error', title: 'Erreur', text: 'Le mot de passe est trop faible.', confirmButtonColor: '#d33' });
            } else {
                Swal.fire({ icon: 'error', title: 'Erreur lors de l\'inscription', text: error.message, confirmButtonColor: '#d33' });
            }
        });
});
