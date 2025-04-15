document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const productSelect = document.getElementById('product');
    const quantity = parseInt(document.getElementById('quantity').value);
    const currency = document.getElementById('currency').value;

    const selectedProduct = productSelect.options[productSelect.selectedIndex];
    const pricePerItem = parseFloat(selectedProduct.getAttribute('data-price'));

    if (!name || !email || isNaN(quantity) || quantity < 1) {
        document.getElementById('errorMessage').innerText = "Vyplňte všechna pole správně.";
        return;
    } else {
        document.getElementById('errorMessage').innerText = "";
    }

    const totalWithoutVAT = pricePerItem * quantity;
    const vat = totalWithoutVAT * 0.21;
    const totalWithVAT = totalWithoutVAT + vat;

    document.getElementById('summary').innerText = `Objednávka: ${name} (${email})\nProdukt: ${selectedProduct.value} (Cena: ${pricePerItem} Kč) x ${quantity} kusů`;
    document.getElementById('totalPrice').innerText = `${totalWithVAT.toFixed(2)} Kč`;

    getCurrencyRate(currency, totalWithVAT);
});

function getCurrencyRate(currency, totalWithVAT) {
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/CZK`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let convertedPrice = totalWithVAT;
            if (currency !== 'CZK' && data.rates[currency]) {
                convertedPrice = totalWithVAT * data.rates[currency];
            }
            document.getElementById('convertedPrice').innerText = `${convertedPrice.toFixed(2)} ${currency}`;
        })
        .catch(error => {
            console.error('Chyba při načítání kurzu:', error);
            document.getElementById('convertedPrice').innerText = "Chyba při načítání kurzu.";
        });
}
