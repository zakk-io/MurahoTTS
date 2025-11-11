/**
 * =================================================================
 * Muraho TTS Landing Page Interactive Script
 * =================================================================
 * This script handles all client-side interactivity, including:
 * - Dark mode toggling
 * - Language switching (EN/KIN)
 * - Live demo audio playback simulation
 * - Payment modal flow (opening, closing, step navigation)
 * - Form validation (email, credit card with Luhn check)
 * - API key generation, masking, and copying
 *
 * It is written in vanilla JavaScript with no external dependencies.
 */

// --- Helper Functions ---
const generateRandomString = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const isValidCardNumber = (num) => {
    if (!num || typeof num !== 'string') return false;
    const sanitized = num.replace(/\s/g, '');
    if (!/^\d+$/.test(sanitized)) return false;
    let arr = sanitized.split('').reverse().map(x => parseInt(x, 10));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
    sum += lastDigit;
    return sum % 10 === 0;
};


document.addEventListener('DOMContentLoaded', () => {

    // --- State Management ---
    const state = {
        language: 'en',
        isModalOpen: false,
        apiKey: `sk_test_${generateRandomString(24)}`,
        isApiKeyVisible: false,
        paymentAdded: false,
    };

    // --- Language Content ---
    const content = {
        en: {
            logo: "Muraho TTS",
            nav_features: "Features",
            nav_integrations: "Integrations",
            nav_pricing: "Pricing",
            nav_get_api_key: "Get API Key",
            hero_badge: "Beta • Developer Friendly",
            hero_headline: "Bring Kinyarwanda to Life",
            hero_headline_gradient: "Text-to-Speech API",
            hero_subtext: "Turn written Kinyarwanda into human-like audio for apps, wearables, and services. Easy REST API, multiple voice models, and low latency.",
            hero_cta_primary: "Get API Key",
            hero_cta_secondary: "Read Docs",
            features_title: "Who are we?",
            features_subtitle: "We are Muraho TTS, we provide simple way to integrate Kinyarwanda text-to-speech into your applications.",
            feature1_title: "Low Latency",
            feature1_desc: "Real-time streaming for interactive applications.",
            feature2_title: "Multiple Voices",
            feature2_desc: "Choose from a variety of male and female voices.",
            feature3_title: "SSML Support",
            feature3_desc: "Fine-tune pitch, pronunciation, and pauses.",
            feature4_title: "Inline Audio Preview",
            feature4_desc: "Test and preview audio directly from the API.",
            feature5_title: "SDKs Available",
            feature5_desc: "Ready-to-use wrappers for JS and Python.",
            feature6_title: "Usage-Based Pricing",
            feature6_desc: "Pay only for what you use. No hidden fees.",
            integrations_title: "Real-World Integrations",
            integrations_subtitle: "See how Muraho TTS powers innovative applications.",
            integ1_title: "AI-powered solutions",
            integ1_desc: " Integrate Kinyarwanda speech into LLMS, educational accessibility platforms and sign-language translation",
            integ2_title: "IOT Devices",
            integ2_desc: "Bring Kinyarwanda voice capabilities to IoT devices such as smart glasses, home assistants, and security cameras",
            integ3_title: "Voice Driven Applications",
            integ3_desc: "Power Kinyarwanda-speaking voice assistants, customer support bots, and real-time communication platforms. .",
            demo_title: "Try it Now",
            demo_subtitle: "Enter some Kinyarwanda text and hear it live. (Uses a placeholder audio)",
            demo_play_button: "Play",
            demo_generating: "Generating audio...",
            pricing_title: "Simple, Transparent Pricing",
            pricing_subtitle: "Start for free, then pay as you grow.",
            plan_name: "Developer",
            plan_per_month: "/ month",
            plan_or_payg: "or pay-as-you-go",
            plan_feat1: "1,000,000 characters/month",
            plan_feat2: "All standard voices",
            plan_feat3: "SSML support",
            plan_feat4: "Community support",
            plan_cta: "Start Trial & Get API Key",
            footer_accessibility: "Accessibility-first design.",
            footer_docs: "Docs",
            footer_pricing: "Pricing",
            footer_terms: "Terms",
            footer_privacy: "Privacy",
            modal_step1_title: "Add Payment Method",
            modal_step1_subtitle: "Enter your email to continue.",
            modal_email_label: "Email Address",
            modal_continue_btn: "Continue",
            modal_step2_title: "Simulated Payment",
            modal_step2_subtitle: "This is a demo. <strong>Do not use a real card.</strong>",
            modal_card_label: "Card Number",
            modal_expiry_label: "Expiry",
            modal_cvc_label: "CVC",
            modal_pay_btn: "Confirm Payment (Simulated)",
            modal_step3_title: "Processing Payment...",
            modal_step3_subtitle: "This will take a few seconds.",
            modal_step4_title: "Welcome! Your API Key is Ready.",
            modal_step4_subtitle: "You can now start building with Muraho TTS.",
            modal_api_key_label: "Your API Key",
            modal_copied_feedback: "Copied!",
            modal_endpoint_label: "API Endpoint",
            modal_example_label: "Example cURL",
        },
        kin: {
            logo: "Muraho TTS",
            nav_features: "Ibyiza",
            nav_integrations: "Uko ikora",
            nav_pricing: "Ibiciro",
            nav_get_api_key: "Fata API Key",
            hero_badge: "Beta • Ikora 99.9% (By'igeragezwa) • Yoreherejwe abakora porogaramu",
            hero_headline: "Subiza Ubuzima Ikinyarwanda",
            hero_headline_gradient: "API y'ijwi",
            hero_subtext: "Hindura inyandiko y'Ikinyarwanda mo ijwi risa n'iry'umuntu kuri porogaramu, ibikoresho, na serivisi. API yoroshye, amajwi atandukanye, n'ubwiza bwohejuru.",
            hero_cta_primary: "Fata API Key",
            hero_cta_secondary: "Soma amabwiriza",
            features_title: "Ibyiza Bikomeye, API Yoroheje",
            features_subtitle: "Ibikenewe byose ngo wubake porogaramu z'amajwi zigezweho.",
            feature1_title: "Umuvuduko mwinshi",
            feature1_desc: "Gukorera ako kanya kuri porogaramu zikenera igisubizo cyihuse.",
            feature2_title: "Amajwi atandukanye",
            feature2_desc: "Hitamo mu majwi y'abagabo n'abagore atandukanye.",
            feature3_title: "SSML Ishyigikiwe",
            feature3_desc: "Genagaciro ku ijwi, imvugo, n'ibiruhuko.",
            feature4_title: "Gerageza Ijwi ako kanya",
            feature4_desc: "Gerageza kandi wumve ijwi rivuye muri API.",
            feature5_title: "SDK Zirahari",
            feature5_desc: "Ziteguye gukoreshwa muri JS na Python.",
            feature6_title: "Ibiciro bijyanye n'ikoreshwa",
            feature6_desc: "Yishyura ibyo wakoresheje gusa. Nta yandi mafaranga yihishe.",
            integrations_title: "Ingero Zifatika",
            integrations_subtitle: "Reba uko Muraho TTS ikoreshwa mu ngero zifatika.",
            integ1_title: "Ururimi rw'amarenga → Ijwi",
            integ1_desc: "Hindura inyandiko y'amarenga mo ijwi ry'Ikinyarwanda.",
            integ2_title: "Amashusho y'ibikoresho + Amadarubindi",
            integ2_desc: "Kora amajwi ako kanya avuye ku bisohotse mu kumenya ibintu.",
            integ3_title: "Itumanaho ry'amajwi",
            integ3_desc: "Umuvuduko mwinshi wo gutanga amajwi kuri serivisi z'abafasha.",
            demo_title: "Gerageza nonaha",
            demo_subtitle: "Andika Ikinyarwanda wumve uko bivuga. (Hakoreshejwe ijwi ry'icyitegererezo)",
            demo_play_button: "Kina",
            demo_generating: "Biri gukorwa...",
            pricing_title: "Ibiciro Byoroshye, Kuri Buri Wese",
            pricing_subtitle: "Tangira ku buntu, hanyuma wishyure uko ugenda ukura.",
            plan_name: "Umukoreshi",
            plan_per_month: "/ ukwezi",
            plan_or_payg: "cyangwa wishyure uko ukoresheje",
            plan_feat1: "Inyuguti 1,000,000/ukwezi",
            plan_feat2: "Amajwi asanzwe yose",
            plan_feat3: "SSML ishyigikiwe",
            plan_feat4: "Ubufasha rusange",
            plan_cta: "Tangira Igeragezwa & Fata API Key",
            footer_accessibility: "Igishushanyo mbonera cyita ku bose.",
            footer_docs: "Amabwiriza",
            footer_pricing: "Ibiciro",
            footer_terms: "Amategeko",
            footer_privacy: "Ibihanga amakuru",
            modal_step1_title: "Ongeramo uburyo bwo kwishyura",
            modal_step1_subtitle: "Andika imeri yawe kugirango ukomeze.",
            modal_email_label: "Imeri yawe",
            modal_continue_btn: "Komeza",
            modal_step2_title: "Kwemeza Kwishyura (Si byo)",
            modal_step2_subtitle: "Iki ni icyitegererezo. <strong>Ntukoreshe ikarita yawe nyayo.</strong>",
            modal_card_label: "Nimero y'ikarita",
            modal_expiry_label: "Igihe irangirira",
            modal_cvc_label: "CVC",
            modal_pay_btn: "Emeza kwishyura (Si byo)",
            modal_step3_title: "Biri kwemezwa...",
            modal_step3_subtitle: "Bifata amasegonda make.",
            modal_step4_title: "Murakaza neza! API Key yawe irabonetse.",
            modal_step4_subtitle: "Ushobora gutangira kubaka na Muraho TTS.",
            modal_api_key_label: "API Key Yawe",
            modal_copied_feedback: "Byakopiswe!",
            modal_endpoint_label: "API Endpoint",
            modal_example_label: "Urugero rwa cURL",
        }
    };

    // --- DOM Element Selectors ---
    const $ = (selector) => document.querySelector(selector);

    // --- Dark Mode ---
    const darkModeToggle = $('#dark-mode-toggle');
    const html = document.documentElement;

    darkModeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });

    // --- Language Toggle ---
    const languageToggle = $('#language-toggle');
    const languageMenu = $('#language-menu');
    const currentLangLabel = $('#current-lang-label');

    languageToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        languageMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        languageMenu.classList.add('hidden');
    });

    languageMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const lang = e.target.getAttribute('data-lang');
            updateLanguage(lang);
            currentLangLabel.textContent = lang.toUpperCase();
        }
    });

    function updateLanguage(lang) {
        state.language = lang;
        const langContent = content[lang];
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (langContent[key]) {
                // Use innerHTML to support the strong tag in the modal subtitle
                el.innerHTML = langContent[key];
            }
        });
    }

    // --- Live Demo ---
    const demoPlayButton = $('#demo-play-button');
    const demoLoader = $('#demo-loader');
    const demoAudio = $('#demo-audio');
    const demoTextInput = $('#demo-text-input');

    demoPlayButton.addEventListener('click', () => {
        if (!demoTextInput.value.trim()) {
            demoTextInput.focus();
            return;
        }
        demoLoader.classList.remove('hidden');
        demoPlayButton.disabled = true;
        demoPlayButton.classList.add('cursor-not-allowed');

        fetch('http://localhost:8000/kinyarwanda-tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: demoTextInput.value }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const audioUrl = URL.createObjectURL(blob);
            demoAudio.src = audioUrl;
            demoAudio.play();
        })
        .catch(error => {
            console.error('Error fetching TTS audio:', error);
        })
        .finally(() => {
            demoLoader.classList.add('hidden');
            demoPlayButton.disabled = false;
            demoPlayButton.classList.remove('cursor-not-allowed');
        });
    });

    // --- Payment Modal ---
    const paymentModal = $('#payment-modal');
    const modalContent = $('#modal-content');
    const startTrialButton = $('#start-trial-button');
    const modalCloseButton = $('#modal-close-button');
    const addPaymentButton = $('#add-payment-button');

    const modalSteps = {
        1: $('#modal-step-1'),
        2: $('#modal-step-2'),
        3: $('#modal-step-3'),
        4: $('#modal-step-4'),
    };

    function showModalStep(step) {
        Object.values(modalSteps).forEach(s => s.classList.add('hidden'));
        if (modalSteps[step]) {
            modalSteps[step].classList.remove('hidden');
        }
    }

    function openModal() {
        paymentModal.classList.remove('hidden');
        paymentModal.classList.add('flex');
        setTimeout(() => {
            modalContent.classList.remove('opacity-0', 'scale-95');
        }, 10);
        document.body.style.overflow = 'hidden';
        state.isModalOpen = true;
        
        // Reset to first step unless payment is already added
        if (state.paymentAdded) {
            showModalStep(4);
            $('#payment-cta-container').classList.add('hidden');
        } else {
            showModalStep(1);
            // Ensure form is reset
            $('#email-form').reset();
            $('#card-form').reset();
            $('#email-error').classList.add('hidden');
            $('#card-error').classList.add('hidden');
        }
    }

    function closeModal() {
        modalContent.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            paymentModal.classList.add('hidden');
            paymentModal.classList.remove('flex');
            document.body.style.overflow = '';
        }, 300);
        state.isModalOpen = false;
    }

    startTrialButton.addEventListener('click', openModal);
    modalCloseButton.addEventListener('click', closeModal);
    addPaymentButton.addEventListener('click', () => {
        state.paymentAdded = false;
        $('#payment-cta-container').classList.remove('hidden');
        showModalStep(1);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isModalOpen) {
            closeModal();
        }
    });

    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            closeModal();
        }
    });

    // --- Modal Form Logic ---
    const emailForm = $('#email-form');
    const emailInput = $('#email');
    const emailError = $('#email-error');

    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (emailInput.checkValidity()) {
            emailError.classList.add('hidden');
            showModalStep(2);
        } else {
            emailError.classList.remove('hidden');
        }
    });

    const cardForm = $('#card-form');
    const cardNumberInput = $('#card-number');
    const cardExpiryInput = $('#card-expiry');
    const cardCvcInput = $('#card-cvc');
    const cardError = $('#card-error');

    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isCardValid = isValidCardNumber(cardNumberInput.value);
        const isExpiryValid = /^\d{2}\s?\/\s?\d{2}$/.test(cardExpiryInput.value);
        const isCvcValid = /^\d{3,4}$/.test(cardCvcInput.value);

        if (isCardValid && isExpiryValid && isCvcValid) {
            cardError.classList.add('hidden');
            showModalStep(3); // Processing
            setTimeout(() => {
                state.paymentAdded = true;
                showModalStep(4);
                $('#payment-cta-container').classList.add('hidden');
            }, 2500);
        } else {
            cardError.textContent = 'Please check your card details.';
            if (!isCardValid) cardError.textContent = 'Invalid card number.';
            else if (!isExpiryValid) cardError.textContent = 'Invalid expiry date (MM / YY).';
            else if (!isCvcValid) cardError.textContent = 'Invalid CVC.';
            cardError.classList.remove('hidden');
        }
    });

    // --- API Key Reveal & Copy ---
    const apiKeyInput = $('#api-key-input');
    const toggleApiKeyButton = $('#toggle-api-key');
    const copyApiKeyButton = $('#copy-api-key');
    const copyFeedback = $('#copy-feedback');

    // Set initial masked value
    apiKeyInput.value = state.apiKey.replace(/.(?=.{4})/g, '*');

    toggleApiKeyButton.addEventListener('click', () => {
        state.isApiKeyVisible = !state.isApiKeyVisible;
        if (state.isApiKeyVisible) {
            apiKeyInput.type = 'text';
            apiKeyInput.value = state.apiKey;
            toggleApiKeyButton.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else {
            apiKeyInput.type = 'password';
            apiKeyInput.value = state.apiKey.replace(/.(?=.{4})/g, '*');
            toggleApiKeyButton.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
    });

    copyApiKeyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(state.apiKey).then(() => {
            copyFeedback.classList.remove('hidden');
            setTimeout(() => {
                copyFeedback.classList.add('hidden');
            }, 2000);
        });
    });

    // Initialize language
    updateLanguage(state.language);
});
