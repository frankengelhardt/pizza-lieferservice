// Der Code wird ausgeführt, wenn der DOM (Document Object Model) vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {
    // Alle Schaltflächen zum Bestellen mit der Klasse .order-button auswählen
    const orderButtons = document.querySelectorAll(".order-button");

    // Elemente für den Warenkorb und den Gesamtpreis im Warenkorb selektieren
    const cartList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartContainer = document.getElementById("cart");
    const orderDetailsContainer = document.getElementById("order-details");

    // Warenkorb aus dem localStorage laden, wenn vorhanden, ansonsten ein leeres Array erstellen
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Funktion, um den Warenkorb anzuzeigen
    function displayCart() {
        // Sicherstellen, dass cartList ein gültiges Element ist
        if (cartList) {
            cartList.innerHTML = ""; // Warenkorb leeren, bevor er neu aufgebaut wird
            let total = 0;

            cart.forEach((item, index) => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `${item.name} - ${item.price.toFixed(2)} €
                                      <button class='remove-item' data-index='${index}'>X</button>`;
                cartList.appendChild(listItem);
                total += item.price;
            });

            if (cartTotal) {
                cartTotal.textContent = total.toFixed(2) + " €";
            }
        } else {
            console.error("Element mit der ID 'cart-items' nicht gefunden.");
        }
    }

    // Funktion, um den Warenkorb im Local Storage zu aktualisieren
    function updateCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }

    // Event-Listener für die Bestellbuttons hinzufügen
    orderButtons.forEach(button => {
        button.addEventListener("click", () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);

            // Artikel zum Warenkorb hinzufügen
            cart.push({ name: name, price: price });
            updateCart();

            // Warenkorb anzeigen
            cartContainer.classList.add("show");
        });
    });

    // Event-Listener für das Entfernen von Artikeln hinzufügen
    if (cartList) {
        cartList.addEventListener("click", function (e) {
            if (e.target && e.target.classList.contains("remove-item")) {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                updateCart();
            }
        });
    }

    // Warenkorb beim Laden der Seite anzeigen
    displayCart();

    // Funktion zum Anzeigen der letzten Bestellung
    function displayLastOrder() {
        const orderData = JSON.parse(localStorage.getItem("orderData"));

        if (orderData) {
            let orderDetailsHTML = `
                <h2>Bestellung von ${orderData.name}</h2>
                <p>Adresse: ${orderData.address}</p>
                <p>Email: ${orderData.email}</p>
                <p>Telefon: ${orderData.phone}</p>
                <h3>Bestellte Artikel:</h3>
                <ul>`;

            if (orderData.order) {
                try {
                    let order = JSON.parse(orderData.order);
                    order.forEach(item => {
                        orderDetailsHTML += `<li>${item.name} - ${item.price} €</li>`;
                    });
                } catch (e) {
                    console.error("Error parsing order data:", e);
                    orderDetailsHTML += `<li>Fehler beim Anzeigen der Bestellung</li>`;
                }
            } else {
                orderDetailsHTML += `<li>Keine Artikel in dieser Bestellung</li>`;
            }

            orderDetailsHTML += `</ul><p>Gesamtpreis: ${orderData.total} €</p>`;
            orderDetailsContainer.innerHTML = orderDetailsHTML;

            localStorage.removeItem("orderData"); // Bestellung nach dem Anzeigen löschen
        } else {
            orderDetailsContainer.innerHTML = "<p>Keine vorherige Bestellung gefunden.</p>";
        }
    }

    // Anzeigen der letzten Bestellung beim Laden der Seite
    if (orderDetailsContainer) {
        displayLastOrder();
    }
});
