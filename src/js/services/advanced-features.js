/**
 * ADVANCED FEATURES SERVICE
 * WhatsApp, Accessibility, Multi-language, Advanced Analytics
 */

import { Utils } from '../utils.js';

/**
 * WhatsApp Integration Service
 */
export class WhatsAppService {
    constructor() {
        this.apiKey = 'YOUR_WHATSAPP_BUSINESS_API_KEY';
        this.phoneNumberId = 'YOUR_PHONE_NUMBER_ID';
    }

    async sendMessage(recipientPhone, message) {
        console.log(`📱 Sending WhatsApp to ${recipientPhone}: ${message}`);
        
        // In production, would use WhatsApp Business API
        const payload = {
            messaging_product: 'whatsapp',
            to: recipientPhone,
            type: 'text',
            text: { body: message }
        };
        
        // Simulate API call
        await Utils.delay(500);
        
        return {
            success: true,
            messageId: Utils.generateId(),
            timestamp: new Date().toISOString()
        };
    }

    async sendTemplate(recipientPhone, templateName, parameters) {
        console.log(`📱 Sending WhatsApp template ${templateName} to ${recipientPhone}`);
        
        const templates = {
            emergency_alert: {
                name: 'emergency_blood_request',
                language: 'en',
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: parameters.bloodType },
                            { type: 'text', text: parameters.location },
                            { type: 'text', text: parameters.contact }
                        ]
                    }
                ]
            },
            appointment_reminder: {
                name: 'appointment_reminder',
                language: 'en',
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: parameters.date },
                            { type: 'text', text: parameters.time },
                            { type: 'text', text: parameters.location }
                        ]
                    }
                ]
            },
            thank_you: {
                name: 'donation_thanks',
                language: 'en',
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: parameters.donorName },
                            { type: 'text', text: parameters.donationCount }
                        ]
                    }
                ]
            }
        };
        
        const template = templates[templateName];
        
        await Utils.delay(500);
        
        return {
            success: true,
            messageId: Utils.generateId(),
            template: template.name
        };
    }

    async sendBulkMessage(recipients, message) {
        console.log(`📱 Sending bulk WhatsApp to ${recipients.length} recipients`);
        
        const results = [];
        
        for (const recipient of recipients) {
            const result = await this.sendMessage(recipient, message);
            results.push({ phone: recipient, ...result });
            await Utils.delay(100); // Rate limiting
        }
        
        return {
            total: recipients.length,
            sent: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results
        };
    }

    async sendEmergencyAlert(donors, requestDetails) {
        const message = `🚨 EMERGENCY BLOOD REQUEST\n\nBlood Type: ${requestDetails.bloodType}\nLocation: ${requestDetails.location}\nContact: ${requestDetails.contact}\n\nCan you help? Reply YES to confirm.`;
        
        const phones = donors.map(d => d.phone);
        return this.sendBulkMessage(phones, message);
    }

    async sendAppointmentReminder(appointment) {
        return this.sendTemplate(appointment.patientPhone, 'appointment_reminder', {
            date: appointment.date,
            time: appointment.time,
            location: appointment.location
        });
    }

    async sendDonationThankYou(donor) {
        return this.sendTemplate(donor.phone, 'thank_you', {
            donorName: donor.name,
            donationCount: donor.totalDonations
        });
    }

    async enableChatbot() {
        // Enable WhatsApp chatbot for automated responses
        console.log('🤖 WhatsApp chatbot enabled');
        
        return {
            enabled: true,
            features: [
                'Eligibility check',
                'Find nearby blood banks',
                'Book appointment',
                'Emergency request',
                'Donation history'
            ]
        };
    }
}

/**
 * Accessibility Service
 */
export class AccessibilityService {
    constructor() {
        this.screenReader = new ScreenReaderSupport();
        this.voiceCommands = new VoiceCommandSystem();
        this.textToSpeech = new TextToSpeechService();
        this.highContrast = new HighContrastMode();
    }

    async initialize() {
        console.log('♿ Initializing accessibility features...');
        
        // Check user preferences
        const preferences = this.loadPreferences();
        
        if (preferences.screenReader) {
            await this.screenReader.enable();
        }
        
        if (preferences.voiceCommands) {
            await this.voiceCommands.enable();
        }
        
        if (preferences.highContrast) {
            this.highContrast.enable();
        }
        
        if (preferences.textToSpeech) {
            await this.textToSpeech.enable();
        }
        
        return {
            enabled: true,
            features: this.getEnabledFeatures()
        };
    }

    loadPreferences() {
        return JSON.parse(localStorage.getItem('accessibility') || '{}');
    }

    savePreferences(preferences) {
        localStorage.setItem('accessibility', JSON.stringify(preferences));
    }

    getEnabledFeatures() {
        return {
            screenReader: this.screenReader.isEnabled(),
            voiceCommands: this.voiceCommands.isEnabled(),
            textToSpeech: this.textToSpeech.isEnabled(),
            highContrast: this.highContrast.isEnabled(),
            keyboardNavigation: true,
            ariaLabels: true
        };
    }
}

class ScreenReaderSupport {
    constructor() {
        this.enabled = false;
    }

    async enable() {
        this.enabled = true;
        
        // Add ARIA labels to all interactive elements
        this.addAriaLabels();
        
        // Announce page changes
        this.setupLiveRegions();
        
        console.log('📖 Screen reader support enabled');
    }

    addAriaLabels() {
        // Add aria-labels to buttons, links, forms
        document.querySelectorAll('button:not([aria-label])').forEach(btn => {
            btn.setAttribute('aria-label', btn.textContent || 'Button');
        });
        
        document.querySelectorAll('a:not([aria-label])').forEach(link => {
            link.setAttribute('aria-label', link.textContent || 'Link');
        });
        
        document.querySelectorAll('input:not([aria-label])').forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-label', label.textContent);
            }
        });
    }

    setupLiveRegions() {
        // Create ARIA live regions for announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }

    announce(message) {
        const liveRegion = document.getElementById('aria-live');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    isEnabled() {
        return this.enabled;
    }
}

class VoiceCommandSystem {
    constructor() {
        this.enabled = false;
        this.recognition = null;
        this.commands = this.initializeCommands();
    }

    async enable() {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            console.error('Speech recognition not supported');
            return false;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-IN';
        
        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.toLowerCase();
            this.processCommand(command);
        };
        
        this.recognition.start();
        this.enabled = true;
        
        console.log('🎤 Voice commands enabled');
        return true;
    }

    initializeCommands() {
        return {
            'emergency': () => window.app.openModal('emergencyModal'),
            'donate blood': () => window.app.openModal('donor-registration'),
            'find donors': () => window.app.searchDonors(''),
            'my profile': () => window.app.openUserProfile(),
            'help': () => window.app.openModal('chatbot'),
            'logout': () => window.app.logout()
        };
    }

    processCommand(command) {
        console.log(`🎤 Voice command: ${command}`);
        
        for (const [key, action] of Object.entries(this.commands)) {
            if (command.includes(key)) {
                action();
                return;
            }
        }
        
        console.log('Command not recognized');
    }

    isEnabled() {
        return this.enabled;
    }

    disable() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.enabled = false;
    }
}

class TextToSpeechService {
    constructor() {
        this.enabled = false;
        this.synth = window.speechSynthesis;
        this.voice = null;
    }

    async enable() {
        if (!this.synth) {
            console.error('Text-to-speech not supported');
            return false;
        }
        
        // Load voices
        const voices = this.synth.getVoices();
        this.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        
        this.enabled = true;
        console.log('🔊 Text-to-speech enabled');
        return true;
    }

    speak(text, options = {}) {
        if (!this.enabled || !this.synth) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;
        
        this.synth.speak(utterance);
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }

    isEnabled() {
        return this.enabled;
    }
}

class HighContrastMode {
    constructor() {
        this.enabled = false;
    }

    enable() {
        document.body.classList.add('high-contrast');
        this.enabled = true;
        console.log('🎨 High contrast mode enabled');
    }

    disable() {
        document.body.classList.remove('high-contrast');
        this.enabled = false;
    }

    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    isEnabled() {
        return this.enabled;
    }
}

/**
 * Multi-language Service
 */
export class LanguageService {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = new Map();
        this.supportedLanguages = [
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
            { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
            { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
            { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
            { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
            { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
            { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
            { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
            { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
            { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
            { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
            { code: 'ur', name: 'Urdu', nativeName: 'اردو' }
        ];
        
        this.loadTranslations();
    }

    async loadTranslations() {
        // Load translations for common phrases
        this.translations.set('en', {
            'app.title': 'BloodBridge',
            'nav.dashboard': 'Dashboard',
            'nav.donors': 'Donors',
            'nav.patients': 'Patients',
            'nav.blood-banks': 'Blood Banks',
            'button.emergency': 'Emergency',
            'button.donate': 'Donate Blood',
            'button.search': 'Search',
            'label.blood-type': 'Blood Type',
            'label.location': 'Location',
            'message.thank-you': 'Thank you for donating blood!',
            'message.lives-saved': 'You have saved {count} lives'
        });
        
        this.translations.set('hi', {
            'app.title': 'ब्लडब्रिज',
            'nav.dashboard': 'डैशबोर्ड',
            'nav.donors': 'दानकर्ता',
            'nav.patients': 'मरीज',
            'nav.blood-banks': 'रक्त बैंक',
            'button.emergency': 'आपातकालीन',
            'button.donate': 'रक्तदान करें',
            'button.search': 'खोजें',
            'label.blood-type': 'रक्त समूह',
            'label.location': 'स्थान',
            'message.thank-you': 'रक्तदान के लिए धन्यवाद!',
            'message.lives-saved': 'आपने {count} जीवन बचाए हैं'
        });
        
        // More languages would be loaded similarly
    }

    async setLanguage(languageCode) {
        if (!this.translations.has(languageCode)) {
            console.error(`Language ${languageCode} not supported`);
            return false;
        }
        
        this.currentLanguage = languageCode;
        localStorage.setItem('language', languageCode);
        
        // Update all translated elements
        this.updateUI();
        
        // Update document language attribute
        document.documentElement.lang = languageCode;
        
        console.log(`🌐 Language changed to ${languageCode}`);
        return true;
    }

    translate(key, params = {}) {
        const translations = this.translations.get(this.currentLanguage);
        let text = translations?.[key] || key;
        
        // Replace parameters
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }

    updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

/**
 * Advanced Analytics & Reporting
 */
export class AdvancedAnalytics {
    constructor() {
        this.dashboards = new Map();
    }

    async createDashboard(name, widgets) {
        const dashboard = {
            id: Utils.generateId(),
            name,
            widgets,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        this.dashboards.set(dashboard.id, dashboard);
        return dashboard;
    }

    async generateReport(type, parameters) {
        console.log(`📊 Generating ${type} report...`);
        
        const reports = {
            'donation-trends': await this.getDonationTrendsReport(parameters),
            'donor-demographics': await this.getDonorDemographicsReport(parameters),
            'blood-inventory': await this.getBloodInventoryReport(parameters),
            'emergency-response': await this.getEmergencyResponseReport(parameters),
            'campaign-effectiveness': await this.getCampaignEffectivenessReport(parameters)
        };
        
        return reports[type] || {};
    }

    async getDonationTrendsReport(params) {
        return {
            title: 'Donation Trends Analysis',
            period: params.period || 'Last 12 months',
            data: {
                totalDonations: 15420,
                averagePerMonth: 1285,
                trend: '+12.5%',
                peakMonth: 'January',
                lowMonth: 'June',
                byBloodType: {
                    'O+': 4200,
                    'A+': 3800,
                    'B+': 3200,
                    'AB+': 1100,
                    'O-': 900,
                    'A-': 750,
                    'B-': 650,
                    'AB-': 320
                },
                byLocation: [
                    { city: 'Mumbai', donations: 3500 },
                    { city: 'Delhi', donations: 3200 },
                    { city: 'Bangalore', donations: 2800 },
                    { city: 'Chennai', donations: 2400 },
                    { city: 'Kolkata', donations: 2100 }
                ]
            },
            insights: [
                'Donations increased by 12.5% compared to last year',
                'January saw highest donations due to awareness campaigns',
                'Summer months (May-July) need targeted donor recruitment',
                'O+ and A+ blood types constitute 52% of donations'
            ],
            recommendations: [
                'Schedule major campaigns in May-July to counter summer dip',
                'Focus on recruiting O- and AB- donors (rare types)',
                'Replicate January campaign strategies'
            ]
        };
    }

    async getDonorDemographicsReport(params) {
        return {
            title: 'Donor Demographics Analysis',
            data: {
                totalDonors: 45670,
                activeDonors: 28400,
                newThisYear: 5670,
                byAge: {
                    '18-25': 12500,
                    '26-35': 18900,
                    '36-45': 10200,
                    '46-55': 3400,
                    '56-65': 670
                },
                byGender: {
                    male: 28900,
                    female: 15800,
                    other: 970
                },
                byOccupation: {
                    student: 15600,
                    professional: 18900,
                    business: 6700,
                    other: 4470
                }
            }
        };
    }

    async getBloodInventoryReport(params) {
        return {
            title: 'Blood Inventory Status',
            data: {
                totalUnits: 8920,
                criticalLevels: ['AB-', 'O-'],
                expiringWithin7Days: 450,
                byBloodType: {
                    'O+': { units: 2100, status: 'adequate' },
                    'A+': { units: 1900, status: 'adequate' },
                    'B+': { units: 1650, status: 'adequate' },
                    'AB+': { units: 750, status: 'low' },
                    'O-': { units: 420, status: 'critical' },
                    'A-': { units: 550, status: 'low' },
                    'B-': { units: 480, status: 'low' },
                    'AB-': { units: 270, status: 'critical' }
                }
            },
            alerts: [
                'O- blood at critical level - mobilize donors immediately',
                'AB- blood below minimum threshold',
                '450 units expiring in 7 days - arrange usage'
            ]
        };
    }

    async getEmergencyResponseReport(params) {
        return {
            title: 'Emergency Response Metrics',
            data: {
                totalEmergencies: 1240,
                averageResponseTime: '28 minutes',
                fulfillmentRate: '87%',
                byUrgency: {
                    critical: { count: 320, avgTime: '18 min', fulfillment: '92%' },
                    urgent: { count: 560, avgTime: '25 min', fulfillment: '89%' },
                    normal: { count: 360, avgTime: '45 min', fulfillment: '82%' }
                },
                topPerformingRegions: ['Mumbai', 'Delhi', 'Bangalore'],
                needsImprovement: ['Rural areas', 'Small towns']
            },
            kpis: {
                responseTime: { target: '< 30 min', current: '28 min', status: 'met' },
                fulfillmentRate: { target: '> 85%', current: '87%', status: 'met' },
                donorMobilization: { target: '> 5 per request', current: '6.2', status: 'exceeded' }
            }
        };
    }

    async getCampaignEffectivenessReport(params) {
        return {
            title: 'Campaign Effectiveness Analysis',
            data: {
                totalCampaigns: 45,
                totalReach: 2500000,
                newRegistrations: 8900,
                conversionRate: '3.56%',
                byChannel: {
                    whatsapp: { reach: 800000, registrations: 3200, conversion: '4.0%', roi: '320%' },
                    social: { reach: 1200000, registrations: 3600, conversion: '3.0%', roi: '180%' },
                    email: { reach: 500000, registrations: 2100, conversion: '4.2%', roi: '210%' }
                },
                topCampaigns: [
                    { name: 'World Blood Donor Day', reach: 500000, registrations: 2100 },
                    { name: 'Thalassemia Awareness', reach: 350000, registrations: 1680 },
                    { name: 'College Outreach', reach: 280000, registrations: 1400 }
                ]
            },
            recommendations: [
                'WhatsApp campaigns show highest conversion - increase budget by 30%',
                'College outreach programs are cost-effective - expand to more institutions',
                'Email campaigns have highest engagement - optimize for mobile'
            ]
        };
    }

    async exportReport(reportType, format = 'pdf') {
        const report = await this.generateReport(reportType, {});
        
        console.log(`📥 Exporting ${reportType} report as ${format}...`);
        
        if (format === 'pdf') {
            return this.generatePDF(report);
        } else if (format === 'excel') {
            return this.generateExcel(report);
        } else if (format === 'csv') {
            return this.generateCSV(report);
        }
    }

    generatePDF(report) {
        // Would use jsPDF or similar library
        console.log('Generating PDF...');
        return {
            filename: `${report.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
            url: 'data:application/pdf;base64,...',
            size: '1.2 MB'
        };
    }

    generateExcel(report) {
        // Would use SheetJS or similar library
        console.log('Generating Excel...');
        return {
            filename: `${report.title.replace(/\s+/g, '_')}_${Date.now()}.xlsx`,
            url: 'data:application/vnd.ms-excel;base64,...',
            size: '450 KB'
        };
    }

    generateCSV(report) {
        // Convert report data to CSV
        const csv = Utils.arrayToCSV([report.data]);
        return {
            filename: `${report.title.replace(/\s+/g, '_')}_${Date.now()}.csv`,
            data: csv,
            size: `${csv.length} bytes`
        };
    }

    async getAuditLog(filters = {}) {
        // Return audit trail of all actions
        return {
            total: 15670,
            filtered: 234,
            entries: [
                {
                    id: '1',
                    timestamp: '2024-11-01 14:30:15',
                    user: 'admin@bloodbridge.in',
                    action: 'donor_registration',
                    details: 'New donor registered: Rajesh Kumar',
                    ipAddress: '192.168.1.1',
                    status: 'success'
                },
                {
                    id: '2',
                    timestamp: '2024-11-01 14:25:08',
                    user: 'doctor@aiims.in',
                    action: 'emergency_request',
                    details: 'Emergency blood request submitted',
                    ipAddress: '203.45.67.89',
                    status: 'success'
                }
                // More entries...
            ]
        };
    }
}

/**
 * News Feed Service
 */
export class NewsFeedService {
    constructor() {
        this.articles = [];
    }

    async getLatestNews() {
        // Fetch from RSS feeds, APIs, or database
        return [
            {
                id: '1',
                title: 'National Blood Donation Drive Exceeds Target',
                summary: 'Over 50,000 units collected in nationwide campaign',
                category: 'Success Story',
                date: '2024-11-01',
                source: 'BloodBridge News',
                image: 'https://via.placeholder.com/400x200',
                link: '/news/national-drive-success'
            },
            {
                id: '2',
                title: 'New AI System Predicts Blood Shortages',
                summary: 'Machine learning algorithm achieves 87% accuracy in forecasting',
                category: 'Technology',
                date: '2024-10-30',
                source: 'HealthTech India',
                image: 'https://via.placeholder.com/400x200',
                link: '/news/ai-prediction-system'
            },
            {
                id: '3',
                title: 'Thalassemia Awareness Month: How You Can Help',
                summary: 'Learn about thalassemia and how regular blood donations save lives',
                category: 'Awareness',
                date: '2024-10-28',
                source: 'BloodBridge Education',
                image: 'https://via.placeholder.com/400x200',
                link: '/news/thalassemia-awareness'
            }
        ];
    }

    async getArticle(id) {
        return {
            id,
            title: 'Article Title',
            content: 'Full article content...',
            author: 'Author Name',
            publishedAt: '2024-11-01',
            category: 'News',
            tags: ['blood donation', 'health', 'awareness']
        };
    }
}

/**
 * Learning Portal Service
 */
export class LearningPortalService {
    constructor() {
        this.courses = this.initializeCourses();
        this.userProgress = new Map();
    }

    initializeCourses() {
        return [
            {
                id: 'basics',
                title: 'Blood Donation Basics',
                description: 'Learn the fundamentals of blood donation',
                duration: '30 minutes',
                modules: 5,
                level: 'Beginner',
                certificate: true,
                content: [
                    { id: 1, title: 'What is Blood Donation?', type: 'video', duration: '5 min' },
                    { id: 2, title: 'Eligibility Criteria', type: 'text', duration: '3 min' },
                    { id: 3, title: 'Donation Process', type: 'video', duration: '8 min' },
                    { id: 4, title: 'After Donation Care', type: 'text', duration: '4 min' },
                    { id: 5, title: 'Quiz', type: 'quiz', duration: '10 min' }
                ]
            },
            {
                id: 'thalassemia',
                title: 'Understanding Thalassemia',
                description: 'Comprehensive guide to thalassemia care',
                duration: '45 minutes',
                modules: 6,
                level: 'Intermediate',
                certificate: true,
                content: [
                    { id: 1, title: 'What is Thalassemia?', type: 'video', duration: '10 min' },
                    { id: 2, title: 'Types of Thalassemia', type: 'text', duration: '5 min' },
                    { id: 3, title: 'Treatment Options', type: 'video', duration: '12 min' },
                    { id: 4, title: 'Blood Transfusion Process', type: 'video', duration: '8 min' },
                    { id: 5, title: 'Iron Chelation Therapy', type: 'text', duration: '6 min' },
                    { id: 6, title: 'Final Assessment', type: 'quiz', duration: '15 min' }
                ]
            }
        ];
    }

    async enrollCourse(userId, courseId) {
        const course = this.courses.find(c => c.id === courseId);
        
        if (!course) {
            throw new Error('Course not found');
        }
        
        const enrollment = {
            userId,
            courseId,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            completed: false,
            currentModule: 1
        };
        
        if (!this.userProgress.has(userId)) {
            this.userProgress.set(userId, new Map());
        }
        
        this.userProgress.get(userId).set(courseId, enrollment);
        
        return enrollment;
    }

    async updateProgress(userId, courseId, moduleId) {
        const userCourses = this.userProgress.get(userId);
        const enrollment = userCourses?.get(courseId);
        
        if (!enrollment) {
            throw new Error('Not enrolled in course');
        }
        
        const course = this.courses.find(c => c.id === courseId);
        const progress = (moduleId / course.modules) * 100;
        
        enrollment.progress = progress;
        enrollment.currentModule = moduleId + 1;
        
        if (progress === 100) {
            enrollment.completed = true;
            enrollment.completedAt = new Date().toISOString();
            
            // Award certificate
            return {
                completed: true,
                certificate: await this.generateCertificate(userId, courseId)
            };
        }
        
        return { progress };
    }

    async generateCertificate(userId, courseId) {
        const course = this.courses.find(c => c.id === courseId);
        
        return {
            certificateId: Utils.generateId(),
            userId,
            courseName: course.title,
            issuedAt: new Date().toISOString(),
            downloadUrl: `https://bloodbridge.in/certificates/${Utils.generateId()}.pdf`
        };
    }

    getCourses() {
        return this.courses;
    }

    async getUserCourses(userId) {
        const userCourses = this.userProgress.get(userId);
        if (!userCourses) return [];
        
        return Array.from(userCourses.values());
    }
}
