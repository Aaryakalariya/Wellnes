// ==================== JQUERY DOCUMENT READY ====================
$(document).ready(function() {

    // ==================== NAVBAR SCROLL EFFECT ====================
    $(window).on('scroll', function() {
        const navbar = $('#mainNavbar');
        if ($(window).scrollTop() > 50) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
    });

    // ==================== MOBILE MENU TOGGLE ====================
    $('#mobileMenuToggle').on('click', function() {
        const mobileMenu = $('#mobileMenu');
        const menuIcon = $('#menuIcon');

        mobileMenu.toggleClass('active');

        // Toggle icon between menu and X
        if (mobileMenu.hasClass('active')) {
            menuIcon.attr('data-lucide', 'x');
        } else {
            menuIcon.attr('data-lucide', 'menu');
        }

        // Reinitialize Lucide icons
        lucide.createIcons();
    });

    // Close mobile menu when clicking overlay
    $('.mobile-menu-overlay').on('click', function() {
        $('#mobileMenu').removeClass('active');
        $('#menuIcon').attr('data-lucide', 'menu');
        lucide.createIcons();
    });

    // Close mobile menu when clicking a link
    $('.mobile-menu-link').on('click', function() {
        $('#mobileMenu').removeClass('active');
        $('#menuIcon').attr('data-lucide', 'menu');
        lucide.createIcons();
    });

    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this).attr('href');

        if (target !== '#' && $(target).length) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: $(target).offset().top - 100
            }, 800, 'swing');
        }
    });

    // ==================== POPULATE PRODUCTS ====================
    const products = [
        {
            id: 1,
            name: 'Vitamin D3',
            price: '$12.99',
            image: 'https://images.unsplash.com/photo-1631980839248-1a84a60c66ac?w=300',
            rating: 4.5,
            reviews: 128
        },
        {
            id: 2,
            name: 'Omega-3 Fish Oil',
            price: '$24.99',
            image: 'https://images.unsplash.com/photo-1631980839248-1a84a60c66ac?w=300',
            rating: 4.8,
            reviews: 256
        },
        {
            id: 3,
            name: 'Multivitamin Complex',
            price: '$18.99',
            image: 'https://images.unsplash.com/photo-1631980839248-1a84a60c66ac?w=300',
            rating: 4.6,
            reviews: 189
        },
        {
            id: 4,
            name: 'Probiotic Blend',
            price: '$29.99',
            image: 'https://images.unsplash.com/photo-1631980839248-1a84a60c66ac?w=300',
            rating: 4.7,
            reviews: 342
        }
    ];

    function renderProducts() {
        const container = $('#productsContainer');
        container.empty();

        products.forEach(function(product) {
            const productCard = `
                <div class="col-sm-6 col-lg-3">
                    <div class="product-card" data-testid="product-card-${product.id}">
                        <div class="product-image-wrapper">
                            <img src="${product.image}" alt="${product.name}" class="product-image" />
                            <button class="product-add-btn">
                                <i data-lucide="shopping-cart"></i>
                            </button>
                        </div>
                        <div class="product-rating">
                            <i data-lucide="star" class="star-icon"></i>
                            <span class="rating-text">${product.rating}</span>
                            <span class="rating-count">(${product.reviews})</span>
                        </div>
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-footer">
                            <span class="product-price">${product.price}</span>
                            <button class="btn-add-product" data-testid="add-to-cart-${product.id}">Add</button>
                        </div>
                    </div>
                </div>
            `;

            container.append(productCard);
        });

        // Reinitialize Lucide icons after adding products
        lucide.createIcons();
    }

    // Render products on page load
    renderProducts();

    // ==================== ADD TO CART FUNCTIONALITY ====================
    $(document).on('click', '.btn-add-product, .product-add-btn', function(e) {
        e.stopPropagation();

        // Get current cart count
        let cartCount = parseInt($('.badge-notification').text()) || 0;
        cartCount++;

        // Update cart badge
        $('.badge-notification').text(cartCount);

        // Visual feedback
        const btn = $(this);
        const originalText = btn.text();

        if (btn.hasClass('btn-add-product')) {
            btn.text('Added!').css('background', 'linear-gradient(to right, #06b6d4, #3b82f6)');
            btn.css('color', 'white');

            setTimeout(function() {
                btn.text(originalText).css('background', '');
                btn.css('color', '');
            }, 1000);
        }
    });

    // ==================== PRODUCT CARD CLICK ====================
    $(document).on('click', '.product-card', function() {
        console.log('Product card clicked:', $(this).find('.product-name').text());
        // You can add product detail modal or navigation here
    });

    // ==================== CATEGORY CARD CLICK ====================
    $('.category-card').on('click', function() {
        const categoryName = $(this).find('.category-title').text();
        console.log('Category clicked:', categoryName);
        // You can add category filtering or navigation here
    });

    // ==================== CHATBOT BUTTON ====================
    $('.chatbot-float').on('click', function() {
        console.log('Chatbot clicked - Opening AI chat...');
        alert('AI Chatbot feature coming soon! 🤖');
        // You can integrate your chatbot functionality here
    });

    // ==================== SEARCH FUNCTIONALITY ====================
    $('.btn-search').on('click', function(e) {
        e.preventDefault();
        const searchQuery = $('.search-input').val();

        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            // Add your search logic here
            alert(`Searching for: ${searchQuery}`);
        }
    });

    // Search on Enter key
    $('.search-input').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            $('.btn-search').click();
        }
    });

    // ==================== CLAIM OFFER BUTTON ====================
    $('.btn-offer').on('click', function() {
        console.log('Claim offer clicked');
        alert('🎉 Your 20% discount code: WELLNESS20');
        // You can show a modal or redirect to signup
    });

    // ==================== SIGN UP BUTTON ====================
    $('.btn-signup').on('click', function() {
        console.log('Sign up clicked');
        alert('Sign up feature coming soon!');
        // You can show signup modal or redirect to signup page
    });

    // ==================== CART BUTTON ====================
    $('[data-testid="cart-button"]').on('click', function() {
        console.log('Cart clicked');
        alert('Shopping cart feature coming soon!');
        // You can show cart modal or redirect to cart page
    });

    // ==================== PROFILE BUTTON ====================
    $('[data-testid="profile-button"]').on('click', function() {
        console.log('Profile clicked');
        alert('Profile feature coming soon!');
        // You can show profile dropdown or redirect to profile page
    });

    // ==================== SCROLL ANIMATIONS ====================
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function handleScrollAnimations() {
        $('.fade-in-up, .fade-in-up-delay-1, .fade-in-up-delay-2, .fade-in-up-delay-3').each(function() {
            if (isElementInViewport(this)) {
                $(this).css('opacity', '1');
            }
        });
    }

    $(window).on('scroll', handleScrollAnimations);
    handleScrollAnimations(); // Initial check

    // ==================== INITIALIZE LUCIDE ICONS ====================
    lucide.createIcons();

    console.log('🏥 Wellness website loaded successfully!');
});


//=========================== CHAT-BOT.HTML =========================//

const chatbotBtn = document.querySelector(".chatbot-float");
const chatbotContainer = document.getElementById("chatbotContainer");
const closeChat = document.getElementById("closeChatbot");
const sendBtn = document.getElementById("sendMessage");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

// Open chatbot
chatbotBtn.addEventListener("click", () => {
    chatbotContainer.style.display = "flex";
});

// Close chatbot
closeChat.addEventListener("click", () => {
    chatbotContainer.style.display = "none";
});

// Send message
sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // User message
    const userMsg = document.createElement("div");
    userMsg.classList.add("message", "user");
    userMsg.innerText = message;
    chatMessages.appendChild(userMsg);

    chatInput.value = "";

    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Demo AI reply
    setTimeout(() => {
        const botMsg = document.createElement("div");
        botMsg.classList.add("message", "bot");
        botMsg.innerText = "This is where your AI response will appear.";
        chatMessages.appendChild(botMsg);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
}



//======================= JS for cart =======================

let cart = [
    { name: "Paracetamol", price: 50, qty: 1 },
    { name: "Vitamin C", price: 120, qty: 1 }
];

function renderCart() {
    let container = document.getElementById("cartItems");
    container.innerHTML = "";

    let total = 0;
    let items = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        items += item.qty;

        container.innerHTML += `
        <div class="cart-card">
            <div class="cart-info">
                <h5>${item.name}</h5>
                <p>₹ ${item.price}</p>
            </div>

            <div class="cart-actions">
                <button class="btn-qty" onclick="changeQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="btn-qty" onclick="changeQty(${index}, 1)">+</button>
                <button class="btn-remove" onclick="removeItem(${index})">X</button>
            </div>
        </div>
        `;
    });

    document.getElementById("totalPrice").innerText = total;
    document.getElementById("totalItems").innerText = items;
}

function changeQty(index, change) {
    cart[index].qty += change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

function placeOrder() {
    let details = document.getElementById("orderDetails");
    details.innerHTML = "";

    cart.forEach(item => {
        details.innerHTML += `<p>${item.name} x ${item.qty}</p>`;
    });

    document.getElementById("orderPopup").style.display = "flex";
}

function closePopup() {
    document.getElementById("orderPopup").style.display = "none";
    cart = [];
    renderCart();
}

renderCart();