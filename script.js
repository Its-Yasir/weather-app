const url = 'https://weatherapi-com.p.rapidapi.com/alerts.json?q=hafizabad';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '07b0e29c2bmsh10e4ce27b95ed92p17cdbbjsnf5dbb63b6166',
		'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
	}
};


try {
	const response = await fetch(url, options);
	const result = JSON.parse(await response.text());
	console.log(result);
} catch (error) {
	console.error(error);
}

const aurl = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=32.5667&lon=74.0833&units=metric&lang=en';
const aoptions = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '07b0e29c2bmsh10e4ce27b95ed92p17cdbbjsnf5dbb63b6166',
		'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com'
	}
};

try {
	const aresponse = await fetch(aurl, aoptions);
	const aresult = JSON.parse(await aresponse.text());
	console.log(aresult);
} catch (error) {
	console.error(error);
}
