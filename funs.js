import { fetchCurrentWeather, fetchForecast, summaryFor, generateChart } from "./script.js";

export function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Add leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
export async function getTimeByLatLon(lat, lon) {
  try {
    const res = await fetch(`https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`);
    const data = await res.json();
    // Format time to skip seconds
    let [hour, minute] = data.time.split(':'); // "18:43:05" → ["18","43","05"]
    hour = parseInt(hour, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  } catch (err) {
    console.error('Error fetching time:', err);
    return 'Invalid time';
  }
}
export async function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;     
        console.log("Latitude:", latitude, "Longitude:", longitude);
        resolve(`${latitude},${longitude}`);
      },
      error => {
        alert(`Error getting location: ${error.message}`);
        reject(error);
      }
    );
  });
}


export function getDateInfo(daysAhead = 0) {
  // Create a date object for today + daysAhead
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  // Arrays for short month and day names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Extract values
  const dateNum = String(date.getDate()).padStart(2, "0"); // e.g., "03"
  const monthShort = months[date.getMonth()]; // e.g., "Jul"
  const dayShort = days[date.getDay()]; // e.g., "Sun"

  return {
    date: dateNum,
    month: monthShort,
    day: dayShort
  };
}

export function selectDaysForForcast(){
    let btnClick;
    document.querySelectorAll('.forcast-days-selected')
        .forEach((btn)=>{
            if(btn.classList.contains('active-forcast-day-selector')){
                btnClick = btn;
            } 
            
        })
        return btnClick.dataset.forcastSelected
    }

export async function renderForecast(city,days){
    const result = await fetchForecast(city,days);
    const forecast = result.forecast.forecastday;
    let html='';
    forecast.forEach((day,index)=>{  
    let forcastDataForSummary = [[],[]]
    let rainPercentage = forcastDataForSummary[0];
    let tempPercentage = forcastDataForSummary[1];
    forecast[index].hour.forEach((hourData,index)=>{
      if(index%2 !== 0){
        rainPercentage.push(`${
      hourData.chance_of_rain}`);
        tempPercentage.push(`${parseInt(hourData.temp_c)}`)
      }
    });
        html+= `
            <div class="forcast-for-day ${index===0?'forcast-for-day-selected':''} forcast-for-day${index+1}" data-for-forecast-summary = "${forcastDataForSummary}">
            <img src=${day.day.condition.icon} alt="weather img">
            <div class="forcast-temperature">${parseInt(day.day.mintemp_c)}
                <div class="forcast-degree">o</div>
            </div>
            <span>/</span>
            <div class="forcast-temperature">${parseInt(day.day.maxtemp_c)}
                <div class="forcast-degree">o</div>
            </div>
            <div class="date-of-forcast">
                <div class="forcast-date">${getDateInfo(index).date}</div>
                <div class="forcast-month">${getDateInfo(index).month + ','}</div>
                <div class="forcast-day">${getDateInfo(index).day}</div>
            </div>
            </div>
        `
    });
    document.querySelector('.forcasts').innerHTML = html;
    // Get all the buttons
    const buttons = document.querySelectorAll('.forcast-for-day');
    // Loop through each button and attach a click event listener
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove 'active' class from all buttons
        buttons.forEach(btn => btn.classList.remove('forcast-for-day-selected'));
        // Add 'active' class to the clicked button
        this.classList.add('forcast-for-day-selected');
      });
    });

    buttons.forEach((btn)=>{
      btn.addEventListener('click',()=>{
        const str = btn.dataset.forForecastSummary;

        // Convert the string to an array of numbers
        const allValues = str.split(',').map(Number);

        // Split into two arrays of 12 values each
        const firstHalf = allValues.slice(0, 12);
        const secondHalf = allValues.slice(12, 24);

        const result = [firstHalf, secondHalf];
        console.log(result);
        if(summaryFor === 'rain'){
          generateChart(result[0],'Chances of Rain','%')
        }else{
          generateChart(result[1],'Temperature in Celcius','C')
        }
      });
    });
    return document.querySelectorAll('.forcast-for-day');
}
export function toSlug(input) {
  return input.trim().toLowerCase().replace(/\s+/g, '-');
}
export async function formatTime(dateTimeStr) {
  const date = new Date(dateTimeStr); // "2025-08-13 20:43"
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 → 12

  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}


