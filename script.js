document.getElementById('weather-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const location = document.getElementById('location-input').value.trim();
    if (!location) return;

    // Hide previous results and errors
    document.getElementById('weather-display').classList.add('d-none');
    document.getElementById('error-message').classList.add('d-none');

    // Geocoding API (City → Latitude & Longitude)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;

    fetch(geoUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch location data.');
            }
            return response.json();
        })
        .then(geoData => {
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error('Location not found. Please try another city.');
            }

            const place = geoData.results[0];
            const latitude = place.latitude;
            const longitude = place.longitude;
            const cityName = place.name;
            const country = place.country;

            // Weather API (Current Weather)
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

            return fetch(weatherUrl).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data.');
                }
                return response.json().then(weatherData => ({
                    weatherData,
                    cityName,
                    country
                }));
            });
        })
        .then(({ weatherData, cityName, country }) => {
            const current = weatherData.current_weather;

            document.getElementById('location-name').textContent = `${cityName}, ${country}`;
            document.getElementById('temperature').textContent = `${Math.round(current.temperature)}°C`;
            document.getElementById('weather-description').textContent =
                getWeatherDescription(current.weathercode);
            

            document.getElementById('weather-display').classList.remove('d-none');
        })
        .catch(error => {
            document.getElementById('error-message').textContent =
                error.message || 'Something went wrong. Please try again.';
            document.getElementById('error-message').classList.remove('d-none');
        });
});

//  Weather Code  Description
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky ☀️',
        1: 'Mainly clear 🌤️',
        2: 'Partly cloudy ⛅',
        3: 'Overcast ☁️',
        45: 'Fog 🌫️',
        48: 'Depositing rime fog 🌫️',
        51: 'Light drizzle 🌦️',
        53: 'Moderate drizzle 🌦️',
        55: 'Dense drizzle 🌧️',
        61: 'Slight rain 🌧️',
        63: 'Moderate rain 🌧️',
        65: 'Heavy rain 🌧️',
        71: 'Slight snow ❄️',
        73: 'Moderate snow ❄️',
        75: 'Heavy snow ❄️',
        80: 'Rain showers 🌦️',
        95: 'Thunderstorm ⛈️'
    };

    return weatherCodes[code] || 'Unknown weather condition 🌈';
}

    


