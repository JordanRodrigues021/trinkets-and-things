// DOM Elements
const checkoutItemsContainer = document.getElementById('checkout-items');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutTotal = document.getElementById('checkout-total');
const orderForm = document.getElementById('order-form');
const upiPaymentSection = document.getElementById('upi-payment-section');
const paymentMethods = document.querySelectorAll('input[name="payment"]');

// Load Checkout Items
document.addEventListener('DOMContentLoaded', () => {
    displayCheckoutItems();
    
    // Payment Method Toggle
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            if (e.target.value === 'UPI') {
                upiPaymentSection.style.display = 'block';
            } else {
                upiPaymentSection.style.display = 'none';
            }
        });
    });
    
    // Form Submission
    if (orderForm) {
        orderForm.addEventListener('submit', processOrder);
    }
    
    // If on confirmation page, display order details
    if (window.location.pathname.includes('order-confirmation.html')) {
        displayOrderConfirmation();
    }
});

// Display Checkout Items
function displayCheckoutItems() {
    checkoutItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        window.location.href = 'products.html';
        return;
    }
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-info">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div>
                    <p class="order-item-name">${item.name}</p>
                    <p>Qty: ${item.quantity}</p>
                </div>
            </div>
            <div class="order-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
        `;
        
        checkoutItemsContainer.appendChild(orderItem);
    });
    
    updateCheckoutTotals();
}

// Update Checkout Totals
function updateCheckoutTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal; // Add shipping, taxes, etc. if needed
    
    checkoutSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    checkoutTotal.textContent = `₹${total.toFixed(2)}`;
}

// Process Order
async function processOrder(e) {
    e.preventDefault();
    
    const formData = new FormData(orderForm);
    const orderData = {
        customerName: formData.get('name'),
        customerEmail: formData.get('email'),
        customerPhone: formData.get('phone'),
        paymentMethod: formData.get('payment'),
        transactionId: formData.get('transaction-id') || null,
        items: cart,
        total: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    };
    
    try {
        const response = await fetch('/.netlify/functions/process-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Redirect to confirmation page with order ID
            window.location.href = `order-confirmation.html?order_id=${result.orderId}`;
        } else {
            alert('There was an error processing your order. Please try again.');
            console.error('Order error:', result.error);
        }
    } catch (error) {
        alert('There was an error processing your order. Please try again.');
        console.error('Order error:', error);
    }
}

// Display Order Confirmation
function displayOrderConfirmation() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    
    if (!orderId) {
        window.location.href = '/';
        return;
    }
    
    // In a real app, we would fetch the order details from the server
    // For now, we'll use the cart data (which should be empty now)
    // and the order ID from the URL
    
    document.getElementById('order-id').textContent = orderId;
    
    // Display payment instructions based on payment method
    const paymentMethod = localStorage.getItem('lastPaymentMethod') || 'UPI';
    const paymentInstructions = document.getElementById('payment-instructions');
    
    if (paymentMethod === 'UPI') {
        paymentInstructions.innerHTML = `
            <h3>Complete Your Payment</h3>
            <p>Please complete your payment via UPI to the following details:</p>
            <p><strong>UPI ID:</strong> jordanrodrigues021@oksbi</p>
            <p>Once payment is complete, your order will be processed.</p>
        `;
    } else {
        paymentInstructions.innerHTML = `
            <h3>Cash on Delivery</h3>
            <p>Please have the exact amount ready when our delivery partner arrives.</p>
            <p><strong>Amount to pay:</strong> ₹${localStorage.getItem('lastOrderTotal') || '0.00'}</p>
        `;
    }
    
    // Clear the temporary storage
    localStorage.removeItem('lastPaymentMethod');
    localStorage.removeItem('lastOrderTotal');
}