const menu = document.getElementById('menu-burger');
const navigation = document.getElementById('navigation');

// Toggle the burger menu
menu.addEventListener('click', () => {
    menu.classList.toggle('bx-x');
    navigation.classList.toggle('active');
});

// Close navbar when a link is clicked
const navLinks = document.querySelectorAll('#navigation a'); // Sélectionner tous les liens dans la navbar

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('bx-x'); // Revenir à l'état initial du menu burger
        navigation.classList.remove('active'); // Fermer la navbar
    });
});