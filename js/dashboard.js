// Dashboard Management Module (Client & Admin)
(function () {
  'use strict';

  // Sample Product List for Admin Management
  let adminProducts = [
    { id: 'PROD-101', name: 'Wireless Pro Headphones', category: 'Electronics', price: '$199.99', stock: 45, status: 'In Stock' },
    { id: 'PROD-102', name: 'Smart Fitness Watch V2', category: 'Wearables', price: '$149.99', stock: 12, status: 'Low Stock' },
    { id: 'PROD-103', name: 'Ergonomic Executive Chair', category: 'Furniture', price: '$289.99', stock: 80, status: 'In Stock' },
    { id: 'PROD-104', name: '4K Ultra HD Drone Camera', category: 'Gadgets', price: '$499.99', stock: 0, status: 'Out of Stock' },
    { id: 'PROD-105', name: 'Minimalist Leather Backpack', category: 'Fashion', price: '$89.99', stock: 64, status: 'In Stock' }
  ];

  // Render Admin Products Table
  window.renderAdminProducts = function () {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    tbody.innerHTML = adminProducts.map((p, index) => {
      let badgeClass = 'bg-emerald-100 text-emerald-800';
      if (p.status === 'Low Stock') badgeClass = 'bg-amber-100 text-amber-800';
      if (p.status === 'Out of Stock') badgeClass = 'bg-red-100 text-red-800';

      return `
        <tr class="hover:bg-slate-50/80 transition-colors">
          <td class="px-4 py-3 text-xs font-mono text-slate-500">${p.id}</td>
          <td class="px-4 py-3 text-xs font-bold text-slate-800">${p.name}</td>
          <td class="px-4 py-3 text-xs text-slate-600">${p.category}</td>
          <td class="px-4 py-3 text-xs font-semibold text-slate-900">${p.price}</td>
          <td class="px-4 py-3 text-xs text-slate-700">${p.stock} units</td>
          <td class="px-4 py-3 text-xs">
            <span class="inline-block px-2 py-1 text-[11px] font-bold rounded-full ${badgeClass}">${p.status}</span>
          </td>
          <td class="px-4 py-3 text-xs text-right space-x-2">
            <button onclick="editAdminProduct(${index})" class="text-blue-600 hover:text-blue-800 font-semibold">Edit</button>
            <button onclick="deleteAdminProduct(${index})" class="text-red-600 hover:text-red-800 font-semibold">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  };

  // Add Product Modal Toggle
  window.toggleAddProductModal = function () {
    const modal = document.getElementById('add-product-modal');
    if (modal) modal.classList.toggle('hidden');
  };

  window.saveNewAdminProduct = function (event) {
    event.preventDefault();
    const name = document.getElementById('new-prod-name').value;
    const category = document.getElementById('new-prod-cat').value;
    const price = '$' + parseFloat(document.getElementById('new-prod-price').value).toFixed(2);
    const stock = parseInt(document.getElementById('new-prod-stock').value, 10);

    const status = stock > 10 ? 'In Stock' : (stock > 0 ? 'Low Stock' : 'Out of Stock');
    const newId = 'PROD-' + (105 + adminProducts.length);

    adminProducts.unshift({ id: newId, name, category, price, stock, status });
    renderAdminProducts();
    toggleAddProductModal();
    if (window.showToast) window.showToast(`Product "${name}" added successfully!`);
  };

  window.deleteAdminProduct = function (index) {
    if (confirm('Are you sure you want to delete this product?')) {
      const removed = adminProducts.splice(index, 1);
      renderAdminProducts();
      if (window.showToast) window.showToast(`Deleted product "${removed[0].name}"`);
    }
  };

  window.editAdminProduct = function (index) {
    const p = adminProducts[index];
    const newPrice = prompt(`Edit price for ${p.name}:`, p.price.replace('$', ''));
    if (newPrice !== null && !isNaN(parseFloat(newPrice))) {
      p.price = '$' + parseFloat(newPrice).toFixed(2);
      renderAdminProducts();
      if (window.showToast) window.showToast(`Updated price for ${p.name}`);
    }
  };

  // Admin Order Status Update
  window.updateOrderStatus = function (selectEl, orderId) {
    const newStatus = selectEl.value;
    if (window.showToast) window.showToast(`Order ${orderId} status changed to ${newStatus}`);
  };

  document.addEventListener('DOMContentLoaded', function () {
    renderAdminProducts();
  });
})();
