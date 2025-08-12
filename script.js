const url = 'https://api.weatherapi.com/v1/current.json?key=b19bdbbf07a84cba965153941251108&q=hafizabad';
const options = {
  method: 'GET'
};

async function fetchWeather() {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
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
