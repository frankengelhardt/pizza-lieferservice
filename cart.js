document.addEventListener("DOMContentLoaded", () => {
    // Debugging-Nachricht, die anzeigt, dass das Skript geladen wurde
    console.log("✅ cart.js geladen");

    // Warenkorb aus dem localStorage laden, wenn vorhanden, ansonsten ein leeres Array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Container für die Anzeige der Warenkorb-Artikel und des Gesamtpreises
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceContainer = document.getElementById("total-price");

    // Funktion zum Anzeigen des Warenkorbs
    function displayCart() {
        // Wenn die Container-Elemente nicht gefunden wurden, wird eine Fehlermeldung angezeigt
        if (!cartItemsContainer || !totalPriceContainer) {
            console.error("❌ Fehler: 'cart-items' oder 'total-price' nicht gefunden!");
            return;
        }

        // Warenkorb zurücksetzen (leeren), bevor neue Inhalte hinzugefügt werden
        cartItemsContainer.innerHTML = "";

        // Variable für den Gesamtpreis initialisieren
        let totalPrice = 0;

        // Durch den Warenkorb iterieren, um jeden Artikel anzuzeigen
        cart.forEach((item, index) => {
            // Preis zum Gesamtpreis hinzufügen
            totalPrice += item.price;

            // Ein neues Listenelement für den Artikel erstellen
            const li = document.createElement("li");
            li.innerHTML = `${item.name} - ${item.price.toFixed(2)} €
                             <button class="remove-item" data-index="${index}">X</button>`;
            cartItemsContainer.appendChild(li);
        });

        // Debugging-Nachricht, um den Gesamtpreis anzuzeigen
        console.log("📊 Gesamtpreis berechnet:", totalPrice);

        // Gesamtpreis im Container anzeigen
        totalPriceContainer.textContent = totalPrice.toFixed(2);

        // Alle Entfernen-Schaltflächen ("X") im Warenkorb mit Event-Listenern versehen
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                // Artikelindex aus dem Button-Attribut holen
                const index = this.getAttribute("data-index");

                // Artikel aus dem Warenkorb entfernen
                cart.splice(index, 1);

                // Den Warenkorb im localStorage speichern
                localStorage.setItem("cart", JSON.stringify(cart));

                // Warenkorb neu anzeigen
                displayCart();
            });
        });
    }

    // Die Funktion `displayCart()` aufrufen, um den Warenkorb sofort anzuzeigen
    displayCart();

    // 🛒 Wenn das Bestellformular abgeschickt wird, wird dieser Event-Listener ausgeführt
    document.getElementById("order-form").addEventListener("submit", function (event) {
        // Verhindern, dass das Formular standardmäßig abgeschickt wird
        event.preventDefault();

        // Überprüfen, ob der Warenkorb leer ist, und eine Fehlermeldung anzeigen, falls ja
        if (cart.length === 0) {
            alert("❌ Ihr Warenkorb ist leer!");
            return;
        }

        // Eingabefelder für Kundeninformationen auslesen und trimmen (Whitespace entfernen)
        const customerName = document.getElementById("full-name").value.trim();
        const customerAddress = document.getElementById("street").value.trim() + " " +
            document.getElementById("house-number").value.trim();
        const customerPhone = document.getElementById("phone").value.trim();
        const customerEmail = document.getElementById("email").value.trim();
        // Gesamtpreis aus dem Textinhalt des totalPriceContainer holen
        const totalPrice = totalPriceContainer.textContent.replace(" €", "");

        // Überprüfen, ob alle erforderlichen Felder ausgefüllt sind
        if (!customerName || !customerAddress || !customerEmail) {
            alert("❌ Bitte füllen Sie alle Pflichtfelder aus.");
            return;
        }

        // Die Bestellinformationen in einem Objekt speichern
        const orderData = {
            name: customerName,
            address: customerAddress,
            phone: customerPhone,
            email: customerEmail,
            order: JSON.stringify(cart), // Den Warenkorb als JSON speichern
            total: totalPrice
        };

        // Debugging-Nachricht, um die Bestelldaten anzuzeigen
        console.log("📩 Bestellung wird gesendet:", orderData);

        localStorage.setItem("orderData", JSON.stringify(orderData));
        localStorage.removeItem("cart");
        window.location.href = "index.html";
    });
});

// Funktion zum Aktualisieren des Jahres im Footer
function updateFooterYear() {
    const currentYear = new Date().getFullYear();
    document.getElementById("currentYear").textContent = currentYear;
}

function init() {
    // Footer-Jahr aktualisieren
    updateFooterYear();
}

document.addEventListener("DOMContentLoaded", init);