/**
 * CHAT SERVICE
 * AI Chatbot - Veeru
 */

export class ChatService {
    constructor() {
        this.responses = this.initializeResponses();
    }

    async init() {
        console.log('🤖 Veeru AI Chatbot initialized');
    }

    initializeResponses() {
        return {
            greetings: [
                "Hello! I'm Veeru, your BloodBridge assistant. How can I help you today?",
                "Hi there! Ready to save lives together?",
                "Namaste! I'm here to help with all your blood donation queries."
            ],
            donation: [
                "To donate blood, you must be: 18-65 years old, weigh at least 50kg, and be in good health. Would you like to register?",
                "Blood donation is safe and takes only 10-15 minutes. You can donate every 3 months. Shall I find donation centers near you?"
            ],
            thalassemia: [
                "Thalassemia is a genetic blood disorder requiring regular transfusions. Our platform connects patients with donors quickly and efficiently.",
                "Thalassemia patients need blood every 2-4 weeks. Regular donors are life-savers! Would you like to become a regular donor?"
            ],
            eligibility: [
                "To donate blood, you should: Be 18-65 years, weigh >50kg, have no active infections, and haven't donated in last 3 months.",
                "Most healthy adults can donate! There are temporary deferrals for recent tattoos, travel, or medications. Want to check your eligibility?"
            ],
            emergency: [
                "For emergency blood requests, click the red Emergency button. We'll alert nearby donors immediately!",
                "Blood emergencies require immediate action. Use our Emergency Request feature to reach donors within minutes."
            ],
            bloodTypes: [
                "Blood types: A, B, AB, O with +/- Rh factor. O- is universal donor. AB+ is universal receiver. Which type do you need?",
                "Different blood types have specific compatibility. O- can donate to all, AB+ can receive from all."
            ],
            benefits: [
                "Donating blood: Reduces heart disease risk, burns calories, provides free health check, and saves up to 3 lives per donation!",
                "Regular blood donation has health benefits: Reduces iron overload, stimulates new cell production, and gives you a mini health checkup!"
            ],
            locations: [
                "We have blood banks and donors across India. Allow location access to find the nearest ones!",
                "Use our Live Map feature to see nearby donors and blood banks in real-time."
            ],
            default: [
                "I'm not sure about that. You can ask me about: donation eligibility, thalassemia, blood types, emergency requests, or locations.",
                "That's interesting! Try asking about donation process, health benefits, or finding donors nearby."
            ]
        };
    }

    async sendMessage(message) {
        // Simulate thinking delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const lowerMessage = message.toLowerCase();
        
        // Intent matching
        if (this.containsAny(lowerMessage, ['hi', 'hello', 'hey', 'namaste'])) {
            return this.getRandomResponse('greetings');
        }
        
        if (this.containsAny(lowerMessage, ['donate', 'donation', 'donor'])) {
            return this.getRandomResponse('donation');
        }
        
        if (this.containsAny(lowerMessage, ['thalassemia', 'thalassaemia', 'patient'])) {
            return this.getRandomResponse('thalassemia');
        }
        
        if (this.containsAny(lowerMessage, ['eligible', 'eligibility', 'qualify', 'can i'])) {
            return this.getRandomResponse('eligibility');
        }
        
        if (this.containsAny(lowerMessage, ['emergency', 'urgent', 'asap', 'immediately'])) {
            return this.getRandomResponse('emergency');
        }
        
        if (this.containsAny(lowerMessage, ['blood type', 'blood group', 'a+', 'o-', 'ab+'])) {
            return this.getRandomResponse('bloodTypes');
        }
        
        if (this.containsAny(lowerMessage, ['benefit', 'advantage', 'why donate', 'good'])) {
            return this.getRandomResponse('benefits');
        }
        
        if (this.containsAny(lowerMessage, ['location', 'near', 'nearby', 'where', 'find'])) {
            return this.getRandomResponse('locations');
        }
        
        return this.getRandomResponse('default');
    }

    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getSuggestions() {
        return [
            "How to donate blood?",
            "Blood donation eligibility",
            "Find donors near me",
            "About Thalassemia",
            "Emergency blood request"
        ];
    }
}
