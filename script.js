import { getCurrentTime,getTimeByLatLon } from "./funs.js";

let lat, 
    lon,
    result,
    city='Lahore',
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
async function fetchCurrentWeather(cityParam) {
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
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}
fetchCurrentWeather('lahore');



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


document.querySelector('.check-city-weather-lahore').addEventListener('click',()=>{
  fetchCurrentWeather('lahore')
});
document.querySelector('.check-city-weather-karachi').addEventListener('click',()=>{
  fetchCurrentWeather('karachi')
});
document.querySelector('.check-city-weather-islamabad').addEventListener('click',()=>{
  fetchCurrentWeather('islamabad')
});
document.querySelector('.check-city-weather-hafizabad').addEventListener('click',()=>{
  fetchCurrentWeather('hafizabad')
});
document.querySelector('.check-city-weather-istanbul').addEventListener('click',()=>{
  fetchCurrentWeather('istanbul')
});






// const aurl = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=32.5667&lon=74.0833&units=metric&lang=en';
// const aoptions = {
// 	method: 'GET',
// 	headers: {
// 		'x-rapidapi-key': '07b0e29c2bmsh10e4ce27b95ed92p17cdbbjsnf5dbb63b6166',
// 		'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com'
// 	}
// };

// try {
// 	const aresponse = await fetch(aurl, aoptions);
// 	const aresult = JSON.parse(await aresponse.text());
// 	console.log(aresult);
// } catch (error) {
// 	console.error(error);
// }
