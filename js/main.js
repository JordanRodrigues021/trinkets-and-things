// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const featuredProductsContainer = document.getElementById('featured-products');
const allProductsContainer = document.getElementById('all-products');
const cartCountElements = document.querySelectorAll('.cart-count');

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadProducts();
    
    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            alert(`Thank you for subscribing with ${email}! We'll keep you updated on our latest products.`);
            newsletterForm.reset();
        });
    }
});

// Load Products from Airtable
async function loadProducts() {
    try {
        const response = await fetch('/.netlify/functions/get-products');
        const products = await response.json();
        
        if (featuredProductsContainer) {
            displayFeaturedProducts(products);
        }
        
        if (allProductsContainer) {
            displayAllProducts(products);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display Featured Products
function displayFeaturedProducts(products) {
    featuredProductsContainer.innerHTML = '';
    
    const featuredProducts = products.filter(product => product.Featured);
    
    if (featuredProducts.length === 0) {
        featuredProductsContainer.innerHTML = '<p>No featured products available.</p>';
        return;
    }
    
    featuredProducts.slice(0, 4).forEach(product => {
        const productCard = createProductCard(product);
        featuredProductsContainer.appendChild(productCard);
    });
}

// Display All Products
function displayAllProducts(products) {
    allProductsContainer.innerHTML = '';
    
    if (products.length === 0) {
        allProductsContainer.innerHTML = '<p>No products available.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        allProductsContainer.appendChild(productCard);
    });
}

// Create Product Card HTML
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card fade-in';
    
    const salePrice = product.SalePrice || product.Price;
    const isOnSale = product.SalePrice && product.SalePrice < product.Price;
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${product.Images[0].url}" alt="${product.Name}">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.Name}</h3>
            <div class="product-price">
                <span class="current-price">₹${salePrice.toFixed(2)}</span>
                ${isOnSale ? `<span class="original-price">₹${product.Price.toFixed(2)}</span>` : ''}
            </div>
            ${product.Colors ? `
            <div class="product-colors">
                ${product.Colors.map(color => `<div class="color-option" style="background-color: ${color.toLowerCase()}"></div>`).join('')}
            </div>
            ` : ''}
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // Add event listener to the add to cart button
    productCard.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(product);
    });
    
    return productCard;
}

// Add to Cart Function
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.Name,
            price: product.SalePrice || product.Price,
            image: product.Images[0].url,
            quantity: 1,
            colors: product.Colors || []
        });
    }
    
    updateCart();
    showAddToCartAnimation();
}

// Show Add to Cart Animation
function showAddToCartAnimation() {
    const animation = document.createElement('div');
    animation.className = 'add-to-cart-animation';
    animation.innerHTML = '<i class="fas fa-check"></i> Added to cart!';
    document.body.appendChild(animation);
    
    setTimeout(() => {
        animation.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        animation.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(animation);
        }, 300);
    }, 2000);
}

// Update Cart in LocalStorage and UI
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // If on cart page, update cart items
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

// Update Cart Count in Header
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElements.forEach(el => {
        el.textContent = count;
    });
}

// Add to Cart Animation CSS (dynamically added)
const style = document.createElement('style');
style.textContent = `
.add-to-cart-animation {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--success-color);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    transform: translateY(100px);
    opacity: 0;
    transition: var(--transition);
    z-index: 1000;
    display: flex;
    align-items: center;
}

.add-to-cart-animation.show {
    transform: translateY(0);
    opacity: 1;
}

.add-to-cart-animation i {
    margin-right: 0.5rem;
}
`;
document.head.appendChild(style);