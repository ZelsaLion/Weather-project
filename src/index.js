function formatDate(timestamp) {
  let currentDate = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentDate.getDay()];
  let hours = currentDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let date = currentDate.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[currentDate.getMonth()];
  let year = currentDate.getFullYear();

  return `${day} ${hours}:${minutes} <br /> ${date} ${month} ${year}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function displayForecast(response) {
  let forcast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forcast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
      <div class="weather-forecast-date">
          ${formatDay(forecastDay.dt)}
          </div>
          <br />
          <img src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" />
          <br />
          <span class="weather-forecast-max">
            ${Math.round(forecastDay.temp.max)}° /</span>
          <span class="weather-forecast-min"> ${Math.round(
            forecastDay.temp.min
          )}°</span>
          </div>`;
    }
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
  });
}

function getForecast(coordinates) {
  let apiKey = "9a12b220bc61ecb349edaa8a3b325540";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  document.querySelector("#city").innerHTML = response.data.name;

  celsiusTemperature = response.data.main.temp;

  document.querySelector("#temperature").innerHTML = `${Math.round(
    celsiusTemperature
  )}`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(
    response.data.wind.speed
  )} km/h`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let mainIcon = document.querySelector("#icon");
  mainIcon.setAttribute(
    `src`,
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}

function searchCity(city) {
  let units = "metric";
  let apiKey = "9a12b220bc61ecb349edaa8a3b325540";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityElement = document.querySelector("#city-input").value;
  searchCity(cityElement);
}

function searchPosition(position) {
  let apiKey = "9a12b220bc61ecb349edaa8a3b325540";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchPosition);
}

function showFahrenheit(fahrenheit) {
  fahrenheit.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelsius(celsius) {
  celsius.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", getCurrentPosition);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsius);

searchCity("Sofia");
