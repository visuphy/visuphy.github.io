/**
 * Initializes the mobile navigation menu toggle functionality.
 * This function finds the necessary elements and adds the click listener.
 */
function initializeMobileMenu() {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.header-nav');

    // Check if the menu elements exist on the page
    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            // Toggle the visibility state on each click
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';

            if (isVisible) {
                primaryNav.setAttribute('data-visible', false);
                navToggle.setAttribute('aria-expanded', false);
            } else {
                primaryNav.setAttribute('data-visible', true);
                navToggle.setAttribute('aria-expanded', true);
            }
        });
    }
}

/**
 * Fetches HTML content from a file and injects it into a specified element.
 * @param {string} elementId - The ID of the element to inject the HTML into.
 * @param {string} filePath - The path to the HTML file to load.
 * @param {function} [callback] - An optional function to run after the HTML is successfully loaded.
 */
function includeHTML(elementId, filePath, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
                // If a callback function was provided, execute it now.
                if (callback) {
                    callback();
                }
            }
        })
        .catch(error => console.error('Error loading HTML:', error));
}


/**
 * Hides holiday elements if outside Dec 22 - Jan 2 date range.
 */
function checkHolidayVisibility() {
    const today = new Date();
    const month = today.getMonth(); // 0-11
    const day = today.getDate();
    const isHolidayPeriod = (month === 11 && day >= 22) || (month === 0 && day <= 2);

    if (!isHolidayPeriod) {
        const holidayElements = [
            'header-snowflake',
            'footer-holiday'
        ];
        holidayElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    }
}

// Main execution block that runs after the initial page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load the header, and THEN initialize the mobile menu using the callback
    includeHTML('header-placeholder', '/header.html', () => {
        initializeMobileMenu();
        checkHolidayVisibility();
    });

    // Load the footer and check holiday visibility
    includeHTML('footer-placeholder', '/footer.html', checkHolidayVisibility);

    // Re-initialize share button functionality for the index page
    // Check if we are on a page that has share buttons
    if (document.querySelector('.share-button')) {
        document.addEventListener('click', (e) => {
            const shareButton = e.target.closest('.share-button');
            if (shareButton) {
                const card = shareButton.closest('.simulation-card');
                const title = card.querySelector('.card-title').textContent;
                const url = card.querySelector('.card-link').href;

                if (navigator.share) {
                    navigator.share({ title, text: `Check out this physics simulation: ${title}`, url });
                } else {
                    navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
                }
            }
        }, { capture: true }); // Use capture to ensure listener is ready for dynamically added elements
    }
});