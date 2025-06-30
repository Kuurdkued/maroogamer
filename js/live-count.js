// Live Count System for Social Media Stats
class LiveCounter {
    constructor() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        this.counters = {
            'tiktok-followers': {
                element: null,
                baseCount: 9543,
                currentCount: 9543,
                incrementRange: [1, 2],
                updateInterval: 45000
            },
            'tiktok-likes': {
                element: null,
                baseCount: 30000,
                currentCount: 30000,
                incrementRange: [3, 8],
                updateInterval: 30000
            },
            'total-views': {
                element: null,
                baseCount: 750000,
                currentCount: 750000,
                incrementRange: [5, 25],
                updateInterval: 20000
            }
        };

        this.init();
    }

    init() {
        console.log('Initializing Live Counter...');
        
        // Get elements and verify they exist
        Object.keys(this.counters).forEach(key => {
            const counter = this.counters[key];
            counter.element = document.getElementById(key);
            
            if (!counter.element) {
                console.warn(`Element with ID '${key}' not found`);
                return;
            }
            
            console.log(`Found element ${key}, setting to ${counter.currentCount}`);
            
            // Set initial display with proper formatting
            counter.element.textContent = this.formatNumber(counter.currentCount);
            
            // Ensure the element has the live-count class
            if (!counter.element.classList.contains('live-count')) {
                counter.element.classList.add('live-count');
            }
        });

        // Start the live counting for each stat
        Object.keys(this.counters).forEach(key => {
            if (this.counters[key].element) {
                this.startLiveCount(key);
            }
        });

        // Add visual indicators
        this.addLiveIndicators();
        
        // Start with an immediate update after 5 seconds
        setTimeout(() => {
            console.log('Starting immediate updates...');
            Object.keys(this.counters).forEach(key => {
                if (this.counters[key].element) {
                    this.updateCount(key);
                }
            });
        }, 5000);
    }

    startLiveCount(counterId) {
        const counter = this.counters[counterId];
        
        setInterval(() => {
            this.updateCount(counterId);
        }, counter.updateInterval);

        // Add some randomness to make it more realistic
        setTimeout(() => {
            setInterval(() => {
                if (Math.random() < 0.3) { // 30% chance of update
                    this.updateCount(counterId);
                }
            }, counter.updateInterval / 3);
        }, Math.random() * counter.updateInterval);
    }

    updateCount(counterId) {
        const counter = this.counters[counterId];
        
        if (!counter || !counter.element) {
            console.warn(`Counter ${counterId} not found or element missing`);
            return;
        }
        
        // Calculate increment
        const increment = Math.floor(
            Math.random() * (counter.incrementRange[1] - counter.incrementRange[0] + 1)
        ) + counter.incrementRange[0];

        counter.currentCount += increment;
        
        console.log(`Updating ${counterId}: +${increment} = ${counter.currentCount}`);
        
        // Add updating animation
        counter.element.classList.add('updating');
        
        // Animate the number change
        this.animateNumber(counter.element, counter.currentCount);
        
        // Remove updating class after animation
        setTimeout(() => {
            if (counter.element) {
                counter.element.classList.remove('updating');
            }
        }, 1000);
    }

    animateNumber(element, targetNumber) {
        // Get current number safely
        let currentText = element.textContent || '0';
        let currentNumber = parseInt(currentText.replace(/[^0-9]/g, '')) || 0;
        
        // Validate numbers
        if (isNaN(currentNumber)) currentNumber = 0;
        if (isNaN(targetNumber)) targetNumber = currentNumber;
        
        const difference = targetNumber - currentNumber;
        const steps = 20;
        const stepValue = difference / steps;
        let currentStep = 0;

        const animation = setInterval(() => {
            currentStep++;
            const newValue = Math.floor(currentNumber + (stepValue * currentStep));
            element.textContent = this.formatNumber(newValue);

            if (currentStep >= steps) {
                clearInterval(animation);
                element.textContent = this.formatNumber(targetNumber);
            }
        }, 50);
    }

    formatNumber(num) {
        // Ensure num is a valid number
        if (isNaN(num) || num === null || num === undefined) {
            return '0';
        }
        return Math.floor(num).toLocaleString();
    }

    addLiveIndicators() {
        // Add "LIVE" indicator to the stats section
        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) {
            const liveIndicator = document.createElement('div');
            liveIndicator.className = 'live-indicator';
            liveIndicator.innerHTML = `
                <span class="live-dot"></span>
                <span class="live-text">LIVE</span>
            `;
            statsGrid.parentNode.insertBefore(liveIndicator, statsGrid);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LiveCounter();
});

// Add some realistic variation based on time of day
function getTimeBasedMultiplier() {
    const hour = new Date().getHours();
    
    // Peak hours (evening) - more activity
    if (hour >= 18 && hour <= 23) {
        return 1.5;
    }
    // Morning hours - moderate activity
    else if (hour >= 6 && hour <= 12) {
        return 1.2;
    }
    // Night hours - less activity
    else if (hour >= 0 && hour <= 6) {
        return 0.7;
    }
    // Afternoon - normal activity
    else {
        return 1.0;
    }
}