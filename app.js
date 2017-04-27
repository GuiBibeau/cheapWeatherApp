(function() {
  const DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  const DARKSKY_API_KEY = '8cf6a54d8de9c0cb77dae5efd6ce1383';
  const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  const GOOGLE_MAPS_API_KEY = 'AIzaSyArY-l-IItGJ6vzulp5bxn1eelLesCAxEQ';
  const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

  let getWeather = (coords) => {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si`;
 // {data.currently, data.daily}
    return (
      fetch(url)
      .then(response => response.json())
      .then(data => [data.currently,
                     data.daily.data[0],
                     data.daily.data[1],
                     data.daily.data[2],
                     data.daily.data[3],
                     data.daily.data[4]
       ])
    );
  }



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
  transform[0] = `Monday`
  transform[1] = `Tuesday`
  transform[2] = `Wednesday`
  transform[3] = `Thursday`
  transform[4] = `Friday`
  transform[5] = `Saturday`
  transform[6] = `Sunday`

  cityForm.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent the form from submitting

    var city = cityInput.value;
    cityWeather.innerText = 'loading'
    getCoordinatesForCity(city)
    .then(getWeather)
    .then(weather => {
      console.log (weather)
      date = [ new Date(weather[0].time * 1000), new Date(weather[1].time * 1000)]
      console.log(transform[new Date(weather[0].time * 1000).getDay()])
      cityWeather.innerHTML = `
          <div class="seperation">
          <div class="day"><p>today</p></div>
            <div class="degrees"> ${transform[weather[0].icon]}<h3> Currently: ${weather[0].temperature} °C</h3></div>
          </div>
          <div class="seperation">
        <div class="day"><p>${transform[new Date(weather[1].time * 1000).getDay()]}</p></div>
            <div class="degrees">${transform[weather[1].icon]}<h3>Min: ${weather[1].temperatureMin}°C <br> Max: ${weather[1].temperatureMax}°C</h3></div>
          </div>
          <div class="seperation">
          <div class="day"><p>${transform[new Date(weather[2].time * 1000).getDay()]}</p></div>
            <div class="degrees"> ${transform[weather[2].icon]}<h3>Min: ${weather[2].temperatureMin}°C <br> Max: ${weather[2].temperatureMax}°C</h3></div>
          </div>
          <div class="seperation">
          <div class="day"><p>${transform[new Date(weather[3].time * 1000).getDay()]}</p></div>
            <div class="degrees"> ${transform[weather[3].icon]}<h3>Min: ${weather[3].temperatureMin}°C <br> Max: ${weather[3].temperatureMax}°C</h3></div>
          </div>
          <div class="seperation">
          <div class="day"><p>${transform[new Date(weather[4].time * 1000).getDay()]}</p></div>
          <div class="degrees"> ${transform[weather[4].icon]}<h3>Min: ${weather[4].temperatureMin}°C <br> Max: ${weather[4].temperatureMax}°C</h3></div>
          </div>
             `;
    })
  });
})();
