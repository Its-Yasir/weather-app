import { fetchCurrentWeather,fetchForecast } from "./script.js";

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
export async function getCurrentLocation(){
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            
            console.log("Latitude:", latitude, "Longitude:", longitude);
            return `${latitude},${longitude}`
            fetchCurrentWeather(`${latitude},${longitude}`); // Call your function here
        },
        error => {
            alert(`Error getting location: ${error.message}`);
        }
    );
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
        html+= `
            <div class="forcast-for-day">
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


