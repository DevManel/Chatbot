document.addEventListener('DOMContentLoaded', () => {
    let commande = document.getElementById("btn1");
    let question = document.getElementById('question');
    let userAnswer = document.getElementById("useanswer");
    let sendAnswer = document.getElementById("btnsend");
    let answer = document.getElementById("reponse");
    let confirm = document.getElementById("confirm");
    let cancel = document.getElementById("annul");
    let recapitul = document.getElementById("recap");
    let newOrder = document.getElementById("nvlcom");
    let resetButton = document.getElementById("reset");

    let selectedSize = '';
    let selectedToppings = [];
    let stage = 1;
    let orders = []; // Tableau pour stocker toutes les commandes
    let waitingForAnswer = false; // Variable pour savoir si on attend une réponse à la question "Souhaitez-vous passer une nouvelle commande ?"

    // Prix pour chaque taille de pizza et garniture
    const pizzaPrices = {
        petite: 5,
        moyenne: 8,
        grande: 10
    };

    const toppingPrices = {
        fromage: 1.5,
        pepperoni: 2,
        thon: 2.5,
        légumes: 1.2
    };

    // Ajouter un bouton "supprimer" à chaque commande dans le récapitulatif
    function updateRecap() {
        recapitul.innerHTML = '';
        orders.forEach((order, index) => {
            let orderDiv = document.createElement('div');
            orderDiv.innerHTML = `${order} <button class="deleteOrder" data-index="${index}">Supprimer</button>`;
            recapitul.appendChild(orderDiv);
        });

        // Ajouter un événement de suppression pour chaque bouton "Supprimer"
        let deleteButtons = document.querySelectorAll('.deleteOrder');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                let index = event.target.getAttribute('data-index');
                orders.splice(index, 1);  // Supprimer la commande du tableau
                updateRecap();  // Mettre à jour le récapitulatif après suppression
            });
        });
    }

    commande.addEventListener('click', () => {
        question.innerText = "Quelle taille de pizza voulez-vous ? (petite - 5€, moyenne - 8€, grande - 10€)";
        stage = 1;
        answer.innerText = "";
        recapitul.innerText = ''; // Réinitialise le récapitulatif
    });

    sendAnswer.addEventListener('click', () => {
        let userChoice = userAnswer.value.toLowerCase();
        if (stage === 1) {
            // Gestion de la taille de pizza
            if (userChoice === "petite" || userChoice === "moyenne" || userChoice === "grande") {
                selectedSize = userChoice;
                answer.innerText = `Vous avez choisi une pizza ${userChoice} à ${pizzaPrices[selectedSize]}€`;

                question.innerText = "Quels types de garnitures souhaitez-vous ? (fromage - 1.5€, pepperoni - 2€, légumes - 1.2€, thon - 2.5€)";
                stage = 2;
            } else {
                answer.innerText = "Erreur! Choisissez une taille valide (petite - 5€, moyenne - 8€, grande - 10€).";
            }
        } else if (stage === 2) {
            // Gestion des garnitures
            let garnitures = userChoice.split(',').map(item => item.trim());
            let garnitureList = garnitures.filter(item => {
                return ["fromage", "pepperoni", "thon", "légumes"].includes(item);
            });

            selectedToppings = garnitureList;

            if (garnitureList.length > 0) {
                answer.innerText = `Vous avez ajouté : ${garnitureList.join(' et ')} à ${garnitureList.map(garniture => `${toppingPrices[garniture]}€`).join(' et ')}.`;
            } else {
                answer.innerText = "Aucune garniture valide n'a été ajoutée.";
            }
        } else if (stage === 3) {
            // Lorsque l'utilisateur répond à la question sur la nouvelle commande
            let userChoice = userAnswer.value.toLowerCase();
            if (userChoice === 'oui') {
                question.innerText = "Quelle taille de pizza voulez-vous ? (petite - 5€, moyenne - 8€, grande - 10€)";
                stage = 1;
                selectedSize = '';
                selectedToppings = [];
                recapitul.innerText = ''; // Réinitialise le récapitulatif
                answer.innerText = '';
                waitingForAnswer = false; // On n'attend plus la réponse
            } else if (userChoice === 'non') {
                answer.innerText = "Merci pour votre commande !";
                question.innerText = "";
                waitingForAnswer = false; // On n'attend plus la réponse
            } else {
                answer.innerText = "Veuillez répondre par 'oui' ou 'non'.";
            }
        }
    });

    // Calculer le prix total
    function calculatePrice() {
        let totalPrice = pizzaPrices[selectedSize] || 0;
        selectedToppings.forEach(topping => {
            totalPrice += toppingPrices[topping] || 0;
        });
        return totalPrice.toFixed(2); // Retourner un prix avec deux décimales
    }

    // Confirmer la commande
    confirm.addEventListener('click', () => {
        if (selectedSize) {
            let recapMessage = `Vous avez commandé une pizza ${selectedSize}`;
            if (selectedToppings.length > 0) {
                recapMessage += ` avec ${selectedToppings.join(' et ')}.`;
            } else {
                recapMessage += " sans garniture.";
            }

            let totalPrice = calculatePrice(); // Calculer le prix de la commande

            recapMessage += `<br><strong>Prix total : ${totalPrice}€</strong>`;

            // Ajout de la commande à l'historique des commandes
            orders.push(recapMessage);

            updateRecap();  // Mise à jour du récapitulatif
            question.innerText = "Souhaitez-vous passer une nouvelle commande ? (oui / non)";
            stage = 3;
            waitingForAnswer = true; // On attend la réponse à la nouvelle commande
        } else {
            answer.innerText = "Veuillez d'abord choisir la taille de la pizza.";
        }
    });

    // Nouvelle commande
    newOrder.addEventListener('click', () => {
        question.innerText = "Quelle taille de pizza voulez-vous ? (petite - 5€, moyenne - 8€, grande - 10€)";
        stage = 1;
        selectedSize = '';
        selectedToppings = [];
        answer.innerText = "";
        recapitul.innerText = ''; // Réinitialise le récapitulatif
    });

    // Annuler la commande
    cancel.addEventListener('click', () => {
        answer.innerText = "Choix annulé";
        question.innerText = "";
        stage = 1;
        selectedSize = '';
        selectedToppings = [];
        recapitul.innerText = '';
    });

    // Réinitialiser toutes les commandes
    resetButton.addEventListener('click', () => {
        orders = [];
        updateRecap();  // Réinitialiser le récapitulatif
        answer.innerText = "Toutes les commandes ont été réinitialisées.";
    });
});
