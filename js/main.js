// Main Application Logic & Interactivity
(function () {
  'use strict';

  // Mobile Menu Toggle
  window.toggleMobileMenu = function () {
    const menu = document.getElementById('mobile-menu-drawer');
    const overlay = document.getElementById('mobile-menu-overlay');
    if (menu && overlay) {
      menu.classList.toggle('-translate-x-full');
      overlay.classList.toggle('hidden');
    }
  };

  // Dashboard Sidebar Mobile Toggle
  window.toggleDashboardSidebar = function () {
    const sidebar = document.getElementById('dashboard-sidebar-drawer');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
      sidebar.classList.toggle('-translate-x-full');
      overlay.classList.toggle('hidden');
    }
  };

  // Cart Drawer Toggle
  window.toggleCartDrawer = function () {
    const cart = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (cart && overlay) {
      cart.classList.toggle('translate-x-full');
      overlay.classList.toggle('hidden');
    }
  };

  // Quick View Modal
  window.openQuickView = function (title, price, imageSrc, desc) {
    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;

    document.getElementById('qv-title').textContent = title || 'Product Title';
    document.getElementById('qv-price').textContent = price || '$99.99';
    document.getElementById('qv-desc').textContent = desc || 'Premium quality e-commerce item with 1-year warranty and free shipping.';
    if (imageSrc) {
      document.getElementById('qv-img').src = imageSrc;
    }
    modal.classList.remove('hidden');
  };

  window.closeQuickView = function () {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  };

  // Accordion Toggle for Service & Contact pages
  window.toggleAccordion = function (id) {
    const content = document.getElementById('accordion-content-' + id);
    const icon = document.getElementById('accordion-icon-' + id);
    if (content) {
      if (content.classList.contains('open')) {
        content.classList.remove('open');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        document.querySelectorAll('.accordion-content').forEach(el => el.classList.remove('open'));
        document.querySelectorAll('.accordion-icon').forEach(el => el.style.transform = 'rotate(0deg)');
        content.classList.add('open');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    }
  };

  // Toast Notification - Disabled per user request (no alert or popup messages on any pages)
  window.showToast = function (message) {
    // Silent execution - no alert/toast popup shown on any page
  };

  // Flash Sale Countdown Timer
  function initCountdown() {
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!hoursEl || !minsEl || !secsEl) return;

    let totalSeconds = 14 * 3600 + 45 * 60 + 30; // 14 hours 45 mins

    setInterval(() => {
      if (totalSeconds <= 0) return;
      totalSeconds--;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    }, 1000);
  }

  // Cart Logic
  let cartItems = [];
  window.addToCart = function (title, price, imageSrc) {
    cartItems.push({ title, price, imageSrc, id: Date.now() });
    updateCartUI();
  };

  function updateCartUI() {
    const badge = document.getElementById('cart-count-badge');
    const drawerList = document.getElementById('cart-drawer-list');
    const totalEl = document.getElementById('cart-drawer-total');

    if (badge) badge.textContent = cartItems.length;

    if (drawerList) {
      if (cartItems.length === 0) {
        drawerList.innerHTML = `
          <div class="text-center py-12 text-slate-400">
            <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <p>Your shopping cart is currently empty.</p>
          </div>
        `;
        if (totalEl) totalEl.textContent = '$0.00';
      } else {
        let totalSum = 0;
        drawerList.innerHTML = cartItems.map((item, index) => {
          const numPrice = parseFloat(item.price.replace('$', '')) || 0;
          totalSum += numPrice;
          return `
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div class="flex items-center space-x-3">
                <img src="${item.imageSrc}" alt="${item.title}" class="w-12 h-12 object-cover rounded border bg-white" />
                <div>
                  <h4 class="text-xs font-bold text-slate-800 line-clamp-1">${item.title}</h4>
                  <p class="text-xs font-semibold text-blue-600">${item.price}</p>
                </div>
              </div>
              <button onclick="removeFromCart(${index})" class="text-slate-400 hover:text-red-500 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          `;
        }).join('');
        if (totalEl) totalEl.textContent = '$' + totalSum.toFixed(2);
      }
    }
  }

  window.removeFromCart = function (index) {
    cartItems.splice(index, 1);
    updateCartUI();
  };

  document.addEventListener('DOMContentLoaded', function () {
    initCountdown();
    updateCartUI();
  });
})();
