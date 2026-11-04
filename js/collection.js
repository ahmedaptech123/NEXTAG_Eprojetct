
// NEXTAG Collection JavaScript
// Handles product searching and brand filtering.

// Wait until the HTML page has loaded.
document.addEventListener("DOMContentLoaded", function () {

    // Get search and filter elements.
    const searchBox = document.getElementById("searchBox");
    const brandFilter = document.getElementById("brandFilter");
    const clearButton = document.getElementById("clearFilters");

    // Get both product grids.
    const grids = [
        {
            element: document.getElementById("purseGrid"),
            count: document.getElementById("purseResultCount"),
            label: "PURSES"
        },
        {
            element: document.getElementById("walletGrid"),
            count: document.getElementById("walletResultCount"),
            label: "WALLETS"
        }
    ];

    // Stop if the collection page elements are not present.
    if (!searchBox || !brandFilter) {
        return;
    }

    // Filter products according to search and brand.
    function filterCollectionProducts() {

        const searchText = searchBox.value.trim().toLowerCase();
        const selectedBrand = brandFilter.value;

        grids.forEach(function (grid) {

            if (!grid.element) {
                return;
            }

            const cards = grid.element.querySelectorAll(".product-card");
            const noResults = grid.element.querySelector(".no-results");

            let visibleCount = 0;

            cards.forEach(function (card) {

                const productText = (
                    card.dataset.name + " " +
                    card.innerText
                ).toLowerCase();

                const productBrand = card.dataset.brand;

                // Check search text.
                const matchesSearch = productText.includes(searchText);

                // Check selected brand.
                const matchesBrand =
                    selectedBrand === "all" ||
                    productBrand === selectedBrand;

                // Show or hide product cards.
                if (matchesSearch && matchesBrand) {

                    card.style.display = "";
                    visibleCount++;

                } else {

                    card.style.display = "none";

                }

            });

            // Display message when no products match.
            if (noResults) {

                noResults.style.display =
                    visibleCount === 0 ? "block" : "none";

            }

            // Update product counter.
            if (grid.count) {

                grid.count.textContent =
                    visibleCount + " " + grid.label;

            }

        });

    }

    // Search products while typing.
    searchBox.addEventListener("input", filterCollectionProducts);

    // Filter products when a brand is selected.
    brandFilter.addEventListener("change", filterCollectionProducts);

    // Clear search and brand filters.
    if (clearButton) {

        clearButton.addEventListener("click", function () {

            searchBox.value = "";
            brandFilter.value = "all";

            filterCollectionProducts();

        });

    }

    // Display initial product counts.
    filterCollectionProducts();

});
