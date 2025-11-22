/**
 * HEALTH & WELLNESS SERVICE
 * EHR integration, medication tracking, appointments, telemedicine
 */

import { Utils } from '../utils.js';

export class HealthService {
    constructor() {
        this.ehr = new EHRIntegration();
        this.medicationTracker = new MedicationTracker();
        this.appointmentScheduler = new AppointmentScheduler();
        this.telemedicine = new TelemedicineService();
        this.healthDashboard = new HealthDashboard();
        this.nutritionAdvisor = new NutritionAdvisor();
    }
}

/**
 * Electronic Health Records Integration
 */
class EHRIntegration {
    constructor() {
        this.connectedSystems = [];
    }

    async connectToEHR(systemType, credentials) {
        console.log(`🏥 Connecting to ${systemType} EHR system...`);
        
        const supportedSystems = ['EPIC', 'Cerner', 'Allscripts', 'HMIS'];
        
        if (!supportedSystems.includes(systemType)) {
            throw new Error('EHR system not supported');
        }
        
        // Simulated connection
        await Utils.delay(1500);
        
        return {
            connected: true,
            system: systemType,
            patientId: Utils.generateId(),
            lastSync: new Date().toISOString()
        };
    }

    async fetchPatientRecords(patientId) {
        await Utils.delay(1000);
        
        return {
            patientId,
            personalInfo: {
                name: 'Patient Name',
                age: 25,
                gender: 'Male',
                bloodType: 'B+'
            },
            medicalHistory: [
                { date: '2024-08-15', condition: 'Thalassemia Major', status: 'Ongoing' },
                { date: '2024-01-10', condition: 'Iron overload', status: 'Managed' }
            ],
            medications: [
                { name: 'Deferasirox', dosage: '500mg', frequency: 'Daily' },
                { name: 'Folic Acid', dosage: '5mg', frequency: 'Daily' }
            ],
            transfusionHistory: [
                { date: '2024-10-15', units: 2, bloodType: 'B+', location: 'AIIMS Delhi' },
                { date: '2024-09-01', units: 2, bloodType: 'B+', location: 'AIIMS Delhi' }
            ],
            labResults: {
                hemoglobin: 9.2,
                ferritin: 2500,
                lastUpdated: '2024-10-20'
            },
            allergies: ['Penicillin'],
            vaccinations: [
                { vaccine: 'Hepatitis B', date: '2024-01-05', status: 'Complete' }
            ]
        };
    }

    async syncRecords(patientId, records) {
        console.log('🔄 Syncing health records...');
        await Utils.delay(1000);
        
        return {
            success: true,
            recordsSynced: Object.keys(records).length,
            timestamp: new Date().toISOString()
        };
    }

    async shareRecords(patientId, recipientId, recordTypes) {
        // Secure record sharing with encryption
        return {
            shareId: Utils.generateId(),
            patient: patientId,
            recipient: recipientId,
            records: recordTypes,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            accessLink: `https://bloodbridge.in/share/${Utils.generateId()}`
        };
    }
}

/**
 * Medication Tracker for Thalassemia Patients
 */
class MedicationTracker {
    constructor() {
        this.medications = [];
    }

    async addMedication(medication) {
        const med = {
            id: Utils.generateId(),
            name: medication.name,
            dosage: medication.dosage,
            frequency: medication.frequency,
            startDate: medication.startDate,
            endDate: medication.endDate,
            reminders: medication.reminders || [],
            notes: medication.notes || '',
            createdAt: new Date().toISOString()
        };
        
        this.medications.push(med);
        
        // Schedule reminders
        if (med.reminders.length > 0) {
            await this.scheduleReminders(med);
        }
        
        return med;
    }

    async scheduleReminders(medication) {
        console.log(`⏰ Scheduling reminders for ${medication.name}`);
        
        medication.reminders.forEach(reminderTime => {
            // Would integrate with notification service
            console.log(`Reminder set for ${reminderTime}`);
        });
    }

    async getMedicationSchedule(date = new Date()) {
        const schedule = [];
        
        for (const med of this.medications) {
            const times = this.calculateDoseTimes(med.frequency);
            
            times.forEach(time => {
                schedule.push({
                    medication: med.name,
                    dosage: med.dosage,
                    time,
                    taken: false,
                    date: date.toISOString().split('T')[0]
                });
            });
        }
        
        return schedule.sort((a, b) => a.time.localeCompare(b.time));
    }

    calculateDoseTimes(frequency) {
        const times = [];
        
        switch (frequency.toLowerCase()) {
            case 'daily':
            case 'once daily':
                times.push('09:00');
                break;
            case 'twice daily':
                times.push('09:00', '21:00');
                break;
            case 'three times daily':
                times.push('08:00', '14:00', '20:00');
                break;
            case 'four times daily':
                times.push('06:00', '12:00', '18:00', '00:00');
                break;
        }
        
        return times;
    }

    async markAsTaken(medicationId, date, time) {
        console.log(`✅ Marked ${medicationId} as taken`);
        
        return {
            success: true,
            medication: medicationId,
            takenAt: new Date().toISOString(),
            adherence: await this.calculateAdherence(medicationId)
        };
    }

    async calculateAdherence(medicationId) {
        // Calculate medication adherence rate
        const totalDoses = 30; // Last 30 days
        const takenDoses = 27; // Mock data
        
        return {
            rate: ((takenDoses / totalDoses) * 100).toFixed(1) + '%',
            totalDoses,
            takenDoses,
            missedDoses: totalDoses - takenDoses,
            streak: 7 // 7 days streak
        };
    }

    async getInteractionWarnings(medications) {
        // Check drug interactions
        const interactions = [];
        
        // Simulated interaction checking
        if (medications.includes('Deferasirox') && medications.includes('Antacids')) {
            interactions.push({
                severity: 'moderate',
                drugs: ['Deferasirox', 'Antacids'],
                warning: 'Take at least 2 hours apart',
                recommendation: 'Avoid concurrent administration'
            });
        }
        
        return interactions;
    }
}

/**
 * Appointment Scheduler
 */
class AppointmentScheduler {
    constructor() {
        this.appointments = [];
    }

    async bookAppointment(appointmentData) {
        const appointment = {
            id: Utils.generateId(),
            type: appointmentData.type, // 'transfusion', 'checkup', 'consultation'
            patientId: appointmentData.patientId,
            doctorId: appointmentData.doctorId,
            facilityId: appointmentData.facilityId,
            date: appointmentData.date,
            time: appointmentData.time,
            duration: appointmentData.duration || 60,
            status: 'scheduled',
            notes: appointmentData.notes || '',
            createdAt: new Date().toISOString()
        };
        
        // Check availability
        const available = await this.checkAvailability(
            appointment.facilityId,
            appointment.date,
            appointment.time
        );
        
        if (!available) {
            throw new Error('Time slot not available');
        }
        
        this.appointments.push(appointment);
        
        // Send confirmation
        await this.sendConfirmation(appointment);
        
        return appointment;
    }

    async checkAvailability(facilityId, date, time) {
        // Check facility calendar
        await Utils.delay(500);
        return Math.random() > 0.3; // 70% chance available
    }

    async sendConfirmation(appointment) {
        console.log('📧 Sending appointment confirmation...');
        
        return {
            email: 'Sent',
            sms: 'Sent',
            whatsapp: 'Sent',
            calendar: 'Added to calendar'
        };
    }

    async getUpcomingAppointments(patientId) {
        const now = new Date();
        
        return this.appointments
            .filter(apt => apt.patientId === patientId)
            .filter(apt => new Date(apt.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    async rescheduleAppointment(appointmentId, newDate, newTime) {
        const apt = this.appointments.find(a => a.id === appointmentId);
        
        if (!apt) throw new Error('Appointment not found');
        
        const available = await this.checkAvailability(apt.facilityId, newDate, newTime);
        
        if (!available) throw new Error('New time slot not available');
        
        apt.date = newDate;
        apt.time = newTime;
        apt.status = 'rescheduled';
        
        await this.sendConfirmation(apt);
        
        return apt;
    }

    async cancelAppointment(appointmentId, reason) {
        const apt = this.appointments.find(a => a.id === appointmentId);
        
        if (!apt) throw new Error('Appointment not found');
        
        apt.status = 'cancelled';
        apt.cancellationReason = reason;
        apt.cancelledAt = new Date().toISOString();
        
        return {
            success: true,
            refundEligible: this.checkRefundEligibility(apt),
            cancellationFee: 0
        };
    }

    checkRefundEligibility(appointment) {
        const hoursUntil = (new Date(appointment.date) - new Date()) / (1000 * 60 * 60);
        return hoursUntil > 24; // Can cancel free if >24 hours away
    }

    async getAvailableSlots(facilityId, date) {
        // Return available time slots for a facility on a given date
        const slots = [];
        const startHour = 9;
        const endHour = 18;
        
        for (let hour = startHour; hour < endHour; hour++) {
            slots.push({
                time: `${hour.toString().padStart(2, '0')}:00`,
                available: Math.random() > 0.3,
                duration: 60
            });
            
            slots.push({
                time: `${hour.toString().padStart(2, '0')}:30`,
                available: Math.random() > 0.3,
                duration: 60
            });
        }
        
        return slots.filter(s => s.available);
    }
}

/**
 * Telemedicine Service
 */
class TelemedicineService {
    constructor() {
        this.consultations = [];
    }

    async startConsultation(patientId, doctorId) {
        const consultation = {
            id: Utils.generateId(),
            patientId,
            doctorId,
            startTime: new Date().toISOString(),
            status: 'in-progress',
            roomId: Utils.generateId(),
            type: 'video'
        };
        
        this.consultations.push(consultation);
        
        return {
            consultation,
            joinUrl: `https://bloodbridge.in/telemedicine/${consultation.roomId}`,
            waitingRoom: false
        };
    }

    async endConsultation(consultationId, summary) {
        const consult = this.consultations.find(c => c.id === consultationId);
        
        if (!consult) throw new Error('Consultation not found');
        
        consult.endTime = new Date().toISOString();
        consult.status = 'completed';
        consult.duration = Math.floor((new Date(consult.endTime) - new Date(consult.startTime)) / 60000);
        consult.summary = summary;
        
        // Generate prescription if needed
        if (summary.prescription) {
            consult.prescriptionId = await this.generatePrescription(summary.prescription);
        }
        
        return consult;
    }

    async generatePrescription(prescriptionData) {
        const prescription = {
            id: Utils.generateId(),
            medications: prescriptionData.medications,
            instructions: prescriptionData.instructions,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            digitalSignature: Utils.generateId()
        };
        
        return prescription.id;
    }

    async getDoctorAvailability(doctorId) {
        // Mock doctor availability
        return {
            today: ['14:00', '15:00', '16:00'],
            tomorrow: ['10:00', '11:00', '14:00', '15:00'],
            nextAvailable: '2024-11-02 14:00'
        };
    }
}

/**
 * Health Dashboard
 */
class HealthDashboard {
    constructor() {
        this.metrics = {};
    }

    async getPatientDashboard(patientId) {
        return {
            vitals: await this.getVitals(patientId),
            trends: await this.getTrends(patientId),
            alerts: await this.getAlerts(patientId),
            goals: await this.getHealthGoals(patientId),
            insights: await this.generateInsights(patientId)
        };
    }

    async getVitals(patientId) {
        return {
            hemoglobin: { value: 9.2, unit: 'g/dL', status: 'low', normal: '12-16' },
            ferritin: { value: 2500, unit: 'ng/mL', status: 'high', normal: '20-200' },
            heartRate: { value: 78, unit: 'bpm', status: 'normal', normal: '60-100' },
            bloodPressure: { value: '120/80', unit: 'mmHg', status: 'normal' },
            weight: { value: 62, unit: 'kg', trend: '+0.5kg this month' },
            lastUpdated: new Date().toISOString()
        };
    }

    async getTrends(patientId) {
        // 6-month trends
        return {
            hemoglobin: [8.9, 9.1, 9.0, 9.3, 9.2, 9.2],
            ferritin: [2600, 2550, 2500, 2480, 2490, 2500],
            transfusions: [2, 2, 2, 2, 2, 2],
            months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
        };
    }

    async getAlerts(patientId) {
        return [
            {
                type: 'transfusion',
                severity: 'medium',
                message: 'Next transfusion due in 5 days',
                action: 'Schedule appointment'
            },
            {
                type: 'medication',
                severity: 'high',
                message: 'Deferasirox running low (3 days left)',
                action: 'Refill prescription'
            }
        ];
    }

    async getHealthGoals(patientId) {
        return [
            {
                goal: 'Maintain hemoglobin above 9 g/dL',
                current: 9.2,
                target: 9.5,
                progress: 73,
                status: 'on-track'
            },
            {
                goal: 'Reduce ferritin below 2000',
                current: 2500,
                target: 1800,
                progress: 40,
                status: 'needs-attention'
            }
        ];
    }

    async generateInsights(patientId) {
        return [
            'Your hemoglobin levels are stable. Keep up the regular transfusions!',
            'Consider increasing iron chelation therapy to reduce ferritin levels',
            'You\'ve maintained 95% medication adherence this month. Excellent!',
            'Schedule a consultation to discuss ferritin management'
        ];
    }
}

/**
 * Nutrition Advisor
 */
class NutritionAdvisor {
    constructor() {
        this.mealPlans = [];
    }

    async getRecommendations(userProfile) {
        const isDonor = userProfile.type === 'donor';
        const isPatient = userProfile.type === 'patient';
        
        if (isDonor) {
            return this.getDonorNutrition();
        } else if (isPatient) {
            return this.getThalassemiaNutrition();
        }
        
        return this.getGeneralNutrition();
    }

    getDonorNutrition() {
        return {
            beforeDonation: [
                'Drink 16oz water 2 hours before donation',
                'Eat iron-rich foods: spinach, red meat, lentils',
                'Avoid fatty foods on donation day',
                'Get good sleep night before'
            ],
            afterDonation: [
                'Drink plenty of fluids (water, juice)',
                'Eat iron-rich snacks',
                'Avoid strenuous exercise for 24 hours',
                'Continue iron supplements if prescribed'
            ],
            ironRichFoods: [
                { food: 'Spinach', iron: '2.7mg per 100g', serving: '1 cup cooked' },
                { food: 'Red meat', iron: '2.6mg per 100g', serving: '100g' },
                { food: 'Lentils', iron: '3.3mg per 100g', serving: '1 cup cooked' },
                { food: 'Tofu', iron: '5.4mg per 100g', serving: '100g' }
            ],
            vitaminC: 'Increases iron absorption - consume with citrus fruits',
            avoid: ['Tea/coffee with meals (reduces iron absorption)', 'Calcium supplements with iron']
        };
    }

    getThalassemiaNutrition() {
        return {
            overview: 'Thalassemia patients need LOW iron diet due to transfusions',
            avoid: [
                'Iron-fortified cereals and bread',
                'Red meat (limit to once per week)',
                'Iron supplements (unless prescribed)',
                'Vitamin C supplements (enhances iron absorption)'
            ],
            recommended: [
                'Calcium-rich foods (dairy, leafy greens)',
                'Vitamin D foods (fatty fish, fortified dairy)',
                'Folic acid (leafy greens, legumes)',
                'Antioxidants (berries, green tea)',
                'Zinc-rich foods (nuts, seeds, whole grains)'
            ],
            mealPlan: {
                breakfast: 'Oatmeal with berries and almond milk',
                lunch: 'Grilled chicken with quinoa and vegetables',
                dinner: 'Baked fish with brown rice and broccoli',
                snacks: ['Greek yogurt', 'Mixed nuts', 'Apple slices', 'Hummus with veggies']
            },
            hydration: 'Drink 8-10 glasses of water daily',
            supplements: [
                { name: 'Folic Acid', dosage: '1-5mg daily', reason: 'Support red blood cell production' },
                { name: 'Vitamin D', dosage: '1000 IU daily', reason: 'Bone health' },
                { name: 'Calcium', dosage: '1000mg daily', reason: 'Prevent osteoporosis' }
            ]
        };
    }

    getGeneralNutrition() {
        return {
            balanced: 'Follow a balanced diet with variety',
            hydration: 'Drink adequate water daily',
            exercise: 'Regular physical activity recommended'
        };
    }

    async createMealPlan(userProfile, days = 7) {
        const mealPlan = [];
        
        for (let day = 0; day < days; day++) {
            const date = new Date();
            date.setDate(date.getDate() + day);
            
            mealPlan.push({
                date: date.toISOString().split('T')[0],
                meals: this.generateDailyMeals(userProfile)
            });
        }
        
        return mealPlan;
    }

    generateDailyMeals(userProfile) {
        // Simplified meal generation
        return {
            breakfast: { meal: 'Oatmeal with fruits', calories: 350, protein: 12 },
            lunch: { meal: 'Grilled chicken salad', calories: 450, protein: 35 },
            dinner: { meal: 'Baked fish with vegetables', calories: 500, protein: 40 },
            snacks: [
                { meal: 'Greek yogurt', calories: 150, protein: 15 },
                { meal: 'Mixed nuts', calories: 180, protein: 6 }
            ],
            total: { calories: 1630, protein: 108 }
        };
    }
}

export { HealthService, EHRIntegration, MedicationTracker, AppointmentScheduler, TelemedicineService, HealthDashboard, NutritionAdvisor };
