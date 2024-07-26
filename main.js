document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'at_jcZs1sRJ9jnAKt2sNXe4m2CFUTZMn'; // Remplacez par votre clé API IPify
    const apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=`;

    const inputField = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');
    const ipAddressDisplay = document.querySelector('.ip-address');
    const locationDisplay = document.querySelector('.location');
    const timezoneDisplay = document.querySelector('.timezone');
    const ispDisplay = document.querySelector('.isp');
    const mapDiv = document.getElementById('map');

    let map;

    function initializeMap(lat, lng) {
        if (!map) {
            map = L.map(mapDiv).setView([lat, lng], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
        } else {
            map.setView([lat, lng], 13);
        }

        const customIcon = L.icon({
            iconUrl: 'images/icon-location.svg',
            iconSize: [38, 50],
            iconAnchor: [19, 50],
            popupAnchor: [0, -50]
        });

        L.marker([lat, lng], { icon: customIcon }).addTo(map)
            .bindPopup('Location')
            .openPopup();
    }

    async function fetchIPData(ip = '') {
        try {
            const response = await fetch(apiUrl + ip);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            updateDisplay(data);
            initializeMap(data.location.lat, data.location.lng);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            ipAddressDisplay.textContent = 'Not Found';
            locationDisplay.textContent = 'Not Found';
            timezoneDisplay.textContent = 'Not Found';
            ispDisplay.textContent = 'Not Found';
            // Afficher un message d'alerte si nécessaire
            alert('Error fetching IP data. Please check the IP address and try again.');
        }
    }

    // Fonction pour mettre à jour l'affichage avec les données de l'API
    function updateDisplay(data) {
        ipAddressDisplay.textContent = data.ip || 'Not Found';
        locationDisplay.textContent = `${data.location.city || 'Not Found'}, ${data.location.region || 'Not Found'}, ${data.location.country || 'Not Found'}`;
        timezoneDisplay.textContent = `UTC ${data.location.timezone || 'Not Found'}`;
        ispDisplay.textContent = data.isp || 'Not Found'; // Affiche "Not Found" si l'ISP est absent
    }

    // Initialiser avec l'IP 192.212.174.101
    fetchIPData('192.212.174.101');

    // Ajouter un gestionnaire d'événement pour le bouton de recherche
    searchButton.addEventListener('click', () => {
        const input = inputField.value;
        if (input) {
            fetchIPData(input);
        }
    });

    // Optionnel : Vous pouvez ajouter un événement pour déclencher la recherche en appuyant sur "Entrée"
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
});
