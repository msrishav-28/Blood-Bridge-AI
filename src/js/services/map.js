/**
 * MAP SERVICE
 * Interactive map with Leaflet
 */

export class MapService {
    constructor() {
        this.map = null;
        this.markers = [];
    }

    async init(containerId) {
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet library not loaded');
            return;
        }
        
        // Initialize map centered on India
        this.map = L.map(containerId).setView([20.5937, 78.9629], 5);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);
    }

    async loadDonors(donors) {
        // Clear existing markers
        this.clearMarkers();
        
        // Add markers for each donor
        donors.forEach(donor => {
            const marker = L.marker([donor.coordinates.lat, donor.coordinates.lng])
                .bindPopup(`
                    <div class="map-popup">
                        <h4>${donor.name}</h4>
                        <p><strong>Blood Type:</strong> ${donor.bloodType}</p>
                        <p><strong>Location:</strong> ${donor.location}</p>
                        <p><strong>Status:</strong> ${donor.available ? 'Available' : 'Unavailable'}</p>
                        <button class="btn-primary btn-sm" onclick="app.contactDonor('${donor.id}')">
                            Contact
                        </button>
                    </div>
                `)
                .addTo(this.map);
            
            this.markers.push(marker);
        });
    }

    clearMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    }

    centerOn(lat, lng, zoom = 13) {
        this.map.setView([lat, lng], zoom);
    }

    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }),
                    error => reject(error)
                );
            } else {
                reject(new Error('Geolocation not supported'));
            }
        });
    }

    addUserMarker(lat, lng) {
        const userIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
        
        return L.marker([lat, lng], { icon: userIcon })
            .bindPopup('You are here')
            .addTo(this.map);
    }

    drawRadius(lat, lng, radiusKm) {
        return L.circle([lat, lng], {
            color: '#1FB8CD',
            fillColor: '#1FB8CD',
            fillOpacity: 0.1,
            radius: radiusKm * 1000
        }).addTo(this.map);
    }
}
