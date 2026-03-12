document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark mode if no saved theme
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark && false)) { 
        // Note: Forcing dark as default requirement. 
        htmlElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fa-solid fa-moon';
    }

    // Toggle theme with button
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            htmlElement.setAttribute('data-theme', 'light');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 3. Navbar scroll effect & Active Menu Item Setting
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Navbar shadow on scroll
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Optional: stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Update Footer Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 6. Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = btn.innerHTML;
            
            // Show sending state
            btn.innerHTML = '<span>Opening Mail...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Construct mailto link
            const mailtoLink = `mailto:seifelbastawisi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
            
            // Simulate processing delay for UX
            setTimeout(() => {
                // Open default mail client
                window.location.href = mailtoLink;
                
                // Show success state
                btn.innerHTML = '<span>Ready to Send!</span> <i class="fa-solid fa-check"></i>';
                btn.style.backgroundColor = '#10b981'; // Success green
                btn.style.borderColor = '#10b981';
                btn.style.color = 'white';
                
                // Reset form
                contactForm.reset();
                
                // Revert button after 4 seconds
                setTimeout(() => {
                    btn.innerHTML = originalBtnContent;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 4000);
            }, 800);
        });
    }

    // 8. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    // 9. Typing Effect
    const typedTextSpan = document.getElementById('typed-text');
    if (typedTextSpan) {
        const textArray = ["(React Ecosystem)", "(Modern Interfaces)", "(Interactive Web)"];
        let textArrayIndex = 0;
        let charIndex = 0;
        
        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, 100);
            } else {
                setTimeout(erase, 2000);
            }
        }
        
        function erase() {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, 50);
            } else {
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, 1000);
            }
        }
        
        // Start typing effect on load
        setTimeout(type, 1000);
    }

    // 10. 3D Tilt Effect for Project Cards
    const tiltCards = document.querySelectorAll('.project-card');
    tiltCards.forEach(card => {
        card.classList.add('tilt-card');
        
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });

    // 11. Chatbot Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSendBtn = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            if(chatbotWindow.classList.contains('active')) {
                setTimeout(() => chatbotInput.focus(), 300);
            }
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', sender);
            
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('message-content');
            contentDiv.textContent = text;
            
            messageDiv.appendChild(contentDiv);
            chatbotMessages.appendChild(messageDiv);
            
            // Auto scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function getBotResponse(input) {
            const lowerInput = input.toLowerCase();
            
            // Arabic Responses
            if (lowerInput.includes('عربي') || lowerInput.includes('اهلا') || lowerInput.includes('مرحبا') || lowerInput.includes('سلام')) {
                return "أهلاً بك! أنا مساعد سيف الذكي. يمكنك سؤالي عن مهاراته، مشاريعه، تعليمه، أو طرق التواصل معه.";
            } else if (lowerInput.includes('خبرة') || lowerInput.includes('شغل') || lowerInput.includes('عمل')) {
                return "عمل سيف في شركة برمجيات في عام 2024 وتخصص في بناء واجهات المستخدم باستخدام React، وقد أنهى خدمته العسكرية بنجاح مؤخراً.";
            } else if (lowerInput.includes('مهارة') || lowerInput.includes('مهارات') || lowerInput.includes('تكنولوجيا')) {
                return "سيف متخصص في الـ Frontend ويستخدم React, JavaScript, TypeScript, HTML, CSS, بالإضافة لمكتبات مثل Tailwind و Bootstrap.";
            } else if (lowerInput.includes('مشاريع') || lowerInput.includes('مشروع')) {
                return "قام سيف ببناء عدة مشاريع منها أكاديمية سمارت (مشروع التخرج)، ومتاجر إلكترونية مثل Icona Store.";
            } else if (lowerInput.includes('تواصل') || lowerInput.includes('ايميل')) {
                return "يمكنك التواصل معه مباشرة عبر الإيميل seifelbastawisi@gmail.com أو عبر حسابه على لينكد إن وأسفل هذه الصفحة.";
            } 
            // English Responses
            else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
                return "Hello there! How can I help you today?";
            } else if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('react')) {
                return "Seif specializes in modern Frontend Development using React, JavaScript, TypeScript, Tailwind CSS, Bootstrap, HTML, and CSS.";
            } else if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('hire')) {
                return "You can reach out to Seif directly at seifelbastawisi@gmail.com, or use the contact links in the footer!";
            } else if (lowerInput.includes('project') || lowerInput.includes('portfolio')) {
                return "Seif has built several projects including 'Smart Academy' (University Platform), a Restaurant E-commerce platform, and 'Icona Store'. Check out the Projects section!";
            } else if (lowerInput.includes('experience') || lowerInput.includes('work')) {
                return "He worked at a software company in 2024 building React interfaces and recently safely completed his military service.";
            } else if (lowerInput.includes('education') || lowerInput.includes('university')) {
                return "He holds a degree from the Faculty of Computers and Information at Mansoura University.";
            } else {
                return "I'm a simple bot, so I might not understand everything perfectly. Try asking about Seif's 'skills', 'projects', 'education', or 'contact'!";
            }
        }

        function handleSend() {
            const text = chatbotInput.value.trim();
            if (text === '') return;
            
            // Add user message
            addMessage(text, 'user');
            chatbotInput.value = '';
            
            // Simulate bot thinking
            setTimeout(() => {
                const response = getBotResponse(text);
                addMessage(response, 'bot');
            }, 600);
        }

        chatbotSendBtn.addEventListener('click', handleSend);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

});
