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
    
    function generateFingerprint() {
        const userAgent = navigator.userAgent;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const colorDepth = window.screen.colorDepth;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language;
        
        return btoa(`${userAgent}|${screenWidth}|${screenHeight}|${colorDepth}|${timezone}|${language}`);
    }
    
    const browserFingerprint = generateFingerprint();
    
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
    
    const cooldownPeriod = 60000;
    
    function getLastSubmissionTime() {
        const localStorageTime = localStorage.getItem('lastFormSubmission');
        
        const sessionStorageTime = sessionStorage.getItem('lastFormSubmission');
        
        const cookieTime = getCookie('lastFormSubmission');
        
        const times = [
            localStorageTime ? parseInt(localStorageTime) : 0,
            sessionStorageTime ? parseInt(sessionStorageTime) : 0,
            cookieTime ? parseInt(cookieTime) : 0
        ];
        
        return Math.max(...times);
    }
    
    function setCookie(name, value, minutes) {
        const date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Strict";
    }
    
    function getCookie(name) {
        const cookieName = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return "";
    }
    
    function storeSubmissionTime(timestamp) {
        localStorage.setItem('lastFormSubmission', timestamp);
        sessionStorage.setItem('lastFormSubmission', timestamp);
        setCookie('lastFormSubmission', timestamp, 2);
        
        localStorage.setItem(`lastFormSubmission_${browserFingerprint}`, timestamp);
        sessionStorage.setItem(`lastFormSubmission_${browserFingerprint}`, timestamp);
        setCookie(`lastFormSubmission_${browserFingerprint}`, timestamp, 2);
    }
    
    function updateButtonCooldown() {
        const now = new Date().getTime();
        
        const lastSubmission = getLastSubmissionTime();
        
        const fingerprintLastSubmission = Math.max(
            parseInt(localStorage.getItem(`lastFormSubmission_${browserFingerprint}`) || '0'),
            parseInt(sessionStorage.getItem(`lastFormSubmission_${browserFingerprint}`) || '0'),
            parseInt(getCookie(`lastFormSubmission_${browserFingerprint}`) || '0')
        );
        
        const effectiveLastSubmission = Math.max(lastSubmission, fingerprintLastSubmission);
        
        const timeElapsed = now - effectiveLastSubmission;
        
        if (effectiveLastSubmission && timeElapsed < cooldownPeriod) {
            const remainingTime = Math.ceil((cooldownPeriod - timeElapsed) / 1000);
            submitBtn.disabled = true;
            btnText.textContent = `WAIT (${remainingTime}s)`;
            submitBtn.classList.add('cooling-down');
            
            if (remainingTime > 0) {
                setTimeout(updateButtonCooldown, 1000);
            } else {
                submitBtn.disabled = false;
                btnText.textContent = 'SEND MESSAGE';
                submitBtn.classList.remove('cooling-down');
            }
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'SEND MESSAGE';
            submitBtn.classList.remove('cooling-down');
        }
    }
    
    updateButtonCooldown();
    
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('has-value');
        }
        
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
        
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.parentElement.classList.add('has-value');
            } else {
                input.parentElement.classList.remove('has-value');
            }
        });
    });
    
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        captchaNum1.textContent = num1;
        captchaNum2.textContent = num2;
        captchaAnswer.value = '';
        return num1 + num2;
    }
    
    function showCaptchaModal() {
        captchaModal.style.display = 'flex';
        void captchaModal.offsetWidth;
        captchaModal.classList.add('active');
        setTimeout(() => {
            captchaAnswer.focus();
        }, 300);
    }
    
    function hideCaptchaModal() {
        captchaModal.classList.remove('active');
        setTimeout(() => {
            captchaModal.style.display = 'none';
        }, 300);
    }
    
    submitBtn.addEventListener('click', function() {
        if (submitBtn.disabled) {
            return;
        }
        
        const nameField = document.getElementById('name');
        const messageField = document.getElementById('message');
        
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        
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
        
        generateCaptcha();
        showCaptchaModal();
    });
    
    closeCaptchaBtn.addEventListener('click', function() {
        hideCaptchaModal();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && captchaModal.classList.contains('active')) {
            hideCaptchaModal();
        }
    });
    
    captchaModal.addEventListener('click', function(e) {
        if (e.target === captchaModal) {
            hideCaptchaModal();
        }
    });
    
    captchaAnswer.addEventListener('keydown', function(e) {
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
            (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    
    captchaAnswer.addEventListener('wheel', function(e) {
        e.preventDefault();
    });
    
    verifyCaptchaBtn.addEventListener('click', function() {
        const expectedAnswer = parseInt(captchaNum1.textContent) + parseInt(captchaNum2.textContent);
        const userAnswer = parseInt(captchaAnswer.value);
        
        if (userAnswer === expectedAnswer) {
            hideCaptchaModal();
            
            btnText.textContent = 'SENDING...';
            submitBtn.disabled = true;
            
            const timestamp = new Date().getTime().toString();
            storeSubmissionTime(timestamp);
            
            sessionStorage.setItem('formSubmitted', 'true');
            
            contactForm.submit();
            
            setTimeout(() => {
                Array.from(contactForm.querySelectorAll('.form-group, button')).forEach(el => {
                    el.style.display = 'none';
                });
                thankYouMessage.style.display = 'block';
            }, 1000);
        } else {
            captchaAnswer.classList.add('shake');
            setTimeout(() => {
                captchaAnswer.classList.remove('shake');
            }, 600);
            
            setTimeout(() => {
                generateCaptcha();
                captchaAnswer.focus();
            }, 600);
        }
    });
    
    captchaAnswer.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            verifyCaptchaBtn.click();
        }
    });
    
    window.toggleThankYouPreview = function() {
        contactForm.classList.toggle('preview-thank-you');
    };
    
    if (window.location.hash === '#preview-thank-you') {
        setTimeout(() => {
            toggleThankYouPreview();
        }, 500);
    }
}); 