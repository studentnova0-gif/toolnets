"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const CART_KEY = "toolnest_cart";

    // Product list
    const products = [
        { name: "Laptop", price: 85000, category: "Electronics" },
        { name: "Electric Drill", price: 6500, category: "Power Tools" },
        { name: "Wireless Headphones", price: 2500, category: "Accessories" },
        { name: "Home Tool Kit", price: 1800, category: "Hardware" },
        { name: "Smart Watch", price: 3200, category: "Electronics" },
        { name: "Angle Grinder", price: 5500, category: "Power Tools" }
    ];

    // Read cart safely
    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            return [];
        }
    }

    // Save cart
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
    }

    // Update cart count in header
    function updateCartCount() {
        const cartCount = document.getElementById("cartCount");

        if (!cartCount) return;

        const count = getCart().reduce(function (total, item) {
            return total + (Number(item.quantity) || 0);
        }, 0);

        cartCount.textContent = count;
    }

    // Add product to cart
    function addToCart(name, price, quantity = 1) {
        const cart = getCart();

        const existingItem = cart.find(function (item) {
            return item.name === name;
        });

        if (existingItem) {
            existingItem.quantity =
                (Number(existingItem.quantity) || 0) + quantity;
        } else {
            cart.push({
                name: name,
                price: Number(price),
                quantity: quantity
            });
        }

        saveCart(cart);
        showMessage(name + " added to your cart!");
    }

    // Show a small message
    function showMessage(message) {
        let notice = document.getElementById("toolnestNotice");

        if (!notice) {
            notice = document.createElement("div");
            notice.id = "toolnestNotice";

            Object.assign(notice.style, {
                position: "fixed",
                right: "20px",
                bottom: "20px",
                zIndex: "9999",
                padding: "14px 20px",
                background: "#17253d",
                color: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 5px 20px rgba(0,0,0,.2)",
                fontSize: "14px",
                maxWidth: "calc(100% - 40px)"
            });

            document.body.appendChild(notice);
        }

        notice.textContent = message;
        notice.style.display = "block";

        if (notice.hideTimer) {
            clearTimeout(notice.hideTimer);
        }

        notice.hideTimer = setTimeout(function () {
            notice.style.display = "none";
        }, 2500);
    }

    // Homepage Add buttons
    document.querySelectorAll(".add-button").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const name = button.dataset.product;
            const price = Number(button.dataset.price);

            if (!name || !Number.isFinite(price) || price < 0) {
                showMessage("Sorry, product details are unavailable.");
                return;
            }

            addToCart(name, price);
        });
    });

    // Product search
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const query = searchInput.value.trim().toLowerCase();

            if (!query) {
                showMessage("Please enter a product name.");
                return;
            }

            const match = products.find(function (product) {
                return product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query);
            });

            if (match) {
                window.location.href =
                    "product.html?name=" + encodeURIComponent(match.name);
            } else {
                const cards = document.querySelectorAll(".product-card");
                let found = false;

                cards.forEach(function (card) {
                    const name = (card.dataset.name || "").toLowerCase();
                    const category = (card.dataset.category || "").toLowerCase();
                    const matches = name.includes(query) ||
                        category.includes(query);

                    card.style.display = matches ? "" : "none";

                    if (matches) found = true;
                });

                if (found) {
                    const grid = document.getElementById("productGrid");
                    if (grid) {
                        grid.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                } else {
                    showMessage("No matching products found.");
                }
            }
        });
    }

    // Category filtering, if category buttons exist on the page
    document.querySelectorAll("[data-filter]").forEach(function (button) {
        button.addEventListener("click", function () {
            const filter = button.dataset.filter.toLowerCase();

            document.querySelectorAll(".product-card").forEach(function (card) {
                const category = (card.dataset.category || "").toLowerCase();
                const matches = filter === "all" || category === filter;

                card.style.display = matches ? "" : "none";
            });
        });
    });

    // Footer year
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Initial cart count
    updateCartCount();
});
