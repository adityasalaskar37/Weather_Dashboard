async function getWeather(city) {
    const apiKey = '9520a6aa281a015b42ed4839d10163ee';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === 200) {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            const icon = data.weather[0].icon;

            const date = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);

            document.getElementById('weather-icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">`;
            document.getElementById('temperature').textContent = `${temperature}°C`;
            document.getElementById('description').textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
            document.getElementById('date').textContent = formattedDate;
            document.getElementById('searched-city').textContent = city;

            getWeatherForecast(city);
            getAdditionalWeatherInfo(city);
        } else {
            document.getElementById('temperature').textContent = `Error: ${data.message}`;
            document.getElementById('description').textContent = '';
            document.getElementById('date').textContent = '';
        }
    } catch (error) {
        document.getElementById('temperature').textContent = 'Error fetching the weather data.';
        document.getElementById('description').textContent = '';
        document.getElementById('date').textContent = '';
    }
}

async function getWeatherForecast(city) {
    const apiKey = '9520a6aa281a015b42ed4839d10163ee';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === '200') {
            const forecastData = data.list.filter((item) => item.dt_txt.includes('12:00:00'));
            forecastData.slice(0, 6).forEach((item, index) => {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                const temperature = item.main.temp;
                const icon = item.weather[0].icon;
                document.getElementById(`day-${index + 1}`).innerHTML = `
                    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
                    <span>${day}</span>
                    <span>${temperature}°C</span>
                `;
            });

            const today = new Date();
            forecastData.slice(0, 6).forEach((item, index) => {
                const date = new Date(today);
                date.setDate(today.getDate() + index + 1);
                const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                const temperature = item.main.temp;
                const icon = item.weather[0].icon;
                document.getElementById(`day-${index + 1}`).innerHTML = `
                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon" style="width: 100px; height: auto;"><br>
                <span style="font-size: 20px;">${temperature}°C</span><br>
                <span>${day}</span>
                `;
            });
        } else {
            console.error('Error fetching weather forecast:', data.message);
        }
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
    }
}

async function getAdditionalWeatherInfo(city) {
    const apiKey = '9520a6aa281a015b42ed4839d10163ee';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === 200) {
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US');
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US');
            const uvIndex = 'N/A'; // UV index might not be available in the current API response
            const airQualityIndex = 'N/A'; // Air quality index might not be available in the current API response
            const visibility = data.visibility;

            document.getElementById('humidity').textContent = `${humidity}%`;
            document.getElementById('wind-speed').textContent = `${windSpeed} m/s`;
            document.getElementById('sunrise').textContent = sunrise;
            document.getElementById('sunset').textContent = sunset;
            document.getElementById('uv-index').textContent = uvIndex;
            document.getElementById('air-quality-index').textContent = airQualityIndex;
            document.getElementById('visibility').textContent = `${visibility} meters`;
        } else {
            console.error('Error fetching additional weather info:', data.message);
        }
    } catch (error) {
        console.error('Error fetching additional weather info:', error);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        const city = document.getElementById('search-input').value;
        if (city.length >= 4) {
            getWeather(city);
        }
    }
}

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = '9520a6aa281a015b42ed4839d10163ee';
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.cod === 200) {
                    const city = data.name;
                    getWeather(city);
                } else {
                    document.getElementById('temperature').textContent = `Error: ${data.message}`;
                    document.getElementById('description').textContent = '';
                    document.getElementById('date').textContent = '';
                }
            } catch (error) {
                document.getElementById('temperature').textContent = 'Error fetching the weather data.';
                document.getElementById('description').textContent = '';
                document.getElementById('date').textContent = '';
            }
        });
    } else {
        document.getElementById('temperature').textContent = 'Geolocation is not supported by this browser.';
        document.getElementById('description').textContent = '';
        document.getElementById('date').textContent = '';
    }
}

getCurrentLocationWeather();
