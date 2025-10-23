document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const hamburger = document.querySelector(".hamburger");
  const navbar = document.querySelector(".navbar");
  const closeBtn = document.querySelector(".close-btn");
  const contact = document.getElementById("contact-link");
  const toggleButton = document.getElementById("toggle-style");
  const contactForm = document.getElementById("contact-form");
  const messageDisplay = document.getElementById("messages");

  // Hamburger menu toggle
  if (hamburger && navbar) {
    hamburger.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  }

  // Close menu button
  if (closeBtn && navbar) {
    closeBtn.addEventListener("click", () => {
      navbar.classList.remove("active");
    });
  }

  // Close navbar when clicking outside
  document.addEventListener("click", (event) => {
    const isClickInsideHamburger = hamburger && hamburger.contains(event.target);
    const isClickInsideNavbar = navbar && navbar.contains(event.target);

    if (!isClickInsideHamburger && !isClickInsideNavbar) {
      navbar.classList.remove("active");
    }
  });

  // FAQ accordion toggle
  const faqItems = document.querySelectorAll('.faq-item h2');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.parentElement;
      parent.classList.toggle('active');
    });
  });

  // Toggle contact link style (if toggle button exists)
  if (contact && toggleButton) {
    toggleButton.addEventListener("click", () => {
      contact.classList.toggle("contact-link");
    });
  }

  // Highlight current page link in navbar
  const links = document.querySelectorAll(".navbar a");
  const currentPage = location.pathname.split("/").pop().split("?")[0].split("#")[0];
  links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // Projects: Set image src, lazy loading, and link click
  const projIds = ['proj1', 'proj2', 'proj3', 'proj4', 'proj5', 'proj6'];
  const projLinks = [
    'https://bahintingchristopher.github.io/wdd130/',
    'https://bahintingchristopher.github.io/calculator/calculator.html',
    'https://bahintingchristopher.github.io/pingpong/score.html',
    'https://bahintingchristopher.github.io/wdd131/filtered-temples.html',
    'https://bahintingchristopher.github.io/wdd131/place.html',
    'https://bahintingchristopher.github.io/wdd131/index'
  ];
  const projImages = [
    'images/rafting1.jpg',
    'images/calculator.png',
    'images/scoring_app.png',
    'images/temples.jpg',
    'images/places.jpg',
    'images/aboutMe.jpg'
  ];

  projIds.forEach((id, index) => {
    const proj = document.getElementById(id);
    if (proj) {
      proj.setAttribute('loading', 'lazy');
      proj.setAttribute('src', projImages[index]);
      proj.style.cursor = 'pointer';
      proj.addEventListener('click', () => {
        if (projLinks[index]) {
          window.open(projLinks[index], '_blank');
        }
      });
    }
  });

  // ✅ UPDATED: Message Count API - use Render backend
  function updateMessageCount() {
    fetch('https://bahins-backend.onrender.com/message-count')
      .then(response => response.json())
      .then(data => {
        const countEl = document.getElementById('messageCount');
        if (countEl) {
          countEl.textContent = data.count;
        }
      })
      .catch(error => console.error('Error fetching message count:', error));
  }

  // Call once on page load
  updateMessageCount();

  // ✅ UPDATED: Contact form submission to use live backend
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const formData = {
        name: this.name.value,
        email: this.email.value,
        reason: this.reason.value,
        message: this.message.value,
      };

      fetch('https://bahins-backend.onrender.com/submit-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Message sent successfully!');
        updateMessageCount();  // update the count after success
        this.reset();          // clear the form
        window.open('response.html', '_self');  // replace current page
      })
      .catch(err => {
        alert('Failed to send message.');
        console.error(err);
      });
    });
  }
});
