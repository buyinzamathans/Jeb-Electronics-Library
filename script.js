/* ==========================================================================
   JEB ELECTRONICS — SITE-WIDE SCRIPT
   Handles: slide-out menu, currency formatting, and the Quick View popup.
   Shop-page-specific filtering lives inline in shop.html (it needs the
   product list in scope), but the Quick View modal it opens is defined
   here so index.html and product.html can trigger it too.
   ========================================================================== */

// ---- Currency helper (used everywhere a price is shown) ----
function formatUGX(amount) {
    return "Ushs " + Number(amount).toLocaleString('en-US');
}

// Prefer the human-friendly range ("330,000 - 350,000") when present,
// fall back to a formatted single number.
function priceDisplay(item) {
    if (item.priceLabel) return "Ushs " + item.priceLabel;
    return formatUGX(item.price);
}

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SIDE MENU LOGIC
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuToggle && sideMenu && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            sideMenu.classList.add('active');
            menuOverlay.classList.add('active');
        });

        const closeSideMenu = () => {
            sideMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        };

        if (menuClose) menuClose.addEventListener('click', closeSideMenu);
        menuOverlay.addEventListener('click', closeSideMenu);
    }

    // ==========================================
    // 2. QUICK VIEW POPUP
    // Works on any page that has #quickview-overlay in the DOM and
    // has already loaded products.js (for the `products` array).
    // ==========================================
    const qvOverlay = document.getElementById('quickview-overlay');

    if (qvOverlay && typeof products !== 'undefined') {
        const qvImage = document.getElementById('qv-image');
        const qvBadge = document.getElementById('qv-badge');
        const qvTitle = document.getElementById('qv-title');
        const qvPrice = document.getElementById('qv-price');
        const qvDesc = document.getElementById('qv-desc');
        const qvWhatsapp = document.getElementById('qv-whatsapp-btn');
        const qvFullLink = document.getElementById('qv-full-link');
        const qvClose = document.getElementById('qv-close');

        window.openQuickView = function (productId) {
            const item = products.find(p => p.id === productId);
            if (!item) return;

            qvImage.src = item.image;
            qvImage.alt = item.name;
            qvImage.onerror = function () { this.src = 'images/categories/appliance-placeholder.svg'; };
            qvBadge.textContent = item.subcategoryLabel || item.categoryLabel;
            qvTitle.textContent = item.name;
            qvPrice.textContent = priceDisplay(item);
            qvDesc.textContent = item.description || '';
            qvFullLink.href = `product.html?id=${item.id}`;

            const whatsappPhone = "256705402729";
            const orderMessage = encodeURIComponent(
                `Hello Jeb Electronics! I am interested in: ${item.name} (${priceDisplay(item)}). Is it currently in stock?`
            );
            qvWhatsapp.href = `https://wa.me/${whatsappPhone}?text=${orderMessage}`;

            qvOverlay.classList.add('active');
            document.body.classList.add('modal-open');
        };

        function closeQuickView() {
            qvOverlay.classList.remove('active');
            document.body.classList.remove('modal-open');
        }

        if (qvClose) qvClose.addEventListener('click', closeQuickView);
        qvOverlay.addEventListener('click', (e) => {
            if (e.target === qvOverlay) closeQuickView();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeQuickView();
        });
    }

});
