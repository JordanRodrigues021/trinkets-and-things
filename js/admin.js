// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!localStorage.getItem('adminLoggedIn') && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load dashboard stats
    if (window.location.pathname.includes('index.html')) {
        loadDashboardStats();
    }
    
    // Load orders table
    if (window.location.pathname.includes('orders.html')) {
        loadOrders();
    }
    
    // Load products table
    if (window.location.pathname.includes('products.html')) {
        loadProducts();
        setupProductModal();
    }
    
    // Logout button
    const logoutButtons = document.querySelectorAll('.admin-nav a[href="#"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', logout);
    });
});

// Load Dashboard Stats
async function loadDashboardStats() {
    try {
        const response = await fetch('/.netlify/functions/get-dashboard-stats');
        const stats = await response.json();
        
        document.getElementById('total-orders').textContent = stats.totalOrders;
        document.getElementById('total-revenue').textContent = `₹${stats.totalRevenue.toFixed(2)}`;
        document.getElementById('total-products').textContent = stats.totalProducts;
        document.getElementById('pending-orders').textContent = stats.pendingOrders;
        
        // Load recent orders
        const recentOrdersTable = document.getElementById('recent-orders-table').querySelector('tbody');
        recentOrdersTable.innerHTML = '';
        
        stats.recentOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                <td>₹${order.total.toFixed(2)}</td>
                <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                <td>
                    <button class="action-btn view" data-id="${order.id}">View</button>
                </td>
            `;
            recentOrdersTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load Orders
async function loadOrders() {
    try {
        const response = await fetch('/.netlify/functions/get-orders');
        const orders = await response.json();
        
        const ordersTable = document.getElementById('orders-table').querySelector('tbody');
        ordersTable.innerHTML = '';
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                <td>${order.items.length} items</td>
                <td>₹${order.total.toFixed(2)}</td>
                <td>${order.paymentMethod}</td>
                <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                <td>
                    <button class="action-btn view" data-id="${order.id}">View</button>
                    <button class="action-btn edit" data-id="${order.id}">Edit</button>
                </td>
            `;
            ordersTable.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.action-btn.view').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderId = e.target.getAttribute('data-id');
                viewOrder(orderId);
            });
        });
        
        document.querySelectorAll('.action-btn.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderId = e.target.getAttribute('data-id');
                editOrder(orderId);
            });
        });
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// View Order Details
function viewOrder(orderId) {
    // In a real app, this would fetch order details and show in a modal
    alert(`Viewing order ${orderId}. This would show detailed order information in a modal.`);
}

// Edit Order Status
function editOrder(orderId) {
    // In a real app, this would allow editing order status
    const newStatus = prompt('Enter new status (Unconfirmed/Confirmed/Completed):');
    
    if (newStatus && ['Unconfirmed', 'Confirmed', 'Completed'].includes(newStatus)) {
        updateOrderStatus(orderId, newStatus);
    }
}

// Update Order Status
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch('/.netlify/functions/update-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId,
                status: newStatus
            })
        });
        
        if (response.ok) {
            alert('Order status updated successfully!');
            loadOrders();
            
            // If on dashboard, refresh stats too
            if (window.location.pathname.includes('index.html')) {
                loadDashboardStats();
            }
        } else {
            alert('Error updating order status.');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Error updating order status.');
    }
}

// Load Products
async function loadProducts() {
    try {
        const response = await fetch('/.netlify/functions/get-products');
        const products = await response.json();
        
        const productsTable = document.getElementById('products-table').querySelector('tbody');
        productsTable.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.Images[0].url}" alt="${product.Name}" width="50"></td>
                <td>${product.Name}</td>
                <td>${product.SKU || 'N/A'}</td>
                <td>₹${product.Price.toFixed(2)}</td>
                <td>${product.Stock}</td>
                <td>${product.Stock > 0 ? 'In Stock' : 'Out of Stock'}</td>
                <td>
                    <button class="action-btn edit" data-id="${product.id}">Edit</button>
                    <button class="action-btn delete" data-id="${product.id}">Delete</button>
                </td>
            `;
            productsTable.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.action-btn.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                editProduct(productId);
            });
        });
        
        document.querySelectorAll('.action-btn.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                deleteProduct(productId);
            });
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Setup Product Modal
function setupProductModal() {
    const addProductBtn = document.getElementById('add-product-btn');
    const importProductsBtn = document.getElementById('import-products-btn');
    const exportProductsBtn = document.getElementById('export-products-btn');
    const productModal = document.getElementById('product-modal');
    const importModal = document.getElementById('import-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal, .cancel-btn');
    
    // Add Product Button
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = 'Add New Product';
            document.getElementById('product-form').reset();
            document.getElementById('image-preview').innerHTML = '';
            productModal.classList.add('active');
        });
    }
    
    // Import Products Button
    if (importProductsBtn) {
        importProductsBtn.addEventListener('click', () => {
            importModal.classList.add('active');
        });
    }
    
    // Export Products Button
    if (exportProductsBtn) {
        exportProductsBtn.addEventListener('click', exportProducts);
    }
    
    // Close Modal Buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            productModal.classList.remove('active');
            importModal.classList.remove('active');
        });
    });
    
    // Product Form Submission
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProduct();
        });
    }
    
    // Image Upload Preview
    const imageUpload = document.getElementById('product-images');
    if (imageUpload) {
        imageUpload.addEventListener('change', (e) => {
            const files = e.target.files;
            const preview = document.getElementById('image-preview');
            preview.innerHTML = '';
            
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const previewImage = document.createElement('div');
                    previewImage.className = 'preview-image';
                    previewImage.innerHTML = `
                        <img src="${event.target.result}" alt="Preview">
                        <span class="remove-image">&times;</span>
                    `;
                    preview.appendChild(previewImage);
                    
                    // Add remove image button
                    previewImage.querySelector('.remove-image').addEventListener('click', () => {
                        preview.removeChild(previewImage);
                    });
                };
                reader.readAsDataURL(files[i]);
            }
        });
    }
}

// Save Product
async function saveProduct() {
    // In a real app, this would save the product to the database
    alert('Product saved successfully! (This would actually save to Airtable in a real app)');
    document.getElementById('product-modal').classList.remove('active');
    loadProducts();
}

// Edit Product
function editProduct(productId) {
    // In a real app, this would fetch product details and populate the form
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    
    // Simulate loading product data
    document.getElementById('product-name').value = `Product ${productId}`;
    document.getElementById('product-sku').value = `SKU-${productId}`;
    document.getElementById('product-price').value = '999.00';
    document.getElementById('product-sale-price').value = '899.00';
    document.getElementById('product-stock').value = '10';
    document.getElementById('product-description').value = 'This is a sample product description.';
    
    document.getElementById('product-modal').classList.add('active');
}

// Delete Product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        // In a real app, this would delete the product from the database
        alert(`Product ${productId} deleted successfully! (This would actually delete from Airtable in a real app)`);
        loadProducts();
    }
}

// Export Products
function exportProducts() {
    // In a real app, this would generate and download a CSV file
    alert('Products exported successfully! (This would download a CSV file in a real app)');
}

// Logout
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}
