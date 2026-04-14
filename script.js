document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements to animate
    const hiddenElements = document.querySelectorAll('.hidden-element, .hidden-left, .hidden-right');
    
    hiddenElements.forEach(el => {
        observer.observe(el);
    });

    // Mobile Menu Toggle (Basic functionality)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // In a full implementation, you'd add classes here for a slide-out menu.
    // Since this is a streamlined Premium UI, we keep the JS lightweight.
    mobileMenuToggle.addEventListener('click', () => {
        alert("Mobile menu opens here.");
    });

    // --- Consultation Form & BMI Logic ---
    const form = document.getElementById('consultationForm');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const bmiInput = document.getElementById('bmi');
    const formMessage = document.getElementById('formMessage');

    function calculateBMI() {
        const weight = parseFloat(weightInput.value);
        const heightCm = parseFloat(heightInput.value);
        if (weight > 0 && heightCm > 0) {
            const heightM = heightCm / 100;
            const bmi = (weight / (heightM * heightM)).toFixed(2);
            let category = "";
            if (bmi < 18.5) category = "Underweight";
            else if (bmi < 24.9) category = "Normal";
            else if (bmi < 29.9) category = "Overweight";
            else category = "Obese";
            
            bmiInput.value = `${bmi} - ${category}`;
        } else {
            bmiInput.value = "";
        }
    }

    if (weightInput && heightInput) {
        weightInput.addEventListener('input', calculateBMI);
        heightInput.addEventListener('input', calculateBMI);
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            const payload = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                age: document.getElementById('age').value,
                weight: document.getElementById('weight').value,
                height: document.getElementById('height').value,
                bmi: document.getElementById('bmi').value,
                problem: document.getElementById('problem').value
            };

            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz74b_iopimjcotqRDvDos89P8nGUTanLfkZnsEuHwej-eVr3iKpeuO3UOXySefX7hEfg/exec';

            try {
                if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
                    setTimeout(() => {
                        formMessage.style.display = 'block';
                        formMessage.style.color = '#e63946'; // Red
                        formMessage.innerText = "Developer Notice: Please update GOOGLE_SCRIPT_URL in script.js to connect to Google Sheets.";
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                    return;
                }

                // Make the POST request to the Apps Script endpoint
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                formMessage.style.display = 'block';
                formMessage.style.color = '#25d366'; // WhatsApp green
                formMessage.innerText = "Thank you! Your information has been received. Please check your email for the offers and Mohnish Sir's reply.";
                form.reset();
                if (bmiInput) bmiInput.value = "";
            } catch (err) {
                formMessage.style.display = 'block';
                formMessage.style.color = '#e63946';
                formMessage.innerText = "Oops! Something went wrong. Please try again later.";
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
