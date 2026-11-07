
'use strict';

// Scripts

window.addEventListener('DOMContentLoaded', () => {

    // Navbar shrink function
    const navbarShrink = () => {
        const navbarCollapsible = document.querySelector('#homeNav');

        if (!navbarCollapsible) {
            return;
        }

        navbarCollapsible.classList.toggle(
            'navbar-shrink',
            window.scrollY > 0
        );
    };

    // Shrink navbar on page load and when scrolling
    navbarShrink();

    window.addEventListener('scroll', navbarShrink, { passive: true });


    // Highlight the current page in the navbar
    const currentPage = window.location.pathname.replace(/\/$/, '') || '/';

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const linkPage = new URL(link.href).pathname.replace(/\/$/, '') || '/';

        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });


    // Collapse responsive navbar when a navigation link is clicked
    const navbarToggler = document.querySelector('.navbar-toggler');

    if (navbarToggler) {
        const responsiveNavItems = document.querySelectorAll(
            '#navbarResponsive .nav-link'
        );

        responsiveNavItems.forEach(navItem => {
            navItem.addEventListener('click', () => {
                const isExpanded =
                    navbarToggler.getAttribute('aria-expanded') === 'true';

                const isVisible =
                    window.getComputedStyle(navbarToggler).display !== 'none';

                if (isVisible && isExpanded) {
                    navbarToggler.click();
                }
            });
        });
    }

});
