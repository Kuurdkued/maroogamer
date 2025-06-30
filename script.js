// DOM Elements
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

// Music Control
let isMusicPlaying = false;

// Initialize music control
function initMusic() {
    if (backgroundMusic && musicToggle) {
        backgroundMusic.volume = 0.3; // Set volume to 30%
        backgroundMusic.loop = true;
        backgroundMusic.preload = 'auto';
        
        musicToggle.addEventListener('click', toggleMusic);
        
        // Set initial state as muted/stopped
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        musicToggle.classList.add('muted');
        
        // Show music control immediately
        musicToggle.style.opacity = '1';
        
        // Add loading event listeners
        backgroundMusic.addEventListener('loadstart', () => {
            console.log('Music loading started');
        });
        
        backgroundMusic.addEventListener('canplay', () => {
            console.log('Music can play');
            showMusicStatus('🎵 Music Ready - Click to Play');
        });
        
        backgroundMusic.addEventListener('error', (e) => {
            console.error('Music loading error:', e);
            showMusicStatus('❌ Music file error');
            musicToggle.style.display = 'none';
        });
        
        // Prevent automatic music resumption on focus/visibility change
        window.addEventListener('focus', preventAutoResume);
        document.addEventListener('visibilitychange', preventAutoResume);
        
        // Show a subtle prompt that music is available
        setTimeout(() => {
            showMusicAvailablePrompt();
        }, 3000);
        
    } else {
        console.warn('Music elements not found');
        if (musicToggle) {
            musicToggle.style.display = 'none';
        }
    }
}

// Prevent automatic music resumption
function preventAutoResume() {
    if (!isMusicPlaying && !backgroundMusic.paused) {
        console.log('Pausing unwanted music autoplay on focus/visibility change');
        backgroundMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        musicToggle.classList.add('muted');
        musicToggle.style.animation = 'none';
    }
}

// Show music available prompt
function showMusicAvailablePrompt() {
    // Create a subtle notification
    const prompt = document.createElement('div');
    prompt.className = 'music-available-prompt';
    prompt.innerHTML = `
        <div class="prompt-content">
            <i class="fas fa-music"></i>
            <span>Background music available - click the music button to play</span>
            <button class="prompt-close">&times;</button>
        </div>
    `;
    
    // Style the prompt
    prompt.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
        color: white;
        padding: 12px 20px;
        border-radius: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 20, 147, 0.3);
        z-index: 10000;
        font-size: 13px;
        font-weight: 500;
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
        transition: all 0.3s ease;
        pointer-events: auto;
        cursor: pointer;
    `;
    
    document.body.appendChild(prompt);
    
    // Animate in
    setTimeout(() => {
        prompt.style.opacity = '1';
        prompt.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Remove on click or after delay
    const removePrompt = () => {
        prompt.style.opacity = '0';
        prompt.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            if (prompt.parentNode) {
                prompt.remove();
            }
        }, 300);
    };
    
    prompt.addEventListener('click', removePrompt);
    prompt.querySelector('.prompt-close').addEventListener('click', (e) => {
        e.stopPropagation();
        removePrompt();
    });
    
    // Auto-remove after 4 seconds
    setTimeout(removePrompt, 4000);
}



// Show mute tooltip
function showMuteTooltip() {
    // Don't show if music is already muted
    if (!isMusicPlaying) return;
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'mute-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <div class="tooltip-arrow"></div>
            <span>You can mute the music</span>
        </div>
    `;
    
    // Style the tooltip
    tooltip.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        z-index: 10001;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        pointer-events: none;
    `;
    
    // Style the tooltip content
    const tooltipContent = tooltip.querySelector('.tooltip-content');
    tooltipContent.style.cssText = `
        background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
        color: white;
        padding: 12px 16px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
        border: 1px solid rgba(255, 20, 147, 0.3);
        position: relative;
    `;
    
    // Style the arrow
    const arrow = tooltip.querySelector('.tooltip-arrow');
    arrow.style.cssText = `
        position: absolute;
        top: -6px;
        right: 15px;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #2a2a2a;
    `;
    
    document.body.appendChild(tooltip);
    
    // Animate in
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }, 100);
    
    // Add pulse effect to music button
    musicToggle.style.animation = 'tooltipPulse 0.6s ease-in-out 2';
    
    // Remove tooltip after 3 seconds
    setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-10px)';
        musicToggle.style.animation = 'pulse 2s infinite'; // Return to normal pulse
        
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        }, 300);
    }, 3000);
}

function toggleMusic() {
    if (isMusicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    // Show loading state
    musicToggle.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Reset audio to beginning if it ended
    if (backgroundMusic.ended) {
        backgroundMusic.currentTime = 0;
    }
    
    // Ensure audio is loaded
    backgroundMusic.load();
    
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            backgroundMusic.muted = false;
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicToggle.classList.remove('muted');
            console.log('Music is now playing');
            
            // Add animation to indicate music is playing
            musicToggle.style.animation = 'pulse 2s infinite';
            
            // Show success message
            showMusicStatus('🎵 Music Playing');
            
        }).catch(error => {
            console.log('Music play failed:', error);
            isMusicPlaying = false;
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicToggle.classList.add('muted');
            musicToggle.style.animation = 'none';
            
            // Show error message
            showMusicStatus('❌ Music file not found or blocked');
        });
    }
}

function pauseMusic() {
    backgroundMusic.pause();
    isMusicPlaying = false;
    musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    musicToggle.classList.add('muted');
    musicToggle.style.animation = 'none';
    showMusicStatus('🔇 Music Paused');
}

function showMusicStatus(message) {
    // Remove existing status
    const existingStatus = document.querySelector('.music-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // Create status message
    const status = document.createElement('div');
    status.className = 'music-status';
    status.textContent = message;
    status.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: var(--primary-pink);
        padding: 10px 15px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(status);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (status.parentNode) {
            status.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => status.remove(), 300);
        }
    }, 3000);
}

// Mobile Navigation
function initMobileNav() {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animated Counter for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    document.querySelectorAll('.about-text').forEach(el => {
        el.classList.add('slide-in-left');
        observer.observe(el);
    });
    
    document.querySelectorAll('.about-visual').forEach(el => {
        el.classList.add('slide-in-right');
        observer.observe(el);
    });
    
    document.querySelectorAll('.social-card').forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(el);
    });
}

// Parallax Effect
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-background');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Mouse Movement Effects
function initMouseEffects() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth) - 0.5;
        const yPos = (clientY / innerHeight) - 0.5;
        
        // Apply subtle movement to hero content
        heroContent.style.transform = `translate(${xPos * 20}px, ${yPos * 20}px)`;
        
        // Update particle positions
        const particles = document.querySelector('.particles');
        particles.style.transform = `translate(${xPos * 30}px, ${yPos * 30}px)`;
    });
}

// 3D Card Tilt Effect
function init3DCardEffects() {
    const cards = document.querySelectorAll('.social-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Loading Screen
function initLoadingScreen() {
    window.addEventListener('load', () => {
        const loading = document.querySelector('.loading');
        if (loading) {
            setTimeout(() => {
                loading.classList.add('hidden');
                setTimeout(() => {
                    loading.remove();
                }, 500);
            }, 1000);
        }
    });
}

// Cursor Trail Effect
function initCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    // Create trail elements
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #ff1493, #ffffff);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - (i / trailLength)};
            transform: scale(${1 - (i / trailLength)});
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateTrail() {
        let x = mouseX, y = mouseY;
        
        trail.forEach((dot, index) => {
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            
            if (index < trail.length - 1) {
                const nextDot = trail[index + 1];
                const nextX = parseFloat(nextDot.style.left);
                const nextY = parseFloat(nextDot.style.top);
                
                x += (nextX - x) * 0.3;
                y += (nextY - y) * 0.3;
            }
        });
        
        requestAnimationFrame(updateTrail);
    }
    
    updateTrail();
}

// Keyboard Navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                scrollToNextSection();
                break;
            case 'ArrowUp':
                e.preventDefault();
                scrollToPrevSection();
                break;
            case ' ':
                if (e.target === document.body) {
                    e.preventDefault();
                    toggleMusic();
                }
                break;
        }
    });
}

function scrollToNextSection() {
    const sections = ['#home', '#about', '#social'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    const nextIndex = (currentIndex + 1) % sections.length;
    
    document.querySelector(sections[nextIndex]).scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToPrevSection() {
    const sections = ['#home', '#about', '#social'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
    
    document.querySelector(sections[prevIndex]).scrollIntoView({
        behavior: 'smooth'
    });
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    let currentSection = '#home';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = '#' + section.id;
        }
    });
    
    return currentSection;
}

// Performance Optimization
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Update scroll-dependent animations here
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
}

// Error Handling
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
    });
    
    // Handle music loading errors
    backgroundMusic.addEventListener('error', () => {
        console.warn('Background music failed to load');
        musicToggle.style.display = 'none';
    });
}

// Social Media Integration
function initSocialIntegration() {
    // Track social link clicks
    document.querySelectorAll('.social-card, .footer-social-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = link.href.includes('youtube') ? 'YouTube' :
                           link.href.includes('discord') ? 'Discord' :
                           link.href.includes('tiktok') ? 'TikTok' : 'Unknown';
            
            console.log(`Social link clicked: ${platform}`);
            
            // Add click animation
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = '';
            }, 150);
        });
    });
}

// Language System
const translations = {
    en: {
        'page.title': 'MAROO GAMER - Gaming Portfolio',
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.connect': 'Connect',
        'hero.welcome': 'WELCOME TO',
        'hero.subtitle': 'Gaming Content Creator & Streamer',
        'hero.joinCommunity': 'Join the Community',
        'hero.learnMore': 'Learn More',
        'hero.scrollDown': 'Scroll Down',
        'about.title': 'About MAROO GAMER',
        'about.description': 'Welcome to my gaming universe! I\'m MAROO GAMER, a passionate content creator dedicated to bringing you the best gaming experiences, tutorials, and entertainment. Join me on this incredible journey through the world of gaming!',
        'about.subscribers': 'Subscribers',
        'about.videos': 'Videos',
        'about.views': 'Views',
        'social.title': 'Connect With Me',
        'social.subtitle': 'Join the MAROO GAMER community across all platforms!',
        'social.youtube.description': 'Subscribe for gaming content, tutorials, and live streams!',
        'social.youtube.button': 'Subscribe Now',
        'social.discord.description': 'Join our gaming community and chat with fellow gamers!',
        'social.discord.button': 'Join Server',
        'social.tiktok.description': 'Follow for quick gaming tips and funny moments!',
        'social.tiktok.button': 'Follow Me',
        'footer.copyright': '© 2024 MAROO GAMER. All rights reserved.',
        'footer.description': 'Gaming content creator & streamer'
    },
    ku: {
        'page.title': 'MAROO GAMER - پۆرتفۆلیۆی یاری',
        'nav.home': 'ماڵەوە',
        'nav.about': 'دەربارە',
        'nav.connect': 'پەیوەندی',
        'hero.welcome': 'بەخێربێن بۆ',
        'hero.subtitle': 'دروستکەری ناوەڕۆکی یاری و ستریمەر',
        'hero.joinCommunity': 'بەشداری کۆمەڵگا بکە',
        'hero.learnMore': 'زیاتر بزانە',
        'hero.scrollDown': 'خوارەوە بچۆ',
        'about.title': 'دەربارەی MAROO GAMER',
        'about.description': 'بەخێربێن بۆ گەردوونی یاریەکانم! من MAROO GAMER ـم، دروستکەرێکی ناوەڕۆکی دڵگەرمم کە خۆم تەرخان کردووە بۆ پێشکەشکردنی باشترین ئەزموونی یاری، فێرکاری و کاتبەسەرانی بۆ ئێوە. لەگەڵم بن لەم گەشتە نایابەدا بەناو جیهانی یاریەکاندا!',
        'about.subscribers': 'بەشداربوو',
        'about.videos': 'ڤیدیۆ',
        'about.views': 'بینین',
        'social.title': 'پەیوەندیم لەگەڵ بکە',
        'social.subtitle': 'بەشداری کۆمەڵگای MAROO GAMER بکە لە هەموو پلاتفۆرمەکاندا!',
        'social.youtube.description': 'بەشداری بکە بۆ ناوەڕۆکی یاری، فێرکاری و پەخشی زیندوو!',
        'social.youtube.button': 'ئێستا بەشداری بکە',
        'social.discord.description': 'بەشداری کۆمەڵگای یاریەکانمان بکە و لەگەڵ یاریزانەکانی تر قسە بکە!',
        'social.discord.button': 'بەشداری سێرڤەر بکە',
        'social.tiktok.description': 'شوێنم بکەوە بۆ ئامۆژگاری خێرای یاری و ساتە پێکەنینەکان!',
        'social.tiktok.button': 'شوێنم بکەوە',
        'footer.copyright': '© ٢٠٢٤ MAROO GAMER. هەموو مافەکان پارێزراون.',
        'footer.description': 'دروستکەری ناوەڕۆکی یاری و ستریمەر'
    },
    ar: {
        'page.title': 'MAROO GAMER - محفظة الألعاب',
        'nav.home': 'الرئيسية',
        'nav.about': 'حول',
        'nav.connect': 'تواصل',
        'hero.welcome': 'مرحباً بك في',
        'hero.subtitle': 'منشئ محتوى الألعاب والبث المباشر',
        'hero.joinCommunity': 'انضم للمجتمع',
        'hero.learnMore': 'اعرف المزيد',
        'hero.scrollDown': 'مرر لأسفل',
        'about.title': 'حول MAROO GAMER',
        'about.description': 'مرحباً بك في عالم الألعاب الخاص بي! أنا MAROO GAMER، منشئ محتوى شغوف مكرس لتقديم أفضل تجارب الألعاب والدروس والترفيه لك. انضم إلي في هذه الرحلة المذهلة عبر عالم الألعاب!',
        'about.subscribers': 'مشترك',
        'about.videos': 'فيديو',
        'about.views': 'مشاهدة',
        'social.title': 'تواصل معي',
        'social.subtitle': 'انضم لمجتمع MAROO GAMER عبر جميع المنصات!',
        'social.youtube.description': 'اشترك للحصول على محتوى الألعاب والدروس والبث المباشر!',
        'social.youtube.button': 'اشترك الآن',
        'social.discord.description': 'انضم لمجتمع الألعاب الخاص بنا وتحدث مع اللاعبين الآخرين!',
        'social.discord.button': 'انضم للخادم',
        'social.tiktok.description': 'تابعني للحصول على نصائح سريعة للألعاب واللحظات المضحكة!',
        'social.tiktok.button': 'تابعني',
        'footer.copyright': '© ٢٠٢٤ MAROO GAMER. جميع الحقوق محفوظة.',
        'footer.description': 'منشئ محتوى الألعاب والبث المباشر'
    }
};

let currentLanguage = 'en';

// Language System Functions
function initLanguageSystem() {
    const languageSelector = document.getElementById('languageSelector');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangSpan = document.getElementById('currentLang');
    
    // Auto-detect browser language or load saved language
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'ku', 'ar'];
    const defaultLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
    const savedLang = localStorage.getItem('selectedLanguage') || defaultLang;
    
    changeLanguage(savedLang);
    
    // Add click listeners to language options
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = option.getAttribute('data-lang');
            changeLanguage(selectedLang);
            
            // Update active state
            langOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });
    
    // Add keyboard shortcut (Ctrl/Cmd + L) to cycle through languages
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            const languages = ['en', 'ku', 'ar'];
            const currentIndex = languages.indexOf(currentLanguage);
            const nextIndex = (currentIndex + 1) % languages.length;
            changeLanguage(languages[nextIndex]);
        }
    });
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    
    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', lang);
    
    // Update current language display
    const currentLangSpan = document.getElementById('currentLang');
    const langNames = { 
        en: 'EN', 
        ku: 'کو', 
        ar: 'عر' 
    };
    if (currentLangSpan) {
        currentLangSpan.textContent = langNames[lang];
    }
    
    // Update document direction for RTL languages
    if (lang === 'ar' || lang === 'ku') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', lang);
        document.body.classList.add('rtl');
        document.body.setAttribute('lang', lang);
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', lang);
        document.body.classList.remove('rtl');
        document.body.setAttribute('lang', lang);
    }
    
    // Update all translatable elements
    const translatableElements = document.querySelectorAll('[data-translate]');
    translatableElements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            // Handle special case for page title
            if (element.tagName === 'TITLE') {
                document.title = translations[lang][key];
            }
            // Handle special case for glitch effect
            else if (element.classList.contains('glitch')) {
                element.setAttribute('data-text', translations[lang][key]);
                element.textContent = translations[lang][key];
            }
            // Handle regular elements
            else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Update active language option
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
    
    // Add smooth transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
    
    // Show language change notification
    showLanguageNotification(lang);
    
    console.log(`Language changed to: ${lang}`);
}

// Language change notification
function showLanguageNotification(lang) {
    const langNames = { 
        en: 'English', 
        ku: 'کوردی (Kurdish)', 
        ar: 'العربية (Arabic)' 
    };
    
    // Remove existing notification
    const existingNotification = document.querySelector('.lang-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'lang-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-globe"></i>
            <span>Language changed to ${langNames[lang]}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #ff1493, #ff69b4);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        box-shadow: 0 4px 20px rgba(255, 20, 147, 0.3);
        z-index: 10000;
        font-size: 14px;
        font-weight: 600;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Initialize all features
function init() {
    // Core functionality
    initMusic();
    initMobileNav();
    initNavbarScroll();
    initSmoothScrolling();
    initLanguageSystem();
    
    // Animations and effects
    animateCounters();
    initScrollAnimations();
    initParallax();
    initMouseEffects();
    init3DCardEffects();
    initCursorTrail();
    
    // Additional features
    initKeyboardNavigation();
    initPerformanceOptimizations();
    initErrorHandling();
    initSocialIntegration();
    initLoadingScreen();
    initIconFallbacks();
    
    console.log('MAROO GAMER website initialized successfully! 🎮');
}

// Icon fallback system
function initIconFallbacks() {
    // Wait for fonts to load
    setTimeout(() => {
        checkAndFixIcons();
    }, 2000);
}

function checkAndFixIcons() {
    // Test if Font Awesome is working
    const testElement = document.createElement('i');
    testElement.className = 'fas fa-home';
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement, '::before');
    const content = computedStyle.getPropertyValue('content');
    
    document.body.removeChild(testElement);
    
    // If Font Awesome isn't working, use emoji fallbacks
    if (!content || content === 'none' || content === '""') {
        console.warn('Font Awesome not loading, using emoji fallbacks');
        useEmojiIcons();
    } else {
        console.log('Font Awesome loaded successfully');
    }
}

function useEmojiIcons() {
    const iconMappings = {
        'fa-volume-up': '🔊',
        'fa-volume-mute': '🔇',
        'fa-spinner': '⏳',
        'fa-globe': '🌐',
        'fa-youtube': '📺',
        'fa-discord': '💬',
        'fa-tiktok': '🎵',
        'fa-desktop': '🖥️',
        'fa-play': '▶️',
        'fa-arrow-down': '⬇️',
        'fa-bars': '☰',
        'fa-times': '✕'
    };
    
    // Replace all Font Awesome icons with emojis
    Object.keys(iconMappings).forEach(iconClass => {
        const elements = document.querySelectorAll(`.${iconClass}`);
        elements.forEach(element => {
            element.innerHTML = iconMappings[iconClass];
            element.style.fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
            element.classList.add('emoji-icon');
        });
    });
    
    // Special handling for music toggle
    const musicToggle = document.getElementById('musicToggle');
    if (musicToggle) {
        const updateMusicIcon = () => {
            if (isMusicPlaying) {
                musicToggle.innerHTML = '🔊';
            } else {
                musicToggle.innerHTML = '🔇';
            }
        };
        updateMusicIcon();
    }
    
    console.log('Switched to emoji icons as fallback');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add loading screen HTML if it doesn't exist
if (!document.querySelector('.loading')) {
    const loadingHTML = `
        <div class="loading">
            <div class="loader"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);
}

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}