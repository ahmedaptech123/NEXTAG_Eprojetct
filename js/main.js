// NEXTAG simple JavaScript: menu, filtering, comparison and contact form.

// Open or close the navigation menu on small screens.
function toggleMenu() {
    const menu = document.getElementById("navLinks");
    if (menu) menu.classList.toggle("show");
}

// Filter the HTML cards by brand and search text.
function filterCards() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    const brand = document.getElementById("brandFilter").value;
    const search = document.getElementById("searchBox").value.toLowerCase();
    const cards = grid.getElementsByClassName("product-card");
    let visible = 0;

    for (let i = 0; i < cards.length; i++) {
        const cardBrand = cards[i].getAttribute("data-brand");
        const cardText = cards[i].getAttribute("data-name");
        const brandMatch = brand === "All" || brand === cardBrand;
        const searchMatch = cardText.includes(search);

        if (brandMatch && searchMatch) {
            cards[i].style.display = "block";
            visible++;
        } else {
            cards[i].style.display = "none";
        }
    }

    document.getElementById("resultCount").textContent = visible + " PRODUCTS";
}

// Reset the brand and search controls.
function clearFilters() {
    const brand = document.getElementById("brandFilter");
    const search = document.getElementById("searchBox");
    if (brand) brand.value = "All";
    if (search) search.value = "";
    filterCards();
}

// Save checked product cards for the comparison page.
function saveCompareSelections() {
    const checks = document.getElementsByClassName("compare-check");
    let selected = [];

    for (let i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
            selected.push({
                id: checks[i].getAttribute("data-id"),
                name: checks[i].getAttribute("data-name"),
                brand: checks[i].getAttribute("data-brand"),
                category: checks[i].getAttribute("data-category"),
                price: checks[i].getAttribute("data-price"),
                material: checks[i].getAttribute("data-material"),
                color: checks[i].getAttribute("data-color"),
                size: checks[i].getAttribute("data-size")
            });
        }
    }

    let oldSelected = JSON.parse(localStorage.getItem("nextagCompare") || "[]");
    for (let j = 0; j < selected.length; j++) {
        let found = false;
        for (let k = 0; k < oldSelected.length; k++) {
            if (oldSelected[k].id === selected[j].id) found = true;
        }
        if (!found) oldSelected.push(selected[j]);
    }
    localStorage.setItem("nextagCompare", JSON.stringify(oldSelected));

    const note = document.getElementById("compareNote");
    if (note) note.textContent = oldSelected.length + " product(s) selected";
}

// Display the saved products in a comparison table.
function loadComparison() {
    const area = document.getElementById("compareTable");
    if (!area) return;

    const selected = JSON.parse(localStorage.getItem("nextagCompare") || "[]");
    if (selected.length < 2) {
        area.innerHTML = '<p class="empty-message">Select at least two products from the Purses or Wallets page.</p>';
        return;
    }

    let html = '<table class="comparison-table"><tr><th>Feature</th>';
    for (let i = 0; i < selected.length; i++) {
        html += '<th>' + selected[i].name + '</th>';
    }
    html += '</tr>';

    const fields = [["Brand","brand"],["Category","category"],["Price","price"],
        ["Material","material"],["Color","color"],["Size","size"]];

    for (let r = 0; r < fields.length; r++) {
        html += '<tr><td>' + fields[r][0] + '</td>';
        for (let c = 0; c < selected.length; c++) {
            html += '<td>' + selected[c][fields[r][1]] + '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    area.innerHTML = html;
}

// Clear the comparison list.
function clearComparison() {
    localStorage.removeItem("nextagCompare");
    loadComparison();
}

// Check the contact form fields.
function validateContactForm(event) {
    event.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();
    const feedback = document.getElementById("formFeedback");

    if (name === "" || email === "" || message === "") {
        feedback.textContent = "Please fill in your name, email and message.";
        feedback.className = "form-feedback error";
    } else {
        feedback.textContent = "Thank you. Your form has passed the basic validation.";
        feedback.className = "form-feedback success";
    }
}

// Run the page functions after the HTML has loaded.
document.addEventListener("DOMContentLoaded", function() {
    const brandFilter = document.getElementById("brandFilter");
    const searchBox = document.getElementById("searchBox");
    const checks = document.getElementsByClassName("compare-check");

    if (brandFilter) brandFilter.addEventListener("change", filterCards);
    if (searchBox) searchBox.addEventListener("input", filterCards);

    for (let i = 0; i < checks.length; i++) {
        checks[i].addEventListener("change", saveCompareSelections);
    }

    if (document.body.getAttribute("data-page") === "compare") loadComparison();

    const form = document.getElementById("contactForm");
    if (form) form.addEventListener("submit", validateContactForm);
});
