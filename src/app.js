const API_KEY = 'a9f48491b0d849c2b43171310242911';
const BASE_URL = 'http://api.weatherapi.com/v1';

const searchBtn = document.getElementById("searchBtn");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const cityInput = document.getElementById("cityInput");
const weatherContainer = document.getElementById("weatherContainer");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const weatherCondition = document.getElementById("weatherCondition");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const errorMessage = document.getElementById("errorMessage");
const forecastContainer = document.getElementById("forecastContainer"); 

//fetch regular weather data
const fetchWeather = async (city) => {
    try {
        const response = await fetch(
            `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`
        );

        if (!response.ok) {
            throw new Error("City not found or invalid API key.");
        }

        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        showError(error.message);
    }
};

//current location fetch data
const fetchCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            const locationQuery = `${latitude},${longitude}`;
            fetchWeather(locationQuery);
            fetchExtendedForecast(locationQuery);
        },
        (error) => {
            showError("Unable to retrieve your location.");
        }
    );
};

//regular data UI
const updateWeatherUI = (data) => {
    errorMessage.classList.add("hidden");
    weatherContainer.classList.remove("hidden");
    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    weatherIcon.src = `https:${data.current.condition.icon}`;
    weatherCondition.textContent = data.current.condition.text;
    temperature.textContent = `Temperature: ${data.current.temp_c}°C`;
    humidity.textContent = `Humidity: ${data.current.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.current.wind_kph} km/h`;
};

//5 day forecast UI
const updateForecastUI = (forecastDays) => {
    forecastContainer.classList.remove("hidden");

    forecastDays.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

        document.getElementById(`day${index + 1}Date`).textContent = dayName;
        document.getElementById(`day${index + 1}Icon`).src = `https:${day.day.condition.icon}`;
        document.getElementById(`day${index + 1}Temp`).textContent = `${day.day.avgtemp_c}°C`;
        document.getElementById(`day${index + 1}Condition`).textContent = day.day.condition.text;
        document.getElementById(`day${index + 1}Wind`).textContent = `Wind: ${day.day.maxwind_kph} km/h`;
    });
};

//error message
const showError = (message) => {
    weatherContainer.classList.add("hidden");
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
};

//event listener
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        fetchExtendedForecast(city);
    } else {
        showError("Please enter a valid city name.");
    }
});

currentLocationBtn.addEventListener("click", fetchCurrentLocationWeather);

//fetch 5day forecast data
const fetchExtendedForecast = async (city) => {
    try {
        const response = await fetch(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch forecast data.");
        }

        const data = await response.json();
        updateForecastUI(data.forecast.forecastday);
    } catch (error) {
        showError(error.message);
    }
};
