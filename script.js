const url = 'https://weatherapi-com.p.rapidapi.com/alerts.json?q=china';
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

const aurl = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=35.5&lon=-78.5&units=metric&lang=en';
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

const aaurl = 'https://api.openweathermap.org/data/2.5/weather?lat=35.5&lon=-78.5&appid=68fe195dcfb40ebf0461ef75f2c628f9';
const aaoptions = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '07b0e29c2bmsh10e4ce27b95ed92p17cdbbjsnf5dbb63b6166',
		'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com'
	}
};

try {
	const aaresponse = await fetch(aaurl, aaoptions);
	const aaresult = JSON.parse(await aaresponse.text());
	console.log(aaresult);
} catch (error) {
	console.error(error);
}