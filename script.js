const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const filterButtons = document.querySelectorAll(".filter-chip");
const searchInput = document.querySelector("#product-search");
const productCards = document.querySelectorAll(".product-card");
const emptyState = document.querySelector(".empty-state");
const revealItems = document.querySelectorAll(".reveal");
const finderForm = document.querySelector("#finder-form");
const finderInput = document.querySelector("#finder-input");
const storeSelect = document.querySelector("#store-select");
const finderResult = document.querySelector("#finder-result");
const quickStoreButtons = document.querySelectorAll(".quick-store");
const personaButtons = document.querySelectorAll(".persona-chip");
const personaLabel = document.querySelector("#persona-label");
const personaTitle = document.querySelector("#persona-title");
const personaText = document.querySelector("#persona-text");
const personaMetricOne = document.querySelector("#persona-metric-one");
const personaMetricTwo = document.querySelector("#persona-metric-two");
const setupTitle = document.querySelector("#setup-title");
const setupText = document.querySelector("#setup-text");
const setupStack = document.querySelector("#setup-stack");
const wishlistButtons = document.querySelectorAll(".wishlist-toggle");
const wishlistCount = document.querySelector("#wishlist-count");
const wishlistTotal = document.querySelector("#wishlist-total");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartCount = document.querySelector("#cart-count");
const cartButton = document.querySelector("#cart-button");
const cartPanel = document.querySelector("#cart-panel");
const cartClose = document.querySelector("#cart-close");
const cartList = document.querySelector("#cart-list");
const cartItemsTotal = document.querySelector("#cart-items-total");
const cartSubtotal = document.querySelector("#cart-subtotal");

let activeFilter = "all";
const cartItems = [];
const savedItems = new Set();

const storeBuilders = {
  amazon: (query) => `https://www.amazon.in/s?k=${query}`,
  flipkart: (query) => `https://www.flipkart.com/search?q=${query}`,
  google: (query) => `https://www.google.com/search?q=${query}+official+store+buy`
};

const storeLabels = {
  amazon: "Amazon",
  flipkart: "Flipkart",
  google: "original store search"
};

const personaContent = {
  creator: {
    label: "Creator mode",
    title: "Build a kit for editing, content, and clean productivity.",
    text: "Balanced picks with stronger displays, polished design, and dependable performance for people who create every day.",
    metricOne: "Video, design, multitasking",
    metricTwo: "creator laptop",
    setupTitle: "Creator Desk Loadout",
    setupText: "Premium phone, strong laptop, and reliable audio gear that feel coordinated and professional.",
    setupItems: ["Flagship phone", "Creator laptop", "Wireless audio"],
    searchPrompt: "creator laptop"
  },
  gamer: {
    label: "Gamer mode",
    title: "Focus on performance, cooling, and immersive hardware choices.",
    text: "This setup prioritizes fast chips, higher power, stronger graphics, and accessories that feel competitive.",
    metricOne: "Gaming, streaming, performance",
    metricTwo: "gaming laptop",
    setupTitle: "Battle Ready Setup",
    setupText: "A power-first mix for intense sessions, quick response, and longer entertainment hours.",
    setupItems: ["Gaming phone", "Performance laptop", "Immersive headphones"],
    searchPrompt: "gaming laptop"
  },
  minimal: {
    label: "Minimalist mode",
    title: "Keep it light, elegant, and efficient for everyday life.",
    text: "Ideal for users who want smart design, long battery life, and uncluttered buying decisions.",
    metricOne: "Travel, daily use, portability",
    metricTwo: "lightweight laptop",
    setupTitle: "Clean Everyday Carry",
    setupText: "Simple, dependable tech choices that feel easy to carry, easy to use, and easy to trust.",
    setupItems: ["Compact phone", "Light laptop", "Smart wearable"],
    searchPrompt: "lightweight laptop"
  }
};

const formatCurrency = (value) => `Rs ${value.toLocaleString("en-IN")}`;

const updateProducts = () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const category = card.dataset.category;
    const name = card.dataset.name;
    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const matchesSearch = !query || name.includes(query);
    const isVisible = matchesFilter && matchesSearch;

    card.classList.toggle("is-hidden", !isVisible);

    if (isVisible) {
      visibleCount += 1;
    }
  });

  emptyState.hidden = visibleCount !== 0;
};

const syncQuickStoreButtons = (selectedStore) => {
  quickStoreButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.store === selectedStore);
  });
};

const buildFinderResult = () => {
  const rawQuery = finderInput.value.trim();
  const selectedStore = storeSelect.value;

  if (!rawQuery) {
    finderResult.textContent = "Enter a product name to generate a direct marketplace search link.";
    return null;
  }

  const encodedQuery = encodeURIComponent(rawQuery);
  const url = storeBuilders[selectedStore](encodedQuery);
  finderResult.innerHTML = `Ready to search <strong>${rawQuery}</strong> on <strong>${storeLabels[selectedStore]}</strong>. <a href="${url}" target="_blank" rel="noopener noreferrer">Open results</a>`;
  return url;
};

const applyPersona = (personaKey) => {
  const persona = personaContent[personaKey];
  if (!persona) {
    return;
  }

  personaButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.persona === personaKey);
  });

  personaLabel.textContent = persona.label;
  personaTitle.textContent = persona.title;
  personaText.textContent = persona.text;
  personaMetricOne.textContent = persona.metricOne;
  personaMetricTwo.textContent = persona.metricTwo;
  setupTitle.textContent = persona.setupTitle;
  setupText.textContent = persona.setupText;
  finderInput.placeholder = `Example: ${persona.searchPrompt}, premium phone, smart watch`;

  setupStack.innerHTML = persona.setupItems.map((item) => `<span>${item}</span>`).join("");
};

const updateWishlist = () => {
  const count = savedItems.size;
  wishlistCount.textContent = String(count);
  wishlistTotal.textContent = String(count);
};

const renderCart = () => {
  cartCount.textContent = String(cartItems.length);
  cartItemsTotal.textContent = String(cartItems.length);

  if (cartItems.length === 0) {
    cartList.innerHTML = '<p class="cart-empty">Your cart is empty. Add a product to preview a real store-style shopping experience.</p>';
    cartSubtotal.textContent = "Rs 0";
    return;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  cartSubtotal.textContent = formatCurrency(subtotal);

  cartList.innerHTML = cartItems.map((item, index) => `
    <article class="cart-item">
      <div>
        <strong>${item.title}</strong>
        <span>${formatCurrency(item.price)}</span>
      </div>
      <button type="button" data-remove-index="${index}">Remove</button>
    </article>
  `).join("");

  cartList.querySelectorAll("[data-remove-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeIndex);
      cartItems.splice(index, 1);
      renderCart();
    });
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((chip) => {
      chip.classList.toggle("is-active", chip === button);
    });

    updateProducts();
  });
});

searchInput.addEventListener("input", updateProducts);

quickStoreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    storeSelect.value = button.dataset.store;
    syncQuickStoreButtons(button.dataset.store);
    buildFinderResult();
  });
});

personaButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyPersona(button.dataset.persona);
  });
});

storeSelect.addEventListener("change", () => {
  syncQuickStoreButtons(storeSelect.value);
  buildFinderResult();
});

finderInput.addEventListener("input", () => {
  buildFinderResult();
  searchInput.value = finderInput.value.trim().toLowerCase();
  updateProducts();
});

if (finderForm) {
  finderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const url = buildFinderResult();

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  });
}

wishlistButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const title = card.dataset.title;

    if (savedItems.has(title)) {
      savedItems.delete(title);
      button.classList.remove("is-saved");
      button.textContent = "Save";
    } else {
      savedItems.add(title);
      button.classList.add("is-saved");
      button.textContent = "Saved";
    }

    updateWishlist();
  });
});

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cartItems.push({
      title: button.dataset.title,
      price: Number(button.dataset.price)
    });

    renderCart();
    body.classList.add("cart-open");
    cartButton.setAttribute("aria-expanded", "true");
    cartPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

if (cartButton) {
  cartButton.addEventListener("click", () => {
    const isOpen = body.classList.toggle("cart-open");
    cartButton.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      cartPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

if (cartClose) {
  cartClose.addEventListener("click", () => {
    body.classList.remove("cart-open");
    cartButton.setAttribute("aria-expanded", "false");
  });
}

if (menuToggle && navPanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navPanel.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("click", () => {
      if (window.innerWidth <= 900 && !element.closest(".nav-utilities")) {
        body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

updateProducts();
syncQuickStoreButtons(storeSelect.value);
buildFinderResult();
updateWishlist();
renderCart();
applyPersona("creator");
