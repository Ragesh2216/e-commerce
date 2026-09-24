// Authentication & User Session Management
(function () {
  'use strict';

  const AUTH_KEY_EMAIL = 'ecom_user_email';
  const AUTH_KEY_ROLE = 'ecom_user_role';

  // Get current logged-in user info
  window.getUserSession = function () {
    return {
      email: localStorage.getItem(AUTH_KEY_EMAIL) || 'guest@example.com',
      role: localStorage.getItem(AUTH_KEY_ROLE) || 'client',
      isLoggedIn: !!localStorage.getItem(AUTH_KEY_EMAIL)
    };
  };

  // Perform Login / Register - After email given move to 404 page
  window.loginUser = function (email, role) {
    if (email) {
      localStorage.setItem(AUTH_KEY_EMAIL, email);
      localStorage.setItem(AUTH_KEY_ROLE, role || 'client');
    }
    window.location.href = '404.html';
    return true;
  };

  // Perform Logout
  window.logoutUser = function () {
    localStorage.removeItem(AUTH_KEY_EMAIL);
    localStorage.removeItem(AUTH_KEY_ROLE);
    window.location.href = 'login.html';
  };

  // Update header UI with user email & dashboard link
  window.updateNavAuthUI = function () {
    const session = window.getUserSession();
    const navAuthContainer = document.getElementById('nav-auth-container');
    const userDisplayEls = document.querySelectorAll('.display-user-email');
    const roleDisplayEls = document.querySelectorAll('.display-user-role');

    // Display user email across dashboard header elements
    userDisplayEls.forEach(el => {
      el.textContent = session.email;
    });

    roleDisplayEls.forEach(el => {
      el.textContent = session.role === 'admin' ? 'Administrator' : 'Client Account';
    });

    if (navAuthContainer) {
      if (session.isLoggedIn) {
        const dashboardUrl = session.role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
        const roleLabel = session.role === 'admin' ? 'Admin Panel' : 'My Account';
        navAuthContainer.innerHTML = `
          <div class="flex items-center space-x-3">
            <a href="${dashboardUrl}" class="flex items-center text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span class="truncate max-w-[110px] sm:max-w-[160px]">${session.email}</span>
            </a>
            <button onclick="logoutUser()" title="Logout" class="text-xs font-semibold text-slate-500 hover:text-red-600 px-2 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition">
              Logout
            </button>
          </div>
        `;
      } else {
        navAuthContainer.innerHTML = `
          <a href="login.html" class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm transition">
            Sign In / Register
          </a>
        `;
      }
    }
  };

  // Protect Dashboards
  window.checkDashboardAccess = function (requiredRole) {
    const session = window.getUserSession();
    if (!session.isLoggedIn) {
      // Set default demo session if none exists
      if (requiredRole === 'admin') {
        localStorage.setItem(AUTH_KEY_EMAIL, 'admin@store.com');
        localStorage.setItem(AUTH_KEY_ROLE, 'admin');
      } else {
        localStorage.setItem(AUTH_KEY_EMAIL, 'client@store.com');
        localStorage.setItem(AUTH_KEY_ROLE, 'client');
      }
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.updateNavAuthUI();
  });
})();
