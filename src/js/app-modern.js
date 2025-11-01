/**
 * BLOODBRIDGE - ULTRA MODERN WEB APP
 * Main Application Entry Point
 * ES6+ with Modules, State Management, Real-time Features
 */

import { StateManager } from './state-manager.js';
import { NotificationService } from './services/notifications.js';
import { DonorService } from './services/donors.js';
import { MapService } from './services/map.js';
import { ChatService } from './services/chat.js';
import { VideoService } from './services/video.js';
import { AnalyticsService } from './services/analytics.js';
import { Utils } from './utils.js';

// Advanced Features - NEW
import { AIPredictionService } from './services/ai-prediction.js';
import { HealthService } from './services/health.js';
import { GamificationService } from './services/gamification.js';
import { 
    WhatsAppService, 
    AccessibilityService, 
    LanguageService,
    AdvancedAnalytics,
    NewsFeedService,
    LearningPortalService 
} from './services/advanced-features.js';

class BloodBridgeApp {
    constructor() {
        this.state = new StateManager();
        this.notifications = new NotificationService();
        this.donorService = new DonorService();
        this.mapService = new MapService();
        this.chatService = new ChatService();
        this.videoService = new VideoService();
        this.analytics = new AnalyticsService();
        
        // Advanced Services - NEW
        this.aiPredictor = new AIPredictionService();
        this.healthService = new HealthService();
        this.gamification = new GamificationService();
        this.whatsapp = new WhatsAppService();
        this.accessibility = new AccessibilityService();
        this.language = new LanguageService();
        this.advancedAnalytics = new AdvancedAnalytics();
        this.newsFeed = new NewsFeedService();
        this.learningPortal = new LearningPortalService();
        
        this.init();
    }

    async init() {
        console.log('🚀 BloodBridge Ultra Modern App Initializing...');
        
        // Show loading
        this.showLoading();
        
        try {
            // Initialize all services
            await this.initializeServices();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize UI components
            this.initializeUI();
            
            // Load initial data
            await this.loadInitialData();
            
            // Start real-time updates
            this.startRealtimeUpdates();
            
            // Hide loading
            this.hideLoading();
            
            // Show welcome notification
            this.notifications.show('Welcome to BloodBridge! 🩸', 'success');
            
            console.log('✅ BloodBridge App Ready!');
        } catch (error) {
            console.error('❌ App initialization error:', error);
            this.notifications.show('Failed to initialize app', 'error');
            this.hideLoading();
        }
    }

    async initializeServices() {
        // Initialize chat service
        await this.chatService.init();
        
        // Initialize map service if on live-map section
        if (document.getElementById('live-map')) {
            await this.mapService.init('map');
        }
        
        // Initialize analytics
        this.analytics.init();
        
        // Initialize advanced services - NEW
        await this.aiPredictor.init();
        await this.healthService.init();
        await this.gamification.init();
        
        // Initialize accessibility features
        this.accessibility.init();
        this.accessibility.enableScreenReader();
        this.accessibility.enableVoiceCommands();
        
        // Load language preference
        const savedLang = localStorage.getItem('language') || 'en';
        this.language.setLanguage(savedLang);
        
        // Load user gamification profile
        const userId = this.state.get('userId') || 'user_1';
        await this.gamification.loadUserProfile(userId);
        
        console.log('✅ All advanced services initialized');
    }

    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Header actions
        this.setupHeaderActions();
        
        // FAB menu
        this.setupFAB();
        
        // Modals
        this.setupModals();
        
        // Forms
        this.setupForms();
        
        // Chatbot
        this.setupChatbot();
        
        // Theme toggle
        this.setupThemeToggle();
        
        // Search and filters
        this.setupSearchAndFilters();
        
        // View toggles
        this.setupViewToggles();
    }

    setupNavigation() {
        const navPills = document.querySelectorAll('.nav-pill');
        const sections = document.querySelectorAll('.section');
        
        navPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                const sectionId = pill.dataset.section;
                
                // Update active pill
                navPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                
                // Update active section
                sections.forEach(s => s.classList.remove('active'));
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    
                    // Track analytics
                    this.analytics.trackEvent('navigation', 'section_change', sectionId);
                    
                    // Load section-specific data
                    this.loadSectionData(sectionId);
                }
            });
        });
        
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                document.querySelector('.nav-pills').classList.toggle('mobile-active');
            });
        }
    }

    setupHeaderActions() {
        // Emergency button
        const emergencyBtn = document.getElementById('emergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => {
                this.openModal('emergencyModal');
                this.analytics.trackEvent('emergency', 'button_click');
            });
        }
        
        // Notification dropdown
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationDropdown = document.getElementById('notificationDropdown');
        
        if (notificationBtn && notificationDropdown) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationDropdown.classList.toggle('hidden');
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!notificationDropdown.contains(e.target)) {
                    notificationDropdown.classList.add('hidden');
                }
            });
        }
        
        // User profile dropdown
        const userProfileBtn = document.getElementById('userProfileBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userProfileBtn && userDropdown) {
            userProfileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
            });
            
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target)) {
                    userDropdown.classList.add('hidden');
                }
            });
        }
        
        // Language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
        
        // Accessibility toggle - NEW
        const accessibilityToggle = document.getElementById('accessibilityToggle');
        if (accessibilityToggle) {
            accessibilityToggle.addEventListener('click', () => {
                this.openModal('accessibilityModal');
            });
        }
        
        // Accessibility settings - NEW
        this.setupAccessibilitySettings();
    }

    setupFAB() {
        const fabMain = document.getElementById('fabMain');
        const fabMenu = document.querySelector('.fab-menu');
        
        if (fabMain && fabMenu) {
            fabMain.addEventListener('click', () => {
                fabMenu.classList.toggle('hidden');
            });
            
            // FAB menu items
            document.querySelectorAll('.fab-item').forEach(item => {
                item.addEventListener('click', () => {
                    const action = item.dataset.action;
                    this.handleFABAction(action);
                    fabMenu.classList.add('hidden');
                });
            });
        }
    }

    handleFABAction(action) {
        switch (action) {
            case 'emergency':
                this.openModal('emergencyModal');
                break;
            case 'donate':
                this.openModal('donor-registration');
                break;
            case 'video-call':
                this.startVideoCall();
                break;
            case 'health-records':
                this.openHealthRecords();
                break;
            case 'ai-screening':
                this.openAIScreening();
                break;
            case 'rewards':
                this.openRewardsCenter();
                break;
        }
    }

    setupModals() {
        const modalOverlay = document.getElementById('modalOverlay');
        
        // Open modal buttons
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.modal;
                this.openModal(modalId);
            });
        });
        
        // Close modal buttons
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.close;
                this.closeModal(modalId);
            });
        });
        
        // Close on overlay click
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeAllModals();
            });
        }
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modalOverlay');
        
        if (modal) {
            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modalOverlay');
        
        if (modal) {
            modal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal-modern').forEach(modal => {
            modal.classList.remove('active');
        });
        document.getElementById('modalOverlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupForms() {
        // Emergency form
        const emergencyForm = document.getElementById('emergencyForm');
        if (emergencyForm) {
            emergencyForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleEmergencyRequest(new FormData(emergencyForm));
            });
        }
        
        // Donor registration form with steps
        this.setupDonorRegistrationForm();
    }

    setupDonorRegistrationForm() {
        const form = document.getElementById('donorRegistrationForm');
        if (!form) return;
        
        let currentStep = 1;
        const totalSteps = 3;
        
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        const submitBtn = document.getElementById('submitDonor');
        
        nextBtn?.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                this.updateFormStep(currentStep, totalSteps);
            }
        });
        
        prevBtn?.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                this.updateFormStep(currentStep, totalSteps);
            }
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleDonorRegistration(new FormData(form));
        });
    }

    updateFormStep(step, total) {
        // Update step indicators
        document.querySelectorAll('.step').forEach((el, index) => {
            if (index + 1 === step) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        
        // Update step content
        document.querySelectorAll('.form-step-content').forEach((el, index) => {
            if (index + 1 === step) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        
        // Update buttons
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const submitBtn = document.getElementById('submitDonor');
        
        prevBtn.disabled = step === 1;
        
        if (step === total) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }
    }

    async handleEmergencyRequest(formData) {
        this.showLoading('Submitting emergency request...');
        
        try {
            // Simulate API call
            await Utils.delay(2000);
            
            // Show success with SweetAlert2
            await Swal.fire({
                icon: 'success',
                title: 'Emergency Request Submitted!',
                text: 'Nearby donors and blood banks have been alerted.',
                confirmButtonColor: '#1FB8CD',
                timer: 3000
            });
            
            this.closeModal('emergencyModal');
            
            // Add to urgent requests list
            this.addUrgentRequest(formData);
            
            // Track analytics
            this.analytics.trackEvent('emergency', 'request_submitted');
            
        } catch (error) {
            console.error('Emergency request error:', error);
            this.notifications.show('Failed to submit emergency request', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async handleDonorRegistration(formData) {
        this.showLoading('Registering donor...');
        
        try {
            // Simulate API call
            await Utils.delay(2000);
            
            const donor = await this.donorService.registerDonor(formData);
            
            await Swal.fire({
                icon: 'success',
                title: 'Welcome Blood Hero!',
                text: 'Your registration is complete. Thank you for saving lives!',
                confirmButtonColor: '#1FB8CD'
            });
            
            this.closeModal('donor-registration');
            
            // Track analytics
            this.analytics.trackEvent('donor', 'registration_complete');
            
        } catch (error) {
            console.error('Donor registration error:', error);
            this.notifications.show('Registration failed. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    setupChatbot() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbot = document.getElementById('chatbot');
        const minimizeBtn = document.getElementById('minimizeChatbot');
        const closeBtn = document.getElementById('closeChatbot');
        const sendBtn = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');
        
        chatbotToggle?.addEventListener('click', () => {
            chatbot.classList.toggle('active');
        });
        
        minimizeBtn?.addEventListener('click', () => {
            chatbot.classList.remove('active');
        });
        
        closeBtn?.addEventListener('click', () => {
            chatbot.classList.remove('active');
        });
        
        sendBtn?.addEventListener('click', () => {
            this.sendChatMessage(chatInput.value);
            chatInput.value = '';
        });
        
        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage(chatInput.value);
                chatInput.value = '';
            }
        });
        
        // Quick replies
        document.querySelectorAll('.quick-reply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sendChatMessage(btn.textContent);
            });
        });
    }

    async sendChatMessage(message) {
        if (!message.trim()) return;
        
        const messagesContainer = document.getElementById('chatbotMessages');
        
        // Add user message
        this.appendChatMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message with NLP - NEW
        const nlpResult = await this.aiPredictor.processNaturalLanguage(message);
        
        // Get bot response (enhanced with NLP context)
        const response = await this.chatService.sendMessage(message, nlpResult);
        
        // Hide typing indicator
        this.hideTypingIndicator();
        
        // Add bot response
        this.appendChatMessage(response, 'bot');
    }

    appendChatMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="https://ui-avatars.com/api/?name=AI&background=1FB8CD&color=fff" alt="AI">
                </div>
                <div class="message-content">
                    <p>${text}</p>
                    <div class="message-time">Just now</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                    <div class="message-time">Just now</div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.textContent = 'Typing...';
        }
    }

    hideTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.textContent = 'Online';
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        const icon = document.querySelector('#themeToggle i');
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            if (icon) icon.className = 'fas fa-moon';
        }
        
        localStorage.setItem('theme', theme);
    }

    setupSearchAndFilters() {
        const donorSearch = document.getElementById('donorSearch');
        
        if (donorSearch) {
            // Debounced search
            let searchTimeout;
            donorSearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchDonors(e.target.value);
                }, 300);
            });
        }
        
        // Filter chips
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.filterDonors(chip.dataset.filter);
            });
        });
    }

    setupViewToggles() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.changeView(btn.dataset.view);
            });
        });
    }

    changeView(view) {
        const donorGrid = document.getElementById('donorGrid');
        
        switch (view) {
            case 'grid':
                donorGrid.style.display = 'grid';
                break;
            case 'list':
                donorGrid.style.display = 'flex';
                donorGrid.style.flexDirection = 'column';
                break;
            case 'map':
                this.showDonorMap();
                break;
        }
    }

    async loadInitialData() {
        // Load donors
        await this.loadDonors();
        
        // Load statistics
        await this.loadStatistics();
        
        // Load activity stream
        await this.loadActivityStream();
        
        // Load urgent requests
        await this.loadUrgentRequests();
        
        // Initialize charts
        this.initializeCharts();
        
        // Animate counters
        this.animateCounters();
    }

    async loadDonors() {
        try {
            const donors = await this.donorService.getDonors();
            this.renderDonors(donors);
        } catch (error) {
            console.error('Error loading donors:', error);
        }
    }

    renderDonors(donors) {
        const grid = document.getElementById('donorGrid');
        if (!grid) return;
        
        grid.innerHTML = donors.map(donor => this.createDonorCard(donor)).join('');
    }

    createDonorCard(donor) {
        return `
            <div class="card-modern donor-card">
                <div class="donor-header">
                    <img src="${donor.avatar}" alt="${donor.name}" class="donor-avatar">
                    <div class="donor-status ${donor.available ? 'available' : ''}">
                        ${donor.available ? '● Available' : '○ Unavailable'}
                    </div>
                </div>
                <div class="donor-info">
                    <h4>${donor.name}</h4>
                    <div class="donor-meta">
                        <span class="blood-type-badge">${donor.bloodType}</span>
                        <span>${donor.location}</span>
                    </div>
                    <p class="donor-stats">
                        ${donor.donations} donations • Last: ${donor.lastDonation}
                    </p>
                </div>
                <div class="donor-actions">
                    <button class="btn-primary btn-sm" onclick="app.contactDonor('${donor.id}')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                    <button class="btn-secondary btn-sm" onclick="app.viewDonorProfile('${donor.id}')">
                        <i class="fas fa-user"></i> Profile
                    </button>
                </div>
            </div>
        `;
    }

    async loadStatistics() {
        // Update stat numbers with animation
        this.state.set('stats', {
            bloodNeeded: 2100000,
            activeDonors: 4437,
            patientsInCare: 100000,
            livesSaved: 3333
        });
    }

    async loadActivityStream() {
        const stream = document.getElementById('activityStream');
        if (!stream) return;
        
        // Simulate real-time activities
        const activities = [
            { type: 'donation', user: 'Amit S.', action: 'donated blood', time: '2 min ago' },
            { type: 'request', user: 'Patient TH001', action: 'requested AB- blood', time: '5 min ago' },
            { type: 'registration', user: 'Priya K.', action: 'registered as donor', time: '10 min ago' }
        ];
        
        stream.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${activity.type === 'donation' ? 'droplet' : activity.type === 'request' ? 'exclamation' : 'user-plus'}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.user}</strong> ${activity.action}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    async loadUrgentRequests() {
        const list = document.getElementById('urgentRequestsList');
        if (!list) return;
        
        const requests = [
            { id: 'TH001', bloodType: 'AB-', location: 'AIIMS Delhi', urgency: 'critical' },
            { id: 'TH002', bloodType: 'B+', location: 'CMC Vellore', urgency: 'urgent' }
        ];
        
        list.innerHTML = requests.map(req => `
            <div class="urgent-request-item ${req.urgency}">
                <div class="request-info">
                    <h5>Patient ${req.id}</h5>
                    <p>${req.bloodType} • ${req.location}</p>
                    <span class="urgency-badge ${req.urgency}">${req.urgency}</span>
                </div>
                <button class="btn-primary btn-sm" onclick="app.fulfillRequest('${req.id}')">
                    Fulfill
                </button>
            </div>
        `).join('');
    }

    initializeCharts() {
        this.initializeDemandForecastChart();
        this.initializeBloodTypeChart();
        this.initializeSparklines();
    }

    initializeDemandForecastChart() {
        const ctx = document.getElementById('demandForecastChart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Predicted Demand',
                    data: [2100, 2350, 2200, 2450, 2600, 2300, 2150],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Current Supply',
                    data: [1800, 1900, 1750, 2000, 1950, 1850, 1900],
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    initializeBloodTypeChart() {
        // Blood type distribution charts
    }

    initializeSparklines() {
        // Mini sparkline charts for stat cards
    }

    animateCounters() {
        document.querySelectorAll('.counter').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
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
        });
    }

    startRealtimeUpdates() {
        // Update every 30 seconds
        setInterval(() => {
            this.loadActivityStream();
        }, 30000);
        
        // Update stats every minute
        setInterval(() => {
            this.loadStatistics();
        }, 60000);
    }

    async loadSectionData(sectionId) {
        switch (sectionId) {
            case 'live-map':
                await this.mapService.loadDonors();
                break;
            case 'ai-insights':
                await this.loadAIInsights();
                break;
            case 'health-dashboard':
                await this.loadHealthDashboard();
                break;
            case 'achievements':
                await this.loadAchievements();
                break;
            case 'leaderboards':
                await this.loadLeaderboards();
                break;
            case 'rewards':
                await this.loadRewards();
                break;
            case 'learning':
                await this.loadLearningPortal();
                break;
            case 'news':
                await this.loadNewsFeed();
                break;
        }
    }

    async searchDonors(query) {
        const donors = await this.donorService.searchDonors(query);
        this.renderDonors(donors);
    }

    async filterDonors(filter) {
        const donors = await this.donorService.filterDonors(filter);
        this.renderDonors(donors);
    }

    async contactDonor(donorId) {
        await Swal.fire({
            title: 'Contact Donor',
            text: 'SMS and WhatsApp alerts sent!',
            icon: 'success',
            timer: 2000
        });
    }

    async viewDonorProfile(donorId) {
        // Open donor profile modal
    }

    async fulfillRequest(requestId) {
        await Swal.fire({
            title: 'Fulfill Request',
            text: 'Matching donors contacted!',
            icon: 'success',
            timer: 2000
        });
    }

    addUrgentRequest(formData) {
        // Add new urgent request to the list
    }

    async startVideoCall() {
        this.openModal('video-call');
        await this.videoService.startCall();
    }

    openHealthRecords() {
        // Open health records view - NEW
        this.openModal('healthDashboardModal');
        this.loadHealthDashboard();
    }

    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.querySelector('p').textContent = message;
            overlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    // ==================== ADVANCED FEATURES - NEW ====================
    
    async loadAIInsights() {
        const container = document.getElementById('aiInsightsContainer');
        if (!container) return;
        
        this.showLoading('Loading AI predictions...');
        
        try {
            // Get shortage predictions
            const predictions = await this.aiPredictor.predictShortages(7);
            
            // Get donation patterns
            const patterns = await this.aiPredictor.analyzeDonationPatterns();
            
            // Render AI insights
            this.renderAIInsights(predictions, patterns);
            
        } catch (error) {
            console.error('Error loading AI insights:', error);
            this.notifications.show('Failed to load AI insights', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    renderAIInsights(predictions, patterns) {
        const container = document.getElementById('aiInsightsContainer');
        
        container.innerHTML = `
            <div class="insights-grid">
                <div class="insight-card critical">
                    <h3><i class="fas fa-exclamation-triangle"></i> Shortage Predictions</h3>
                    ${predictions.map(p => `
                        <div class="prediction-item ${p.severity}">
                            <div class="prediction-header">
                                <span class="blood-type-badge">${p.bloodType}</span>
                                <span class="severity-badge ${p.severity}">${p.severity}</span>
                            </div>
                            <p class="prediction-message">${p.message}</p>
                            <div class="prediction-meta">
                                <span>Days: ${p.days}</span>
                                <span>Confidence: ${Math.round(p.confidence * 100)}%</span>
                            </div>
                            <div class="recommendations">
                                ${p.recommendations.map(r => `<p>• ${r}</p>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="insight-card">
                    <h3><i class="fas fa-chart-line"></i> Donation Patterns</h3>
                    <div class="pattern-stats">
                        <div class="stat-item">
                            <label>Peak Day:</label>
                            <span>${patterns.peakDay}</span>
                        </div>
                        <div class="stat-item">
                            <label>Peak Time:</label>
                            <span>${patterns.peakTime}</span>
                        </div>
                        <div class="stat-item">
                            <label>Retention Rate:</label>
                            <span>${patterns.retentionRate}%</span>
                        </div>
                        <div class="stat-item">
                            <label>Best Campaign:</label>
                            <span>${patterns.bestCampaign}</span>
                        </div>
                    </div>
                    <div class="recommendations">
                        <h4>Recommendations:</h4>
                        ${patterns.recommendations.map(r => `<p>• ${r}</p>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    async loadHealthDashboard() {
        const container = document.getElementById('healthDashboardContent');
        if (!container) return;
        
        this.showLoading('Loading health data...');
        
        try {
            const userId = this.state.get('userId') || 'patient_1';
            
            // Get health dashboard data
            const dashboard = await this.healthService.getHealthDashboard(userId);
            
            // Render health dashboard
            this.renderHealthDashboard(dashboard);
            
        } catch (error) {
            console.error('Error loading health dashboard:', error);
            this.notifications.show('Failed to load health data', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    renderHealthDashboard(dashboard) {
        const container = document.getElementById('healthDashboardContent');
        
        container.innerHTML = `
            <div class="health-grid">
                <!-- Vital Signs -->
                <div class="health-card">
                    <h3><i class="fas fa-heartbeat"></i> Vital Signs</h3>
                    <div class="vitals-list">
                        ${Object.entries(dashboard.vitals).map(([key, value]) => `
                            <div class="vital-item">
                                <span class="vital-label">${key}:</span>
                                <span class="vital-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Trends Chart -->
                <div class="health-card">
                    <h3><i class="fas fa-chart-area"></i> 6-Month Trends</h3>
                    <canvas id="healthTrendsChart"></canvas>
                </div>
                
                <!-- Health Alerts -->
                <div class="health-card">
                    <h3><i class="fas fa-bell"></i> Health Alerts</h3>
                    <div class="alerts-list">
                        ${dashboard.alerts.map(alert => `
                            <div class="alert-item ${alert.severity}">
                                <i class="fas fa-${alert.severity === 'high' ? 'exclamation-circle' : 'info-circle'}"></i>
                                <p>${alert.message}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Health Goals -->
                <div class="health-card">
                    <h3><i class="fas fa-bullseye"></i> Health Goals</h3>
                    <div class="goals-list">
                        ${dashboard.goals.map(goal => `
                            <div class="goal-item">
                                <div class="goal-header">
                                    <span>${goal.name}</span>
                                    <span class="goal-status ${goal.status}">${goal.status}</span>
                                </div>
                                <div class="goal-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${goal.progress}%"></div>
                                    </div>
                                    <span>${goal.progress}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Initialize health trends chart
        this.initializeHealthTrendsChart(dashboard.trends);
    }
    
    initializeHealthTrendsChart(trends) {
        const ctx = document.getElementById('healthTrendsChart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: trends.labels,
                datasets: [{
                    label: 'Hemoglobin (g/dL)',
                    data: trends.hemoglobin,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Ferritin (ng/mL)',
                    data: trends.ferritin,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    async loadAchievements() {
        const container = document.getElementById('achievementsContainer');
        if (!container) return;
        
        this.showLoading('Loading achievements...');
        
        try {
            const userId = this.state.get('userId') || 'user_1';
            const achievements = await this.gamification.getUserAchievements(userId);
            
            this.renderAchievements(achievements);
            
        } catch (error) {
            console.error('Error loading achievements:', error);
            this.notifications.show('Failed to load achievements', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    renderAchievements(achievements) {
        const container = document.getElementById('achievementsContainer');
        
        const unlocked = achievements.filter(a => a.unlocked);
        const locked = achievements.filter(a => !a.unlocked);
        
        container.innerHTML = `
            <div class="achievements-stats">
                <div class="stat">
                    <h2>${unlocked.length}</h2>
                    <p>Unlocked</p>
                </div>
                <div class="stat">
                    <h2>${achievements.reduce((sum, a) => sum + (a.unlocked ? a.points : 0), 0)}</h2>
                    <p>Total Points</p>
                </div>
                <div class="stat">
                    <h2>${locked.length}</h2>
                    <p>To Unlock</p>
                </div>
            </div>
            
            <div class="achievements-grid">
                <div class="achievement-section">
                    <h3><i class="fas fa-trophy"></i> Unlocked (${unlocked.length})</h3>
                    <div class="achievement-cards">
                        ${unlocked.map(a => this.createAchievementCard(a)).join('')}
                    </div>
                </div>
                
                <div class="achievement-section">
                    <h3><i class="fas fa-lock"></i> Locked (${locked.length})</h3>
                    <div class="achievement-cards">
                        ${locked.map(a => this.createAchievementCard(a)).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    createAchievementCard(achievement) {
        return `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} ${achievement.tier}">
                <div class="achievement-icon">
                    <i class="fas fa-${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    <div class="achievement-meta">
                        <span class="tier-badge ${achievement.tier}">${achievement.tier}</span>
                        <span class="points">+${achievement.points} pts</span>
                    </div>
                    ${achievement.unlocked ? `<small>Unlocked: ${achievement.unlockedAt}</small>` : ''}
                </div>
            </div>
        `;
    }
    
    async loadLeaderboards() {
        const container = document.getElementById('leaderboardsContainer');
        if (!container) return;
        
        this.showLoading('Loading leaderboards...');
        
        try {
            const national = await this.gamification.getLeaderboard('national', 'all-time');
            const state = await this.gamification.getLeaderboard('state', 'monthly', 'Maharashtra');
            
            this.renderLeaderboards({ national, state });
            
        } catch (error) {
            console.error('Error loading leaderboards:', error);
            this.notifications.show('Failed to load leaderboards', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    renderLeaderboards(data) {
        const container = document.getElementById('leaderboardsContainer');
        
        container.innerHTML = `
            <div class="leaderboard-tabs">
                <button class="tab-btn active" data-tab="national">🇮🇳 National</button>
                <button class="tab-btn" data-tab="state">📍 State</button>
                <button class="tab-btn" data-tab="city">🏙️ City</button>
            </div>
            
            <div class="leaderboard-content">
                <div class="leaderboard-panel active" id="national">
                    ${this.createLeaderboardTable(data.national)}
                </div>
                <div class="leaderboard-panel" id="state">
                    ${this.createLeaderboardTable(data.state)}
                </div>
            </div>
        `;
        
        // Setup tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.leaderboard-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });
    }
    
    createLeaderboardTable(leaderboard) {
        return `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Donor</th>
                        <th>Points</th>
                        <th>Donations</th>
                        <th>Trend</th>
                    </tr>
                </thead>
                <tbody>
                    ${leaderboard.rankings.map((entry, index) => `
                        <tr class="${entry.userId === (this.state.get('userId') || 'user_1') ? 'current-user' : ''}">
                            <td>
                                ${index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${entry.rank}`}
                            </td>
                            <td>
                                <div class="donor-cell">
                                    <img src="${entry.avatar}" alt="${entry.name}">
                                    <span>${entry.name}</span>
                                </div>
                            </td>
                            <td><strong>${entry.points.toLocaleString()}</strong></td>
                            <td>${entry.donations}</td>
                            <td>
                                <span class="trend ${entry.trend}">
                                    <i class="fas fa-arrow-${entry.trend === 'up' ? 'up' : entry.trend === 'down' ? 'down' : 'right'}"></i>
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    async loadRewards() {
        const container = document.getElementById('rewardsContainer');
        if (!container) return;
        
        this.showLoading('Loading rewards...');
        
        try {
            const userId = this.state.get('userId') || 'user_1';
            const rewards = await this.gamification.getAvailableRewards(userId);
            const userPoints = await this.gamification.getUserPoints(userId);
            
            this.renderRewards(rewards, userPoints);
            
        } catch (error) {
            console.error('Error loading rewards:', error);
            this.notifications.show('Failed to load rewards', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    renderRewards(rewards, userPoints) {
        const container = document.getElementById('rewardsContainer');
        
        container.innerHTML = `
            <div class="rewards-header">
                <div class="user-points">
                    <h2>${userPoints.toLocaleString()}</h2>
                    <p>Available Points</p>
                </div>
            </div>
            
            <div class="rewards-grid">
                ${rewards.map(reward => `
                    <div class="reward-card ${userPoints >= reward.pointsCost ? 'available' : 'locked'}">
                        <div class="reward-image">
                            <i class="fas fa-${reward.icon}"></i>
                        </div>
                        <div class="reward-info">
                            <h4>${reward.name}</h4>
                            <p>${reward.description}</p>
                            <div class="reward-cost">
                                <span class="points">${reward.pointsCost} points</span>
                                ${reward.value ? `<span class="value">Worth ₹${reward.value}</span>` : ''}
                            </div>
                            <button class="btn-primary btn-sm" 
                                    ${userPoints >= reward.pointsCost ? '' : 'disabled'}
                                    onclick="app.redeemReward('${reward.id}')">
                                ${userPoints >= reward.pointsCost ? 'Redeem' : 'Insufficient Points'}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    async redeemReward(rewardId) {
        try {
            const userId = this.state.get('userId') || 'user_1';
            const result = await this.gamification.redeemReward(userId, rewardId);
            
            await Swal.fire({
                icon: 'success',
                title: 'Reward Redeemed!',
                html: `
                    <p>Redemption Code: <strong>${result.redemptionCode}</strong></p>
                    <p>${result.deliveryInfo}</p>
                `,
                confirmButtonColor: '#1FB8CD'
            });
            
            // Reload rewards
            this.loadRewards();
            
        } catch (error) {
            this.notifications.show('Failed to redeem reward', 'error');
        }
    }
    
    async loadLearningPortal() {
        const container = document.getElementById('learningContainer');
        if (!container) return;
        
        this.showLoading('Loading courses...');
        
        try {
            const courses = await this.learningPortal.getCourses();
            const userId = this.state.get('userId') || 'user_1';
            const enrolled = await this.learningPortal.getEnrolledCourses(userId);
            
            this.renderLearningPortal(courses, enrolled);
            
        } catch (error) {
            console.error('Error loading learning portal:', error);
            this.notifications.show('Failed to load courses', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    renderLearningPortal(courses, enrolled) {
        const container = document.getElementById('learningContainer');
        
        container.innerHTML = `
            <div class="learning-header">
                <h2>Blood Donation Learning Portal</h2>
                <p>Expand your knowledge and earn certificates</p>
            </div>
            
            <div class="courses-grid">
                ${courses.map(course => {
                    const isEnrolled = enrolled.some(e => e.courseId === course.id);
                    const enrollment = enrolled.find(e => e.courseId === course.id);
                    
                    return `
                        <div class="course-card">
                            <div class="course-header">
                                <span class="difficulty-badge ${course.difficulty}">${course.difficulty}</span>
                                <span class="duration"><i class="fas fa-clock"></i> ${course.duration}</span>
                            </div>
                            <h3>${course.title}</h3>
                            <p>${course.description}</p>
                            <div class="course-meta">
                                <span><i class="fas fa-book"></i> ${course.modules.length} modules</span>
                                <span><i class="fas fa-certificate"></i> Certificate</span>
                            </div>
                            ${isEnrolled ? `
                                <div class="course-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                                    </div>
                                    <span>${enrollment.progress}% complete</span>
                                </div>
                                <button class="btn-primary btn-sm" onclick="app.continueCourse('${course.id}')">
                                    Continue Learning
                                </button>
                            ` : `
                                <button class="btn-secondary btn-sm" onclick="app.enrollCourse('${course.id}')">
                                    Enroll Now
                                </button>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    async enrollCourse(courseId) {
        try {
            const userId = this.state.get('userId') || 'user_1';
            await this.learningPortal.enrollInCourse(userId, courseId);
            
            this.notifications.show('Successfully enrolled in course!', 'success');
            this.loadLearningPortal();
            
        } catch (error) {
            this.notifications.show('Failed to enroll', 'error');
        }
    }
    
    async continueCourse(courseId) {
        // Open course viewer modal
        this.openModal('courseViewerModal');
        // Load course content...
    }
    
    setupAccessibilitySettings() {
        // Screen Reader Toggle
        const screenReaderToggle = document.getElementById('screenReaderToggle');
        if (screenReaderToggle) {
            screenReaderToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.accessibility.enableScreenReader();
                } else {
                    this.accessibility.disableScreenReader();
                }
            });
        }
        
        // Voice Commands Toggle
        const voiceCommandsToggle = document.getElementById('voiceCommandsToggle');
        if (voiceCommandsToggle) {
            voiceCommandsToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.accessibility.enableVoiceCommands();
                } else {
                    this.accessibility.disableVoiceCommands();
                }
            });
        }
        
        // Text-to-Speech Toggle
        const ttsToggle = document.getElementById('ttsToggle');
        if (ttsToggle) {
            ttsToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.accessibility.speak('Text to speech enabled');
                }
            });
        }
        
        // High Contrast Toggle
        const highContrastToggle = document.getElementById('highContrastToggle');
        if (highContrastToggle) {
            highContrastToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.accessibility.enableHighContrast();
                } else {
                    this.accessibility.disableHighContrast();
                }
            });
        }
        
        // Font Size Selector
        const fontSizeSelect = document.getElementById('fontSizeSelect');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', (e) => {
                document.body.className = document.body.className.replace(/font-size-\w+/g, '');
                document.body.classList.add(`font-size-${e.target.value}`);
                localStorage.setItem('fontSize', e.target.value);
            });
            
            // Load saved preference
            const savedSize = localStorage.getItem('fontSize') || 'medium';
            fontSizeSelect.value = savedSize;
            document.body.classList.add(`font-size-${savedSize}`);
        }
    }
    
    async loadNewsFeed() {
        const container = document.getElementById('newsContainer');
        if (!container) return;
        
        this.showLoading('Loading news...');
        
        try {
            const articles = await this.newsFeed.getArticles();
            this.renderNewsFeed(articles);
            
        } catch (error) {
            console.error('Error loading news:', error);
            this.notifications.show('Failed to load news', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    renderNewsFeed(articles) {
        const container = document.getElementById('newsContainer');
        
        container.innerHTML = `
            <div class="news-grid">
                ${articles.map(article => `
                    <article class="news-card">
                        <img src="${article.image}" alt="${article.title}" class="news-image">
                        <div class="news-content">
                            <span class="news-category">${article.category}</span>
                            <h3>${article.title}</h3>
                            <p>${article.summary}</p>
                            <div class="news-meta">
                                <span><i class="fas fa-user"></i> ${article.author}</span>
                                <span><i class="fas fa-calendar"></i> ${article.publishedAt}</span>
                            </div>
                            <a href="${article.link}" target="_blank" class="btn-secondary btn-sm">
                                Read More <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                    </article>
                `).join('')}
            </div>
        `;
    }
    
    async openAIScreening() {
        this.openModal('aiScreeningModal');
        
        // Load AI screening form
        const form = document.getElementById('aiScreeningForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.performAIScreening(new FormData(form));
            });
        }
    }
    
    async performAIScreening(formData) {
        this.showLoading('Analyzing eligibility...');
        
        try {
            const donorData = {
                age: parseInt(formData.get('age')),
                weight: parseInt(formData.get('weight')),
                lastDonation: formData.get('lastDonation'),
                medications: formData.get('medications')?.split(',') || [],
                healthConditions: formData.get('conditions')?.split(',') || []
            };
            
            const result = await this.aiPredictor.checkDonorEligibility(donorData);
            
            await Swal.fire({
                icon: result.eligible ? 'success' : 'warning',
                title: result.eligible ? 'Eligible to Donate!' : 'Not Eligible',
                html: `
                    <div class="screening-result">
                        <div class="eligibility-score">
                            <h3>${result.score}%</h3>
                            <p>Eligibility Score</p>
                        </div>
                        <div class="screening-details">
                            ${result.issues.length > 0 ? `
                                <h4>Issues Found:</h4>
                                <ul>
                                    ${result.issues.map(issue => `<li>${issue}</li>`).join('')}
                                </ul>
                            ` : '<p>All checks passed!</p>'}
                            ${result.recommendations.length > 0 ? `
                                <h4>Recommendations:</h4>
                                <ul>
                                    ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                                </ul>
                            ` : ''}
                            ${result.nextEligibleDate ? `
                                <p><strong>Next eligible date:</strong> ${result.nextEligibleDate}</p>
                            ` : ''}
                        </div>
                    </div>
                `,
                confirmButtonColor: '#1FB8CD',
                width: 600
            });
            
            this.closeModal('aiScreeningModal');
            
        } catch (error) {
            console.error('AI screening error:', error);
            this.notifications.show('Screening failed', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    async openRewardsCenter() {
        this.openModal('rewardsCenterModal');
        this.loadRewards();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BloodBridgeApp();
});

export default BloodBridgeApp;
