let lat, lon, result;

const url = 'https://api.weatherapi.com/v1/current.json?key=b19bdbbf07a84cba965153941251108&q=islamabad';
const options = {
  method: 'GET'
};
navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Call your function to show the map
  showMap(lat, lon, "Your Location");
}

function error() {
  alert("Unable to retrieve your location. Please allow location access.");
}
async function fetchWeather() {
  try {
    const response = await fetch(url, options);
    result = await response.json();

    lat = result.location.lat;
    lon = result.location.lon;

    console.log("Latitude:", lat);
    console.log("Longitude:", lon);
    console.log("Full result:", result);
    const mapUrl = `https://maps.locationiq.com/v3/staticmap?key=pk.1da9136f8ec6ed1f78714e47b665667b&center=${lat},${lon}&zoom=10&size=621x275&format=png&maptype=streets&markers=icon:https://locationiq.com/static/img/marker.png|${lat},${lon}`;
    document.querySelector('.map-box').style.background = `url('${mapUrl}')`
    // You can now call other functions that depend on lat/lon here
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

fetchWeather();






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
