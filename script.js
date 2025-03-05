let products = [];
let cart = [];

async function fetchProducts() {
    document.getElementById("loader").style.display = "block";
    try {
        const res = await fetch('https://fakestoreapi.com/products');
        products = await res.json();
        loadCategories();
        renderProducts();
    } catch (error) {
        console.error("Ошибка!", error);
    } finally {
        document.getElementById("loader").style.display = "none";
    }
}

function loadCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    const categoryFilter = document.getElementById("categoryFilter");
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function renderProducts() {
    const search = document.getElementById("search").value.toLowerCase();
    const filter = document.getElementById("categoryFilter").value;
    const sort = document.getElementById("priceSort").value;
    
    let filtered = products.filter(p => p.title.toLowerCase().includes(search));
    if (filter) filtered = filtered.filter(p => p.category === filter);
    if (sort === "asc") filtered.sort((a, b) => a.price - b.price);
    if (sort === "desc") filtered.sort((a, b) => b.price - a.price);
    
    document.getElementById("productList").innerHTML = filtered.map(p => 
        `<div class="product-card">
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>Kategoriya: ${p.category}</p>
            <p><strong>$${p.price}</strong></p>
            <button onclick="addToCart('${p.id}')">Add to cart</button>
        </div>`
    ).join("");
}

function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById("cartList");
    cartList.innerHTML = cart.map(item => 
        `<div class="cart-item">
            <p>${item.title} - $${item.price} x ${item.quantity}</p>
            <button onclick="removeFromCart('${item.id}')">Delete</button>
        </div>`
    ).join("");
    
    document.getElementById("totalPrice").textContent = "$" + cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    renderCart();
}

document.getElementById("search").addEventListener("input", renderProducts);
document.getElementById("categoryFilter").addEventListener("change", renderProducts);
document.getElementById("priceSort").addEventListener("change", renderProducts);

fetchProducts();