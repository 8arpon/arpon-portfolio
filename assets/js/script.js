document.addEventListener("DOMContentLoaded", () => {
    // 1. Multilingual Synchronized Greeting & Animated Name
    const greetingsData = [
        { greet: "Hello", name: "Arpon Sarker." },
        { greet: "হ্যালো", name: "অর্পণ সরকার।" },
        { greet: "Hola", name: "Arpon Sarker." },
        { greet: "Bonjour", name: "Arpon Sarker." },
        { greet: "你好", name: "阿尔彭·萨克尔。" },
        { greet: "Ciao", name: "Arpon Sarker." },
        { greet: "مرحباً", name: "أربون ساركار." },
        { greet: "Привет", name: "Арпон Саркер." },
        { greet: "こんにちは", name: "アルポン・サーカー。" },
        { greet: "Hallo", name: "Arpon Sarker." }
    ];

    const greetElement = document.getElementById("hello-greet");
    const nameElement = document.querySelector(".typing-text");

    let langIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentItem = greetingsData[langIndex];
        const currentName = currentItem.name;

        if (!isDeleting) {
            // Typing characters forward
            if (charIndex <= currentName.length) {
                if (nameElement) {
                    nameElement.innerHTML = currentName.substring(0, charIndex) + "<span class='cursor'></span>";
                }
                charIndex++;
                setTimeout(typeWriter, 120);
            } else {
                // Pause when name is fully displayed
                isDeleting = true;
                setTimeout(typeWriter, 2600);
            }
        } else {
            // Deleting characters
            if (charIndex > 0) {
                if (nameElement) {
                    nameElement.innerHTML = currentName.substring(0, charIndex - 1) + "<span class='cursor'></span>";
                }
                charIndex--;
                setTimeout(typeWriter, 60);
            } else {
                // Switch language smoothly
                isDeleting = false;
                langIndex = (langIndex + 1) % greetingsData.length;
                
                if (greetElement) {
                    greetElement.style.opacity = 0;
                    setTimeout(() => {
                        greetElement.textContent = greetingsData[langIndex].greet;
                        greetElement.style.opacity = 1;
                    }, 350);
                }
                setTimeout(typeWriter, 450);
            }
        }
    }

    if (nameElement) {
        typeWriter();
    }

    // 3. Physics 3D Tilt for Left Card (Desktop only)
    const physicsCards = document.querySelectorAll(".physics-card");

    physicsCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            if (window.innerWidth <= 768) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -1.5; 
            const rotateY = ((x - centerX) / centerX) * 1.5;

            card.style.transition = "none";
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });

        card.addEventListener("mouseleave", () => {
            if (window.innerWidth <= 768) return;
            card.style.transition = "transform 0.5s ease";
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        });
    });

    // 4. Scroll Reveal (Smooth & Re-triggerable on scroll up and down)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            } else {
                // Remove when completely out of viewport so it re-animates smoothly upon scrolling back
                const rect = entry.target.getBoundingClientRect();
                if (rect.top > window.innerHeight || rect.bottom < 0) {
                    entry.target.classList.remove("visible");
                }
            }
        });
    }, { 
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
    });

    document.querySelectorAll(".scroll-reveal").forEach(el => {
        observer.observe(el);
    });

    // 5. Navigation Highlight
    const sections = document.querySelectorAll(".page-section");
    const navLinks = document.querySelectorAll(".nav-link");
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }

        let currentSection = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute("id");
            }
        });

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            currentSection = "contact";
        }

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
        // Scroll-to-top button show/hide logic
        const scrollToTopBtn = document.getElementById("scroll-to-top");
        if (scrollToTopBtn) {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add("visible");
            } else {
                scrollToTopBtn.classList.remove("visible");
            }
        }
    }, { passive: true });

    // Scroll to Top Click Behavior
    const scrollToTopBtn = document.getElementById("scroll-to-top");
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // 6. Mobile Menu
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinksWrapper = document.querySelector(".nav-links-wrapper");

    if (menuToggle && navLinksWrapper) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = navLinksWrapper.classList.toggle("active");
            menuToggle.classList.toggle("is-active", isOpen);
        });

        // Close menu when clicking on any nav link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navLinksWrapper.classList.remove("active");
                menuToggle.classList.remove("is-active");
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (!navLinksWrapper.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinksWrapper.classList.remove("active");
                menuToggle.classList.remove("is-active");
            }
        });
    }

    // 6.1. Mobile Tap-to-Toggle for Developer Showcase Card
    const illustrationCard = document.querySelector(".df-illustration-card");
    if (illustrationCard) {
        illustrationCard.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
                // If clicking an interactive link or traffic lights, allow default
                if (e.target.closest("a, button, input")) return;
                e.stopPropagation();
                illustrationCard.classList.toggle("is-active");
            }
        });

        // Tapping anywhere outside on mobile reverts back to full normal photo
        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 768 && !illustrationCard.contains(e.target)) {
                illustrationCard.classList.remove("is-active");
            }
        });
    }

    // 7. Toast Notification Utility
    const toast = document.getElementById("toast-notification");
    const toastMessage = document.getElementById("toast-message");
    let toastTimeout = null;

    function showToast(message, duration = 3000) {
        if (!toast) return;
        if (toastMessage) toastMessage.textContent = message;
        toast.classList.add("show");

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, duration);
    }



    // 9. Interactive Contact Form Submission (AJAX + Friendly status feedback)
    const contactForm = document.getElementById("portfolio-contact-form");
    const formStatus = document.getElementById("form-status");
    const submitBtn = document.getElementById("form-submit-btn");
    const btnText = submitBtn ? submitBtn.querySelector(".btn-text") : null;

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (submitBtn) {
                submitBtn.disabled = true;
                if (btnText) btnText.textContent = "Sending...";
            }
            if (formStatus) {
                formStatus.style.display = "none";
                formStatus.className = "form-status";
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json().catch(() => null);

                if (response.ok && (!data || data.success)) {
                    contactForm.reset();
                    if (formStatus) {
                        formStatus.textContent = "Thank you! Your message has been sent successfully. I'll get back to you shortly.";
                        formStatus.className = "form-status success";
                        formStatus.style.display = "block";
                    }
                    showToast("Message sent successfully!");
                } else {
                    const errorMsg = data && data.message ? data.message : "Oops! There was a problem submitting your form. You can email me directly at contact@arponsarker.bond";
                    if (formStatus) {
                        formStatus.textContent = errorMsg;
                        formStatus.className = "form-status error";
                        formStatus.style.display = "block";
                    }
                }
            } catch (error) {
                if (formStatus) {
                    formStatus.textContent = "Oops! Could not send message right now. Feel free to contact via Email or WhatsApp directly.";
                    formStatus.className = "form-status error";
                    formStatus.style.display = "block";
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnText) btnText.textContent = "Send Message";
                }
            }
        });
    }

    // Terminal interactive card - hover handles opening/closing cleanly via CSS


    // Theme Initialization & Toggle Logic
    const themeToggleBtn = document.querySelector(".theme-toggle");
    const sunIcon = document.querySelector(".sun-icon");
    const moonIcon = document.querySelector(".moon-icon");

    function applyTheme(theme) {
        if (theme === "light") {
            document.body.classList.add("light-mode");
            if (sunIcon) sunIcon.style.display = "none";
            if (moonIcon) moonIcon.style.display = "block";
        } else {
            document.body.classList.remove("light-mode");
            if (sunIcon) sunIcon.style.display = "block";
            if (moonIcon) moonIcon.style.display = "none";
        }
    }

    // Auto-update Tab Favicon strictly based on Desktop / OS theme (prefers-color-scheme)
    function updateDesktopFavicon(isDark) {
        const icons = document.querySelectorAll("link[rel~='icon']");
        icons.forEach(icon => {
            if (isDark) {
                if (icon.getAttribute("media") === "(prefers-color-scheme: dark)" || !icon.hasAttribute("media")) {
                    icon.href = "assets/images/arpon-logo-darkmode.png";
                }
            } else {
                if (icon.getAttribute("media") === "(prefers-color-scheme: light)" || !icon.hasAttribute("media")) {
                    icon.href = "assets/images/arpon-logo-tight.png";
                }
            }
        });
    }

    if (window.matchMedia) {
        const osDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
        updateDesktopFavicon(osDarkQuery.matches);
        osDarkQuery.addEventListener("change", (e) => {
            updateDesktopFavicon(e.matches);
        });
    }

    // Check saved theme; if none, default to light
    const savedTheme = localStorage.getItem("theme");
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    const initialTheme = savedTheme ? savedTheme : (prefersLight ? "light" : "light");
    applyTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isCurrentlyLight = document.body.classList.contains("light-mode");
            const newTheme = isCurrentlyLight ? "dark" : "light";
            applyTheme(newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    // 12. Interactive Project Category Filter
    const filterButtons = document.querySelectorAll(".project-filter-btn");
    const projectCards = document.querySelectorAll(".projects-grid .project-card");

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const filter = btn.getAttribute("data-filter");

                // Update active button state
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                // Filter cards with smooth fade
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute("data-category");

                    if (filter === "all" || cardCategory === filter) {
                        card.style.display = "flex";
                        requestAnimationFrame(() => {
                            card.style.opacity = "1";
                            card.style.transform = "scale(1)";
                        });
                    } else {
                        card.style.opacity = "0";
                        card.style.transform = "scale(0.95)";
                        setTimeout(() => {
                            if (!btn.classList.contains("active") || btn.getAttribute("data-filter") !== filter) return;
                            card.style.display = "none";
                        }, 250);
                    }
                });
            });
        });
    }
});