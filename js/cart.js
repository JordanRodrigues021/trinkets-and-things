// DOM Elements
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const proceedCheckoutBtn = document.getElementById('proceed-checkout');

// Load Cart Items
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    
    // Proceed to Checkout Button
    if (proceedCheckoutBtn) {
        proceedCheckoutBtn.addEventListener('click', (e) => {
            if (cart.length === 0) {
                e.preventDefault();
                alert('Your cart is empty. Please add some products before checkout.');
            }
        });
    }
});

// Display Cart Items
function displayCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <p>Your cart is empty</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        cartSubtotal.textContent = '₹0.00';
        cartTotal.textContent = '₹0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                    <span class="remove-item" data-id="${item.id}">Remove</span>
                </div>
            </div>
            <div class="cart-item-total">
                <p>₹${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            updateQuantity(id, -1);
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            updateQuantity(id, 1);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-id');
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity > 0) {
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.quantity = newQuantity;
                    updateCart();
                }
            } else {
                e.target.value = 1;
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            removeFromCart(id);
        });
    });
    
    updateCartTotals();
}

// Update Quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        
        if (item.quantity < 1) {
            item.quantity = 1;
        }
        
        updateCart();
    }
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Update Cart Totals
function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal; // Add shipping, taxes, etc. if needed
    
    cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    cartTotal.textContent = `₹${total.toFixed(2)}`;
}