document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const thankYouMessage = document.querySelector('.thank-you-message');
    const btnText = submitBtn.querySelector('span');
    const captchaModal = document.querySelector('.captcha-modal');
    const closeCaptchaBtn = document.querySelector('.close-captcha');
    const verifyCaptchaBtn = document.getElementById('verifyCaptcha');
    const captchaNum1 = document.getElementById('captchaNum1');
    const captchaNum2 = document.getElementById('captchaNum2');
    const captchaAnswer = document.getElementById('captchaAnswer');
    
    // Check if returning from form submission
    if (window.location.hash === '#contact' && sessionStorage.getItem('formSubmitted')) {
        Array.from(contactForm.querySelectorAll('.form-group, button')).forEach(el => {
            el.style.display = 'none';
        });
        thankYouMessage.style.display = 'block';
        sessionStorage.removeItem('formSubmitted');
        
        setTimeout(() => {
            location.hash = '';
            location.reload();
        }, 3600000);
    }
    
    // Rate limiting
    const submissionTimestamp = localStorage.getItem('lastFormSubmission');
    const currentTime = new Date().getTime();
    const cooldownPeriod = 60000;
    
    if (submissionTimestamp && (currentTime - parseInt(submissionTimestamp)) < cooldownPeriod) {
        submitBtn.disabled = true;
        btnText.textContent = 'PLEASE WAIT...';
        
        const remainingTime = Math.ceil((parseInt(submissionTimestamp) + cooldownPeriod - currentTime) / 1000);
        alert(`Please wait ${remainingTime} seconds before submitting again.`);
        
        setTimeout(() => {
            submitBtn.disabled = false;
            btnText.textContent = 'SEND MESSAGE';
        }, parseInt(submissionTimestamp) + cooldownPeriod - currentTime);
    }
    
    // Fix for floating labels
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        // Check initial state
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('has-value');
        }
        
        // Add event listeners
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            if (input.value.trim() !== '') {
                input.parentElement.classList.add('has-value');
            } else {
                input.parentElement.classList.remove('has-value');
            }
        });
        
        // For real-time updates
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.parentElement.classList.add('has-value');
            } else {
                input.parentElement.classList.remove('has-value');
            }
        });
    });
    
    // Generate CAPTCHA numbers
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        captchaNum1.textContent = num1;
        captchaNum2.textContent = num2;
        captchaAnswer.value = '';
        return num1 + num2;
    }
    
    // Show CAPTCHA modal with animation
    function showCaptchaModal() {
        captchaModal.style.display = 'flex';
        // Trigger reflow
        void captchaModal.offsetWidth;
        captchaModal.classList.add('active');
        setTimeout(() => {
            captchaAnswer.focus();
        }, 300);
    }
    
    // Hide CAPTCHA modal with animation
    function hideCaptchaModal() {
        captchaModal.classList.remove('active');
        setTimeout(() => {
            captchaModal.style.display = 'none';
        }, 300);
    }
    
    // Show CAPTCHA modal
    submitBtn.addEventListener('click', function() {
        const nameField = document.getElementById('name');
        const messageField = document.getElementById('message');
        
        // Basic form validation
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        
        // Spam detection
        const suspiciousPatterns = [
            /\[url=/i, 
            /\[link=/i,
            /http:\/\//i,
            /https:\/\//i,
            /viagra/i,
            /casino/i,
            /loan/i
        ];
        
        const messageText = messageField.value.toLowerCase();
        const nameText = nameField.value.toLowerCase();
        
        for (const pattern of suspiciousPatterns) {
            if (pattern.test(messageText) || pattern.test(nameText)) {
                alert('Your message contains content that appears to be spam. Please revise and try again.');
                return;
            }
        }
        
        const linkCount = (messageText.match(/http/g) || []).length;
        if (linkCount > 2) {
            alert('Too many links detected. Please limit the number of links in your message.');
            return;
        }
        
        // Show CAPTCHA
        generateCaptcha();
        showCaptchaModal();
    });
    
    // Close CAPTCHA modal
    closeCaptchaBtn.addEventListener('click', function() {
        hideCaptchaModal();
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && captchaModal.classList.contains('active')) {
            hideCaptchaModal();
        }
    });
    
    // Close modal if clicked outside
    captchaModal.addEventListener('click', function(e) {
        if (e.target === captchaModal) {
            hideCaptchaModal();
        }
    });
    
    // Allow only numbers in CAPTCHA input
    captchaAnswer.addEventListener('keydown', function(e) {
        // Allow: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // Let it happen
            return;
        }
        
        // Ensure that it's a number and stop the keypress if not
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
            (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    
    // Prevent mouse wheel from changing the value
    captchaAnswer.addEventListener('wheel', function(e) {
        e.preventDefault();
    });
    
    // Verify CAPTCHA and submit form
    verifyCaptchaBtn.addEventListener('click', function() {
        const expectedAnswer = parseInt(captchaNum1.textContent) + parseInt(captchaNum2.textContent);
        const userAnswer = parseInt(captchaAnswer.value);
        
        if (userAnswer === expectedAnswer) {
            // Hide CAPTCHA
            hideCaptchaModal();
            
            // Update button state
            btnText.textContent = 'SENDING...';
            submitBtn.disabled = true;
            
            // Store submission state
            sessionStorage.setItem('formSubmitted', 'true');
            localStorage.setItem('lastFormSubmission', new Date().getTime().toString());
            
            // Submit the form
            contactForm.submit();
            
            // Show thank you message immediately (for better UX)
            setTimeout(() => {
                Array.from(contactForm.querySelectorAll('.form-group, button')).forEach(el => {
                    el.style.display = 'none';
                });
                thankYouMessage.style.display = 'block';
            }, 1000);
        } else {
            // Shake effect for wrong answer
            captchaAnswer.classList.add('shake');
            setTimeout(() => {
                captchaAnswer.classList.remove('shake');
            }, 600);
            
            // Generate new CAPTCHA
            setTimeout(() => {
                generateCaptcha();
                captchaAnswer.focus();
            }, 600);
        }
    });
    
    // Allow Enter key in CAPTCHA input
    captchaAnswer.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            verifyCaptchaBtn.click();
        }
    });
    
    // Function to toggle thank you message preview (only accessible via URL hash)
    window.toggleThankYouPreview = function() {
        contactForm.classList.toggle('preview-thank-you');
    };
    
    // Check for preview mode in URL
    if (window.location.hash === '#preview-thank-you') {
        setTimeout(() => {
            toggleThankYouPreview();
        }, 500);
    }
}); 