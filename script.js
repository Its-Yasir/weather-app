//! 📦 Import required helper functions from funs.js
import { getCurrentTime, getTimeByLatLon, getCurrentLocation, selectDaysForForcast, renderForecast, toSlug, formatTime } from "./funs.js";

//! 🌍 Variables for storing weather data and state
let lat, 
    lon,
    forcastDaysValue = 7,
    result,
    city = 'lahore',
    country = 'Pakistan',
    weather = 'Heavy Rain',
    temperature = 24,
    uv = 5.1,
    humidity = 58,
    airSpeed = '18 kph',
    heat = 37,
    time = '6:43 PM',
    buttons = [],
    chart = null;
export let summaryFor = 'rain'; //! Which summary to show by default

//! ⚙️ Fetch API options
const options = {
  method: 'GET'
};

//! ❌ Error handler if location access fails
function error() {
  alert("Unable to retrieve your location. Please allow location access.");
}

/*! 🌦 Fetches the current weather data for a city and updates the UI */
export async function fetchCurrentWeather(cityParam) {
  const url = `https://api.weatherapi.com/v1/current.json?key=b19bdbbf07a84cba965153941251108&q=${cityParam}`;
  
  try {
    //! 🌐 Make API request
    const response = await fetch(url, options);
    result = await response.json();
    console.log(result);

    //! 🏙 Store basic location info
    city = result.location.name;
    country = result.location.country;

    //! 🌡 Extract main weather metrics
    temperature = parseInt(result.current.temp_c);
    uv = result.current.uv;
    humidity = result.current.humidity;
    airSpeed = result.current.wind_kph;
    heat = result.current.heatindex_c;
    weather = result.current.condition.text;

    //! 🖼 Update DOM with fetched data
    document.querySelector('.current').textContent = `${city}, ${country}`;
    document.querySelector('.temp-value').textContent = temperature;
    document.querySelector('.weather-condition-js').textContent = weather;
    document.querySelector('.uv-value').textContent = uv;
    document.querySelector('.heat-value').textContent = heat;
    document.querySelector('.humidity-value').textContent = humidity;
    document.querySelector('.wind-value').textContent = airSpeed;

    //! 🌙 Show custom icon for clear night
    if (result.current.condition.icon !== '//cdn.weatherapi.com/weather/64x64/night/113.png') {
      document.querySelector('.current-weather-img').src = `${result.current.condition.icon}`;
    } else {
      document.querySelector('.current-weather-img').src = `https://maps.gstatic.com/weather/v1/clear.svg`;
    }

    //! 📍 Save coordinates
    lat = result.location.lat;
    lon = result.location.lon;

    //! ⏰ Format and show local time
    let time = await formatTime(result.location.localtime);
    document.querySelector('.time').textContent = time;

    //! 🗺 Generate static map image for location
    let mapWidth = document.querySelector('.map-box').clientWidth;
    let mapHeight = document.querySelector('.map-box').clientHeight;
    const mapUrl = `https://maps.locationiq.com/v3/staticmap?key=pk.1da9136f8ec6ed1f78714e47b665667b&center=${lat},${lon}&zoom=10&size=${mapWidth}x${mapHeight}&format=png&maptype=streets&markers=icon:https://locationiq.com/static/img/marker.png|${lat},${lon}`;
    document.querySelector('.map-box').style.background = `url('${mapUrl}')`;

    //! 📊 Prepare forecast data for summary chart
    let forcastDataForSummary = [[], []];
    let rainPercentage = forcastDataForSummary[0];
    let tempPercentage = forcastDataForSummary[1];

    //! Fetch forecast for 1 day (hourly data)
    let forcastForGraph = await fetchForecast(city, 1);
    forcastForGraph.forecast.forecastday[0].hour.forEach((hourData, index) => {
      if (index % 2 !== 0) { //! Only take every second hour for cleaner chart
        rainPercentage.push(`${hourData.chance_of_rain}`);
        tempPercentage.push(`${parseInt(hourData.temp_c)}`);
      }
    });

    //! 📈 Show either Rain or Temperature chart based on summaryFor
    if (summaryFor === 'rain') {
      generateChart(rainPercentage, 'Chances of Rain', '%');
    } else {
      generateChart(tempPercentage, 'Temperature in Celcius', 'C');
    }

    //! ✅ Return essential location info
    return {
      city: result.location.name,
      country: result.location.country,
      lat: result.location.lat,
      lon: result.location.lon
    };
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

//! 🌟 Initial default call for Gujrat
await fetchCurrentWeather(city);

//! 🗓 Render forecast based on default days
if (forcastDaysValue === 10) {
  buttons = await renderForecast('gujrat', 10);
} else {
  buttons = await renderForecast('gujrat', 7);
}

/*! 📊 Generates a temperature or rain chart using Chart.js */
export function generateChart(array, head, deg) {
  const ctx = document.getElementById('temperatureChart').getContext('2d');

  //! Destroy old chart before creating new one
  if (chart) chart.destroy();

  document.getElementById('temperatureChart').width = array.length * 100;

  //! Example labels (time slots)
  const labels = ['1 AM', '3 AM', '5 AM', '7 AM', '9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '8 PM', '10 PM', '12 PM'];

  //! 🎨 Create gradient fill for chart
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(39, 158, 255, 0.98)');
  gradient.addColorStop(1, 'rgba(102, 99, 255, 0)');

  //! 📈 Create chart
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: array,
        fill: true,
        backgroundColor: gradient,
        borderColor: 'rgba(0, 145, 255, 1)',
        tension: 0.3,
        pointBackgroundColor: '#0073ffff',
        pointBorderColor: 'rgba(0, 8, 255, 0)',
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          align: 'top',
          anchor: 'end',
          color: '#fff',
          font: { family: 'Poppins', size: 16, weight: 'bold' },
          formatter: (value) => `${value}${deg}`
        }
      },
      scales: {
        x: {
          ticks: { color: '#ffffff', font: { family: 'Poppins', size: 14, weight: '600' } },
          grid: { display: false },
          title: { display: true, text: 'Time (Hourly)', color: '#ffffff', font: { family: 'Poppins', size: 16, weight: 'bold' } }
        },
        y: {
          grid: { display: false },
          ticks: { display: false },
          title: { display: true, text: `${head}`, color: '#fff', font: { family: 'Poppins', size: 16, weight: 'normal' } },
          grace: '10%'
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

/*! 🌆 City selection buttons - fetches data for selected city */
const cities = ['lahore', 'islamabad', 'karachi', 'hafizabad', 'istanbul'];

cities.forEach(city => {
  document.querySelector(`.check-city-weather-${city}`).addEventListener('click', async () => {
    await fetchCurrentWeather(city);
    buttons = await renderForecast(city, document.querySelector('.days7').classList.contains('active-forcast-day-selector') ? 7 : 10);
  });
});


//! ... Similar event listeners for other cities (Karachi, Islamabad, Hafizabad, Istanbul)

document.querySelector('.your-location').addEventListener('click', async () => {
  city = await getCurrentLocation();
  fetchCurrentWeather(city);
  buttons = await renderForecast(city, document.querySelector('.days7').classList.contains('active-forcast-day-selector') ? 7 : 10);
});

//! 📅 Forecast Days Selector
document.querySelectorAll('.forcast-days-selected').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.forcast-days-selected').forEach(b => b.classList.remove('active-forcast-day-selector'));
    btn.classList.add('active-forcast-day-selector');
    const forcastDays = selectDaysForForcast(); //! Updates selected days
  });
});

/*! 📡 Fetches forecast data for given city and days */
export async function fetchForecast(acity, days) {
  const apiKey = 'b19bdbbf07a84cba965153941251108';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${acity}&days=${days}&aqi=no&alerts=no`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching 7-day forecast:', error);
  }
}

//! 🖱 Forecast days toggle buttons
document.querySelector('.days7').addEventListener('click', async () => { buttons = await renderForecast(city, 7) });
document.querySelector('.days10').addEventListener('click', async () => { buttons = await renderForecast(city, 10) });

//! 🔍 Search city weather
const inputElement = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', async () => {
  city = toSlug(inputElement.value);
  fetchCurrentWeather(city);
  buttons = await renderForecast(city, 7);
});

/*! 🔄 Updates summary chart based on selected type (rain or temperature) */
function updateSummary(type) {
  //! Toggle active button styles
  document.querySelector('.temperature-selected').classList.toggle('activated-summary-selector', type === 'temperature');
  document.querySelector('.rain-selected').classList.toggle('activated-summary-selector', type === 'rain');
  
  summaryFor = type;

  const selectedDay = document.querySelector('.forcast-for-day-selected');
  if (!selectedDay) return;

  const allValues = selectedDay.dataset.forForecastSummary.split(',').map(Number);

  const rainData = allValues.slice(0, 12);
  const tempData = allValues.slice(12, 24);

  if (type === 'rain') {
    generateChart(rainData, 'Chances of Rain', '%');
  } else {
    generateChart(tempData, 'Temperature in Celsius', 'C');
  }
}

//! Attach summary toggle buttons
document.querySelector('.temperature-selected').addEventListener('click', () => updateSummary('temperature'));
document.querySelector('.rain-selected').addEventListener('click', () => updateSummary('rain'));
