import { getCurrentTime,getTimeByLatLon,getCurrentLocation } from "./funs.js";

let lat, 
    lon,
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
    document.querySelector('.current-weather-img').src = `${result.current.condition.icon}`
    lat = result.location.lat;
    lon = result.location.lon;
    getTimeByLatLon(lat, lon).then(time => {
      document.querySelector('.time').textContent = time;
    });
    console.log(result)
    let mapWidth = document.querySelector('.map-box').clientWidth;
    let mapHeight = document.querySelector('.map-box').clientHeight;
    const mapUrl = `https://maps.locationiq.com/v3/staticmap?key=pk.1da9136f8ec6ed1f78714e47b665667b&center=${lat},${lon}&zoom=10&size=${mapWidth}x${mapHeight}&format=png&maptype=streets&markers=icon:https://locationiq.com/static/img/marker.png|${lat},${lon}`;
    document.querySelector('.map-box').style.background = `url('${mapUrl}')`
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
fetchCurrentWeather('lahore');


function generateCart(){
  const ctx = document.getElementById('temperatureChart').getContext('2d');

    // Example temperature data in Celsius
    const temperatureData = [70, 78, 62, 75, 81, 85, 76, 81, 82, 75];
    document.getElementById('temperatureChart').width = temperatureData.length * 100;
    // Labels for every hour (you can customize this dynamically)
    const labels = ['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM'];

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

document.querySelector('.check-city-weather-lahore').addEventListener('click',async()=>{
  await fetchCurrentWeather('lahore');
  console.log(city)
});
document.querySelector('.check-city-weather-karachi').addEventListener('click',async()=>{
  await fetchCurrentWeather('karachi');
  console.log(city);
});
document.querySelector('.check-city-weather-islamabad').addEventListener('click',async()=>{
  await fetchCurrentWeather('islamabad')
});
document.querySelector('.check-city-weather-hafizabad').addEventListener('click',async()=>{
  await fetchCurrentWeather('hafizabad')
});
document.querySelector('.check-city-weather-istanbul').addEventListener('click',async()=>{
  await fetchCurrentWeather('istanbul');
  console.log(city)
});
document.querySelector('.your-location').addEventListener('click',async()=>{
  await getCurrentLocation();
  console.log(city)
});

//! Forcast DAYS SELECTOR

document.querySelectorAll('.forcast-days-selected')
  .forEach((btn) => {
  btn.addEventListener('click', () => {
    document
      .querySelectorAll('.forcast-days-selected')
      .forEach(b => b.classList.remove('active-forcast-day-selector'));
    btn.classList.add('active-forcast-day-selector');
  let btnClick;
  if(btn.classList.contains('active-forcast-day-selector')){
    btnClick = btn;
  } 
  const forcastDays = btnClick.dataset.forcastSelected;
  console.log(forcastDays)
  });
});

async function fetch7DayForecast(lat, lon) {
  const apiKey = 'b19bdbbf07a84cba965153941251108&q'; // replace with your real WeatherAPI key
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const data = await response.json();

    console.log('📅 7-Day Forecast:', data.forecast.forecastday);

    // Example: Loop through each day's forecast
    data.forecast.forecastday.forEach(day => {
      console.log(`
        Date: ${day.date}
        Max Temp: ${day.day.maxtemp_c}°C
        Min Temp: ${day.day.mintemp_c}°C
        Condition: ${day.day.condition.text}
        Icon: ${day.day.condition.icon}
      `);
    });

    return data.forecast.forecastday;
  } catch (error) {
    console.error('❌ Error fetching 7-day forecast:', error);
  }
}
console.log(city)

// Example usage:
fetch7DayForecast(31.5497, 74.3436); // Lahore lat/lon

