/**
 * STATE MANAGER
 * Centralized state management with reactivity
 */

export class StateManager {
    constructor() {
        this.state = {
            user: null,
            donors: [],
            patients: [],
            urgentRequests: [],
            stats: {},
            theme: 'light',
            language: 'en'
        };
        
        this.listeners = new Map();
    }

    get(key) {
        return this.state[key];
    }

    set(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        this.notify(key, value, oldValue);
    }

    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    notify(key, newValue, oldValue) {
        const callbacks = this.listeners.get(key) || [];
        callbacks.forEach(callback => callback(newValue, oldValue));
    }

    reset() {
        this.state = {
            user: null,
            donors: [],
            patients: [],
            urgentRequests: [],
            stats: {},
            theme: 'light',
            language: 'en'
        };
    }
}
