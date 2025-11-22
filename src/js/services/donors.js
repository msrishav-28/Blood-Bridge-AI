/**
 * DONOR SERVICE
 * Donor management and operations
 */

import { Utils } from '../utils.js';

export class DonorService {
    constructor() {
        this.donors = [];
        this.apiUrl = '/api/donors'; // Mock API
    }

    async getDonors() {
        // Simulate API call
        await Utils.delay(500);
        
        // Mock data
        return [
            {
                id: 'D001',
                name: 'Rajesh Kumar',
                bloodType: 'O+',
                location: 'Delhi',
                avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=1FB8CD&color=fff',
                available: true,
                donations: 12,
                lastDonation: '2 months ago',
                phone: '+91 98765 43210',
                email: 'rajesh@example.com',
                coordinates: { lat: 28.7041, lng: 77.1025 }
            },
            {
                id: 'D002',
                name: 'Priya Sharma',
                bloodType: 'A+',
                location: 'Mumbai',
                avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=EF4444&color=fff',
                available: true,
                donations: 8,
                lastDonation: '1 month ago',
                phone: '+91 98765 43211',
                email: 'priya@example.com',
                coordinates: { lat: 19.0760, lng: 72.8777 }
            },
            {
                id: 'D003',
                name: 'Amit Patel',
                bloodType: 'B+',
                location: 'Bangalore',
                avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=10B981&color=fff',
                available: false,
                donations: 15,
                lastDonation: '3 weeks ago',
                phone: '+91 98765 43212',
                email: 'amit@example.com',
                coordinates: { lat: 12.9716, lng: 77.5946 }
            },
            {
                id: 'D004',
                name: 'Sneha Reddy',
                bloodType: 'AB+',
                location: 'Hyderabad',
                avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=F59E0B&color=fff',
                available: true,
                donations: 5,
                lastDonation: '6 months ago',
                phone: '+91 98765 43213',
                email: 'sneha@example.com',
                coordinates: { lat: 17.3850, lng: 78.4867 }
            },
            {
                id: 'D005',
                name: 'Vikram Singh',
                bloodType: 'O-',
                location: 'Chennai',
                avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=8B5CF6&color=fff',
                available: true,
                donations: 20,
                lastDonation: '1 month ago',
                phone: '+91 98765 43214',
                email: 'vikram@example.com',
                coordinates: { lat: 13.0827, lng: 80.2707 }
            },
            {
                id: 'D006',
                name: 'Ananya Iyer',
                bloodType: 'A-',
                location: 'Pune',
                avatar: 'https://ui-avatars.com/api/?name=Ananya+Iyer&background=EC4899&color=fff',
                available: true,
                donations: 7,
                lastDonation: '2 months ago',
                phone: '+91 98765 43215',
                email: 'ananya@example.com',
                coordinates: { lat: 18.5204, lng: 73.8567 }
            }
        ];
    }

    async getDonorById(id) {
        const donors = await this.getDonors();
        return donors.find(d => d.id === id);
    }

    async registerDonor(formData) {
        // Simulate API call
        await Utils.delay(1500);
        
        const donor = {
            id: Utils.generateId(),
            name: formData.get('name'),
            bloodType: formData.get('bloodType'),
            location: formData.get('location'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            age: formData.get('age'),
            weight: formData.get('weight'),
            lastDonation: formData.get('lastDonation'),
            medicalConditions: formData.get('medicalConditions'),
            available: true,
            donations: 0,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.get('name'))}&background=1FB8CD&color=fff`,
            coordinates: { lat: 0, lng: 0 }
        };
        
        return donor;
    }

    async searchDonors(query) {
        const donors = await this.getDonors();
        
        if (!query) return donors;
        
        const lowerQuery = query.toLowerCase();
        return donors.filter(donor => 
            donor.name.toLowerCase().includes(lowerQuery) ||
            donor.bloodType.toLowerCase().includes(lowerQuery) ||
            donor.location.toLowerCase().includes(lowerQuery)
        );
    }

    async filterDonors(filter) {
        const donors = await this.getDonors();
        
        switch (filter) {
            case 'all':
                return donors;
            case 'available':
                return donors.filter(d => d.available);
            case 'unavailable':
                return donors.filter(d => !d.available);
            case 'near':
                // Filter by proximity (mock)
                return donors.slice(0, 3);
            default:
                // Filter by blood type
                return donors.filter(d => d.bloodType === filter);
        }
    }

    async findNearbyDonors(bloodType, userLocation, radius = 10) {
        const donors = await this.getDonors();
        const compatible = Utils.getBloodTypeCompatibility(bloodType);
        
        return donors
            .filter(d => d.available && compatible.includes(d.bloodType))
            .map(d => ({
                ...d,
                distance: Utils.calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    d.coordinates.lat,
                    d.coordinates.lng
                )
            }))
            .filter(d => d.distance <= radius)
            .sort((a, b) => a.distance - b.distance);
    }

    async updateDonorAvailability(donorId, available) {
        // Simulate API call
        await Utils.delay(500);
        return { success: true };
    }

    async getDonorStatistics() {
        const donors = await this.getDonors();
        
        return {
            total: donors.length,
            available: donors.filter(d => d.available).length,
            byBloodType: donors.reduce((acc, donor) => {
                acc[donor.bloodType] = (acc[donor.bloodType] || 0) + 1;
                return acc;
            }, {}),
            totalDonations: donors.reduce((sum, d) => sum + d.donations, 0)
        };
    }
}
