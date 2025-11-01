/**
 * UTILITY FUNCTIONS
 * Common helper functions
 */

export class Utils {
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-IN', options);
    }

    static formatTime(date) {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleTimeString('en-IN', options);
    }

    static formatNumber(num) {
        return num.toLocaleString('en-IN');
    }

    static generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[6-9]\d{9}$/;
        return re.test(phone);
    }

    static validatePincode(pincode) {
        const re = /^[1-9][0-9]{5}$/;
        return re.test(pincode);
    }

    static getBloodTypeCompatibility(bloodType) {
        const compatibility = {
            'A+': ['A+', 'A-', 'O+', 'O-'],
            'A-': ['A-', 'O-'],
            'B+': ['B+', 'B-', 'O+', 'O-'],
            'B-': ['B-', 'O-'],
            'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            'AB-': ['A-', 'B-', 'AB-', 'O-'],
            'O+': ['O+', 'O-'],
            'O-': ['O-']
        };
        return compatibility[bloodType] || [];
    }

    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    static getRelativeTime(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diff = now - past;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    static sanitizeInput(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    static copyToClipboard(text) {
        return navigator.clipboard.writeText(text);
    }

    static downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    static downloadCSV(data, filename) {
        const csv = this.arrayToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    static arrayToCSV(data) {
        if (!data.length) return '';
        const headers = Object.keys(data[0]);
        const rows = data.map(row => headers.map(header => row[header]).join(','));
        return [headers.join(','), ...rows].join('\n');
    }

    static parseCSV(csv) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        return lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
                obj[header.trim()] = values[index]?.trim();
                return obj;
            }, {});
        });
    }
}
