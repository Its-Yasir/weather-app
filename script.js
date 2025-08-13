import { getCurrentTime,getTimeByLatLon,getCurrentLocation,selectDaysForForcast, renderForecast, toSlug, formatTime } from "./funs.js";

let lat, 
    lon,
    forcastDaysValue = 7,
    result,
    city,
    country='Pakistan',
    weather = 'Heavy Rain',
    temperature=24,
    uv=5.1,
    humidity=58,
    airSpeed='18 kph',
    heat = 37,
    time='6:43 PM';

const options = {
  method: 'GET'
};

function error() {
  alert("Unable to retrieve your location. Please allow location access.");
}
export async function fetchCurrentWeather(cityParam) {
  const url = `https://api.weatherapi.com/v1/current.json?key=b19bdbbf07a84cba965153941251108&q=${cityParam}`;
  try {
    const response = await fetch(url, options);
    result = await response.json();
    console.log(result)
    city = result.location.name;
    country = result.location.country;
    temperature = parseInt(result.current.temp_c);
    uv = result.current.uv;
    humidity = result.current.humidity;
    airSpeed = result.current.wind_kph;
    heat = result.current.heatindex_c;
    weather = result.current.condition.text;
    document.querySelector('.current').textContent = `${city}, ${country}`;
    document.querySelector('.temp-value').textContent = temperature;
    document.querySelector('.weather-condition-js').textContent = weather;
    document.querySelector('.uv-value').textContent = uv;
    document.querySelector('.heat-value').textContent = heat;
    document.querySelector('.humidity-value').textContent = humidity;
    document.querySelector('.wind-value').textContent = airSpeed;
    if(result.current.condition.icon!== '//cdn.weatherapi.com/weather/64x64/night/113.png'){
      document.querySelector('.current-weather-img').src = `${result.current.condition.icon}`
    }else{
      document.querySelector('.current-weather-img').src = `https://maps.gstatic.com/weather/v1/clear.svg`
    }
    lat = result.location.lat;
    lon = result.location.lon;
    let time = await  formatTime(result.location.localtime)
    document.querySelector('.time').textContent = time;
    let mapWidth = document.querySelector('.map-box').clientWidth;
    let mapHeight = document.querySelector('.map-box').clientHeight;
    const mapUrl = `https://maps.locationiq.com/v3/staticmap?key=pk.1da9136f8ec6ed1f78714e47b665667b&center=${lat},${lon}&zoom=10&size=${mapWidth}x${mapHeight}&format=png&maptype=streets&markers=icon:https://locationiq.com/static/img/marker.png|${lat},${lon}`;
    document.querySelector('.map-box').style.background = `url('${mapUrl}')`

    console.log(city)
    let forcastForGraph = await fetchForecast(city,1);
    console.log(forcastForGraph)

    // You can now call other functions that depend on lat/lon here
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
await fetchCurrentWeather('gujrat');
if(forcastDaysValue===10){
  renderForecast('gujrat',10)
}else{
  renderForecast('gujrat',7)
}

function generateChart(){
  const ctx = document.getElementById('temperatureChart').getContext('2d');

    // Example temperature data in Celsius
    const temperatureData = [70, 78, 62, 75, 81, 85, 76, 81, 82, 75, 25, 46];
    document.getElementById('temperatureChart').width = temperatureData.length * 100;
    // Labels for every hour (you can customize this dynamically)
    const labels = ['1 AM', '3 AM', '5 AM', '7 AM', '9 AM', '11 AM', '1 PM', '8 PM', '10 PM', '12 PM'];
    // Create a vertical gradient fill (top to bottom)
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(39, 107, 255, 0.98)');
    gradient.addColorStop(1, 'rgba(102, 99, 255, 0)');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: temperatureData,
        fill: true,
        backgroundColor: gradient,
        borderColor: 'rgba(0, 60, 255, 1)',
        tension: 0.3,
        pointBackgroundColor: '#0011ff',
        pointBorderColor: 'rgba(0, 8, 255, 0)',
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          align: 'top',
          anchor: 'end',
          color: '#fff',
          font: {
            family: 'Poppins',   // ✅ Use Poppins
            size: 16,            // ✅ Make labels bigger
            weight: 'bold'       // ✅ Bold
          },
          formatter: (value) => `${value}%`
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ffffff',
            font: {
              family: 'Poppins',  // ✅ Font for X-axis
              size: 14,           // ✅ Slightly bigger
              weight: '600'       // ✅ Semi-bold
            }
          },
          grid: {
            display: false
          },
          title: {
            display: true,
            text: 'Time (Hourly)',
            color: '#ffffff',
            font: {
              family: 'Poppins',
              size: 16,
              weight: 'bold'
            }
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            display: false
          },
          title: {
            display: true,
            text: 'Chances of Rain',
            color: '#fff',
            font: {
              family: 'Poppins',
              size: 16,
              weight: 'bold'
            }
          },
          grace: '10%'
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
generateChart();

document.querySelector('.check-city-weather-lahore').addEventListener('click',async()=>{
  await fetchCurrentWeather('lahore');
  if(document.querySelector('.days7').classList.contains('active-forcast-day-selector')){
    renderForecast('lahore',7);
  }else{
    renderForecast('lahore',10);
  }
});
document.querySelector('.check-city-weather-karachi').addEventListener('click',async()=>{
  await fetchCurrentWeather('karachi');
  if(document.querySelector('.days7').classList.contains('active-forcast-day-selector')){
    renderForecast('karachi',7);
  }else{
    renderForecast('karachi',10);
  }
});
document.querySelector('.check-city-weather-islamabad').addEventListener('click',async()=>{
  await fetchCurrentWeather('islamabad');
  if(document.querySelector('.days7').classList.contains('active-forcast-day-selector')){
    renderForecast('islamabad',7);
  }else{
    renderForecast('islamabad',10);
  }
});
document.querySelector('.check-city-weather-hafizabad').addEventListener('click',async()=>{
  await fetchCurrentWeather('hafizabad');
  if(document.querySelector('.days7').classList.contains('active-forcast-day-selector')){
    renderForecast('hafizabad',7);
  }else{
    renderForecast('hafizabad',10);
  }
});
document.querySelector('.check-city-weather-istanbul').addEventListener('click',async()=>{
  await fetchCurrentWeather('istanbul');
  if(document.querySelector('.days7').classList.contains('active-forcast-day-selector')){
    renderForecast('istanbul',7);
  }else{
    renderForecast('istanbul',10);
  }
});
document.querySelector('.your-location').addEventListener('click',async()=>{
  city = await getCurrentLocation();
  if(document.querySelector('.days7').classList.contains('active-forcast-day-selector')){
    renderForecast(city,7);
  }else{
    renderForecast(city,10);
  }
});

//! Forcast DAYS SELECTOR

document.querySelectorAll('.forcast-days-selected')
  .forEach((btn) => {
  btn.addEventListener('click', () => {
    document
      .querySelectorAll('.forcast-days-selected')
      .forEach(b => b.classList.remove('active-forcast-day-selector'));
    btn.classList.add('active-forcast-day-selector');
  const forcastDays = selectDaysForForcast();
  console.log(forcastDaysValue);
  console.log(forcastDays);
  });
});

export async function fetchForecast(acity,days) {
  const apiKey = 'b19bdbbf07a84cba965153941251108'; 
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${acity}&days=${days}&aqi=no&alerts=no`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error fetching 7-day forecast:', error);
  }
}
document.querySelector('.days7').addEventListener('click',()=>{
  renderForecast(city,7)
});
document.querySelector('.days10').addEventListener('click',()=>{
  renderForecast(city,10)
});

//! CODE FOR SEARCH BUTTON WORKING

const inputElement = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click',()=>{
  city = toSlug(inputElement.value);
  console.log(city);
  fetchCurrentWeather(city);
  renderForecast(city,7)
})

