const products = [
    {
        id: 1,
        name: "Tênis de Corrida",
        description: "Confortável, leve e ideal para treinos diários.",
        price: 259.90,
        image: "https://picsum.photos/seed/running/520/360"
    },
    {
        id: 2,
        name: "Fone Bluetooth",
        description: "Som nítido e autonomia para o dia todo.",
        price: 179.90,
        image: "https://picsum.photos/seed/headphones/520/360"
    },
    {
        id: 3,
        name: "Mochila Casual",
        description: "Espaçosa e resistente para o uso diário.",
        price: 129.90,
        image: "https://picsum.photos/seed/backpack/520/360"
    },
    {
        id: 4,
        name: "Relógio Smart",
        description: "Design moderno com monitoramento de atividades.",
        price: 399.90,
        image: "https://picsum.photos/seed/smartwatch/520/360"
    },
    {
        id: 5,
        name: "Camiseta Premium",
        description: "Algodão macio com corte confortável.",
        price: 89.90,
        image: "https://picsum.photos/seed/tshirt/520/360"
    },
    {
        id: 6,
        name: " óculos de Sol",
        description: "Proteção UV com estilo elegante.",
        price: 99.90,
        image: "https://picsum.photos/seed/sunglasses/520/360"
    }
];

const state = {
    cart: []
};

const sections = {
    home: document.getElementById("home"),
    products: document.getElementById("products"),
    cart: document.getElementById("cart"),
    checkout: document.getElementById("checkout")
};

const navButtons = document.querySelectorAll(".navbar button");
const sectionButtons = document.querySelectorAll("[data-section]");
const productGrid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const cartTableBody = document.getElementById("cart-body");
const cartTotal = document.getElementById("cart-total");
const checkoutSummary = document.getElementById("checkout-summary");
const orderMessage = document.getElementById("order-message");
const checkoutForm = document.getElementById("checkout-form");

function formatMoney(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function showSection(sectionId) {
    Object.values(sections).forEach(section => section.classList.remove("active"));
    sections[sectionId].classList.add("active");

    navButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.section === sectionId);
    });
}

function getCartItem(productId) {
    return state.cart.find(item => item.id === productId);
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    const cartItem = getCartItem(productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }

    renderCart();
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    renderCart();
}

function updateQuantity(productId, delta) {
    const cartItem = getCartItem(productId);
    if (!cartItem) return;

    cartItem.quantity += delta;
    if (cartItem.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    renderCart();
}

function getCartTotal() {
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <article class="card">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="card-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="card-footer">
                    <span class="price">${formatMoney(product.price)}</span>
                    <button type="button" onclick="addToCart(${product.id})">Adicionar</button>
                </div>
            </div>
        </article>
    `).join("");
}

function renderCart() {
    cartCount.innerText = state.cart.reduce((count, item) => count + item.quantity, 0);

    if (state.cart.length === 0) {
        cartTableBody.innerHTML = `
            <tr><td colspan="4">
                <div class="empty-state">
                    Seu carrinho está vazio. Adicione produtos na página de produtos.
                </div>
            </td></tr>
        `;
        cartTotal.innerText = formatMoney(0);
        return;
    }

    cartTableBody.innerHTML = state.cart.map(item => `
        <tr>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>
                <strong>${item.name}</strong>
                <div class="text-muted">${formatMoney(item.price)} cada</div>
            </td>
            <td>
                <div class="quantity-selector">
                    <button type="button" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </td>
            <td>
                <div>${formatMoney(item.price * item.quantity)}</div>
                <button type="button" onclick="removeFromCart(${item.id})" class="button--secondary" style="margin-top:8px;">Remover</button>
            </td>
        </tr>
    `).join("");

    cartTotal.innerText = formatMoney(getCartTotal());
}

function renderCheckout() {
    if (state.cart.length === 0) {
        checkoutSummary.innerHTML = `
            <div class="empty-state">
                Seu carrinho está vazio. Vá para produtos e adicione itens antes de finalizar a compra.
            </div>
        `;
        return;
    }

    checkoutSummary.innerHTML = `
        <h3>Resumo do Pedido</h3>
        ${state.cart.map(item => `
            <div class="summary-row">
                <span>${item.quantity}x ${item.name}</span>
                <strong>${formatMoney(item.price * item.quantity)}</strong>
            </div>
        `).join("")}
        <div class="summary-row summary-total">
            <span>Total</span>
            <strong>${formatMoney(getCartTotal())}</strong>
        </div>
    `;
}

function handleCheckout(event) {
    event.preventDefault();

    if (state.cart.length === 0) {
        orderMessage.innerHTML = `<div class="empty-state">Adicione itens ao carrinho antes de finalizar a compra.</div>`;
        return;
    }

    const formData = new FormData(checkoutForm);
    const name = formData.get("name");
    const email = formData.get("email");

    orderMessage.innerHTML = `
        <div class="thank-you">
            <h2>Obrigado pela compra, <strong>${name}</strong>!</h2>
            <p>Enviaremos um e-mail para <strong>${email}</strong> com os detalhes do pedido.</p>
            <p>O pagamento de <strong>${formatMoney(getCartTotal())}</strong> será processado em instantes.</p>
        </div>
    `;

    state.cart = [];
    renderCart();
    renderCheckout();
    checkoutForm.reset();
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

sectionButtons.forEach(button => {
    button.addEventListener("click", () => {
        showSection(button.dataset.section);
        if (button.dataset.section === "checkout") renderCheckout();
    });
});

checkoutForm.addEventListener("submit", handleCheckout);

renderProducts();
renderCart();
showSection("home");
