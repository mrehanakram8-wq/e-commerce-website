document.addEventListener("DOMContentLoaded", () => {

    // --- 1. LOCALSTORAGE INITIALIZATION ---
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Sync wishlist heart icon states on page load
    function syncWishlistIcons() {
        const wishlistIcons = document.querySelectorAll(".wishlist-icon");
        wishlistIcons.forEach(icon => {
            const card = icon.closest(".product-card");
            if (!card) return;
            const name = card.querySelector("h3").textContent;
            const exists = wishlist.some(item => item.name === name);

            if (exists) {
                icon.classList.add("wishlist-active", "fa-solid");
                icon.classList.remove("fa-regular");
            } else {
                icon.classList.remove("wishlist-active", "fa-solid");
                icon.classList.add("fa-regular");
            }
        });
    }

    // --- 2. ADD TO CART SYSTEM ---
    const cartButtons = document.querySelectorAll(".add-cart");
    cartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".product-card");
            const name = card.querySelector("h3").textContent;
            const price = card.querySelector("p").textContent;
            const image = card.querySelector("img").getAttribute("src");

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                alert("This item is already in your cart!");
            } else {
                cart.push({ name, price, image });
                localStorage.setItem("cart", JSON.stringify(cart));
                alert(`${name} added to cart!`);
            }
        });
    });

    // --- 3. WISHLIST TOGGLE SYSTEM ---
    const wishlistIcons = document.querySelectorAll(".wishlist-icon");
    wishlistIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const card = icon.closest(".product-card");
            const name = card.querySelector("h3").textContent;
            const price = card.querySelector("p").textContent;
            const image = card.querySelector("img").getAttribute("src");

            const index = wishlist.findIndex(item => item.name === name);

            if (index === -1) {
                wishlist.push({ name, price, image });
                icon.classList.add("wishlist-active", "fa-solid");
                icon.classList.remove("fa-regular");
                alert("Added To Wishlist!");
            } else {
                wishlist.splice(index, 1);
                icon.classList.remove("wishlist-active", "fa-solid");
                icon.classList.add("fa-regular");
                alert("Removed From Wishlist!");
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlist));
        });
    });

    // --- 4. CART PAGE FUNCTIONALITY ---
    const cartContainer = document.querySelector(".cart-container");
    const totalPriceEl = document.getElementById("totalPrice");

    if (cartContainer && totalPriceEl) {
        function loadCart() {
            cartContainer.innerHTML = "";
            let total = 0;

            if (cart.length === 0) {
                cartContainer.innerHTML = "<p style='text-align:center;'>Your cart is currently empty.</p>";
                totalPriceEl.innerText = "0";
                return;
            }

            cart.forEach((item, index) => {
                const numericPrice = Number(item.price.replace(/[^0-9.-]+/g,""));
                total += numericPrice;

                cartContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-info">
                        <h3>${item.name}</h3>
                        <p class="cart-price">${item.price}</p>
                    </div>
                    <button class="cart-remove" data-index="${index}">Remove</button>
                </div>`;
            });

            totalPriceEl.innerText = total;

            document.querySelectorAll(".cart-remove").forEach(button => {
                button.addEventListener("click", () => {
                    const idx = button.getAttribute("data-index");
                    cart.splice(idx, 1);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    loadCart();
                });
            });
        }
        loadCart();
    }

    // --- 5. WISHLIST PAGE FUNCTIONALITY ---
    const wishlistContainer = document.querySelector(".wishlist-container");

    if (wishlistContainer) {
        function loadWishlist() {
            wishlistContainer.innerHTML = "";

            if (wishlist.length === 0) {
                wishlistContainer.innerHTML = "<p style='text-align:center;'>Your wishlist is currently empty.</p>";
                return;
            }

            wishlist.forEach((item, index) => {
                wishlistContainer.innerHTML += `
                <div class="wishlist-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="wishlist-info">
                        <h3>${item.name}</h3>
                        <p class="wishlist-price">${item.price}</p>
                    </div>
                    <button class="wishlist-remove" data-index="${index}">Remove</button>
                </div>`;
            });

            document.querySelectorAll(".wishlist-remove").forEach(button => {
                button.addEventListener("click", () => {
                    const idx = button.getAttribute("data-index");
                    wishlist.splice(idx, 1);
                    localStorage.setItem("wishlist", JSON.stringify(wishlist));
                    loadWishlist();
                });
            });
        }
        loadWishlist();
    }

    // --- 6. SEARCH & FILTER (products.html) ---
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const productCards = document.querySelectorAll(".product-container .product-card");

    function filterProducts() {
        const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
        const categoryValue = categoryFilter ? categoryFilter.value : "all";

        productCards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            const category = card.getAttribute("data-category");

            const matchesSearch = title.includes(searchValue);
            const matchesCategory = categoryValue === "all" || category === categoryValue;

            card.style.display = (matchesSearch && matchesCategory) ? "block" : "none";
        });
    }

    if (searchInput) searchInput.addEventListener("keyup", filterProducts);
    if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);

    // --- 7. AUTHENTICATION TOGGLES ---
    const toggleLoginPassword = document.getElementById("toggleLoginPassword");
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener("click", () => {
            const pwdInput = document.getElementById("loginPassword");
            const type = pwdInput.getAttribute("type") === "password" ? "text" : "password";
            pwdInput.setAttribute("type", type);
            toggleLoginPassword.classList.toggle("fa-eye-slash");
        });
    }

    const toggleSignupPassword = document.getElementById("toggleSignupPassword");
    if (toggleSignupPassword) {
        toggleSignupPassword.addEventListener("click", () => {
            const pwdInput = document.getElementById("signupPassword");
            const type = pwdInput.getAttribute("type") === "password" ? "text" : "password";
            pwdInput.setAttribute("type", type);
            toggleSignupPassword.classList.toggle("fa-eye-slash");
        });
    }

    // Initialize Icon Syncing
    syncWishlistIcons();
});

// --- 8. LOGIN FORM SUBMISSION ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        if (email && password) {
            alert("Login Successful!");
            window.location.href = "index.html";
        } else {
            alert("Please fill in all fields.");
        }
    });
}

// --- 9. CART TO CHECKOUT PAGE REDIRECT ---
const checkoutBtn = document.querySelector(".checkout-btn");
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            alert("Aapka cart khali hai!");
        } else {
            window.location.href = "checkout.html";
        }
    });
}

// --- 10. EMAILJS CHECKOUT INTEGRATION ---
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            alert("Aapka cart khali hai!");
            return;
        }

        // Cart items formatting using item.name
        let itemsList = cart.map(item => `- ${item.name} (${item.price})`).join("\n");

        const templateParams = {
            from_name: document.getElementById("custName").value,
            phone_number: document.getElementById("custPhone").value,
            shipping_address: document.getElementById("custAddress").value,
            order_details: itemsList
        };

        const btn = document.querySelector(".place-order-btn");
        const originalText = btn.innerHTML;
        btn.innerText = "Sending Order...";
        btn.disabled = true;

        emailjs.send('service_ngs68t5', 'template_o9r9y24', templateParams)
            .then(() => {
                alert(`🎉 Order Placed Successfully!\n\nThank you ${name}! Your order has been received.\nWe will contact you shortly.`);
                localStorage.removeItem("cart");
                window.location.href = "index.html";
            }, (error) => {
                alert("Order send karne mein masla hua. Wapis try karein.");
                console.error("EmailJS Error:", error);
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    });
}