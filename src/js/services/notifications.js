/**
 * NOTIFICATION SERVICE
 * Toast notifications and alerts
 */

export class NotificationService {
    constructor() {
        this.queue = [];
        this.init();
    }

    init() {
        // Create notification container if doesn't exist
        if (!document.getElementById('notificationContainer')) {
            const container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icon}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const container = document.getElementById('notificationContainer');
        container.appendChild(notification);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.close(notification);
        });
        
        // Auto close
        setTimeout(() => {
            this.close(notification);
        }, duration);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }

    close(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }

    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    info(message, duration) {
        this.show(message, 'info', duration);
    }

    async requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }

    async sendBrowserNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/assets/icons/icon-192x192.png',
                badge: '/assets/icons/icon-96x96.png',
                ...options
            });
        }
    }
}
