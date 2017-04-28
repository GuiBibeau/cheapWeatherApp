(function() {
  const DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  const DARKSKY_API_KEY = '8cf6a54d8de9c0cb77dae5efd6ce1383';
  const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  const BING_NEWS_API= '7d6fc5eaddd04355ba97c8f8a06c6add ';

  const GOOGLE_MAPS_API_KEY = 'AIzaSyArY-l-IItGJ6vzulp5bxn1eelLesCAxEQ';
  const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

  let getWeather = (coords) => {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si`;
 // {data.currently, data.daily}
    return (
      fetch(url)
      .then(response => response.json())
      .then(data => ({
        current: data.currently,
        summary: data.daily.summary,
        future: [
          data.daily.data[1],
          data.daily.data[2],
          data.daily.data[3],
          data.daily.data[4],
          data.daily.data[5]
        ]
      })
    ))
  }



  let forecastToHtml = (forecast) => (
    `<div class="seperation">
      <div class="day">
        <p> ${transform[new Date(forecast.time * 1000).getDay()]} </p>
      </div>
      <div class="degrees">
        ${transform[forecast.icon]}
        <h3>Min: ${forecast.temperatureMin}°C <br> Max: ${forecast.temperatureMax}°C</h3>
      </div>
      <div class="summary"><h2>${forecast.summary}</h2></div>
    </div>`
  )



  let getCoordinatesForCity = (cityName) => {
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data.results[0].geometry.location)
    );
  }

  var app = document.querySelector('#app');
  var cityForm = app.querySelector('.city-form');
  var cityInput = cityForm.querySelector('.city-input');
  var getWeatherButton = cityForm.querySelector('.get-weather-button');
  var cityWeather = app.querySelector('.city-weather');

  var transform = {}
  transform['clear-day'] = `<img src="icons/sun.svg" style="width:50px">`
  transform['clear-night'] = `<img src="icons/moon.svg" style="width:50px">`
  transform['rain'] = `<img src="icons/rain-2.svg" style="width:50px">`
  transform['snow'] = `<img src="icons/snowflake.svg" style="width:50px">`
  transform['leet'] = `<img src="icons/rain-3.svg" style="width:50px">`
  transform['wind'] = `<img src="icons/wind-2.svg" style="width:50px">`
  transform['fog'] = `<img src="icons/cloudy.svg" style="width:50px">`
  transform['cloudy'] = `<img src="icons/hurricane.svg" style="width:50px">`
  transform['partly-cloudy-day'] = `<img src="icons/cloudy-day.svg" style="width:50px">`
  transform['partly-cloudy-night'] = `<img src="icons/rain.svg" style="width:50px">`
  transform[0] = `Sunday`
  transform[1] = `Monday`
  transform[2] = `Tuesday`
  transform[3] = `Wednesday`
  transform[4] = `Thursday`
  transform[5] = `Friday`
  transform[6] = `Saturday`


  cityForm.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent the form from submitting

    var city = cityInput.value;
    cityWeather.innerHTML = '<img src="icons/hurricane.svg" style="width:50px">'
    getCoordinatesForCity(city)
    .then(getWeather)
    .then(weather => {
      cityWeather.innerHTML = `
          <div class="seperation">
          <div class="day"><p>today</p></div>
            <div class="degrees"> ${transform[weather.current.icon]}<h3> Currently: ${weather.current.temperature} °C </h3>
            </div>
          <div class="summary"><h2>${weather.summary}</h2></div>
          </div>
          <br>

          ${weather.future.map(forecastToHtml)}
            `;
    })
  });
})();
