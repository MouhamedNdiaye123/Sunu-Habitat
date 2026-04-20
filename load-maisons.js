// load-maisons.js
// Récupère les maisons stockées dans la mémoire locale et les injecte dans la page d'accueil.

document.addEventListener("DOMContentLoaded", () => {
    // 1. Lire la base de données locale (simulée)
    const maisons = JSON.parse(localStorage.getItem('sunu_maisons') || '[]');
    const container = document.querySelector('.maison-container'); // Le VRAI conteneur parent 
    
    // 2. Si on a des maisons et un conteneur valide
    if (container && maisons.length > 0) {
        // Renverser le tableau pour afficher les dernières ajoutées en premier !
        maisons.reverse().forEach(maison => {
            
            // Création automatique de la carte HTML
            const carteHtml = document.createElement('div');
            carteHtml.className = 'maison-box';
            carteHtml.style.animation = "fadeIn 0.5s ease-in-out"; 
            
            // La structure exacte calquée sur index.html
            carteHtml.innerHTML = `
                <img src="${maison.image}" alt="img maison" loading="lazy" style="object-fit:cover; height:200px; width:100%; border-radius:10px 10px 0 0;" />
                <div class="maison-content">
                    <div class="maison-info">
                        <h5 style="text-transform: capitalize;">${maison.titre}</h5>
                        <span>${maison.localisation}</span>
                    </div>
                    <div class="maison-btn">
                        <a href="detail-maison.html" class="btn">En savoir plus</a>
                        <span>${maison.prix} CFA</span>
                    </div>
                </div>
            `;
            
            // 3. Injecter la carte tout au début du conteneur (pour apparaître en Top position)
            container.insertBefore(carteHtml, container.firstChild);
        });
    }
});
