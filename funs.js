//! 📦 Import required functions and variables from main script.js
import { fetchCurrentWeather, fetchForecast, summaryFor, generateChart } from "./script.js";

/*! 🕒 Returns the current time in 12-hour format (e.g., "07:45 PM") */
export function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    //! Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; //! 0 → 12

    //! Add leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

/*! 🌍 Get local time for given latitude & longitude (API: timeapi.io) */
export async function getTimeByLatLon(lat, lon) {
  try {
    const res = await fetch(`https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`);
    const data = await res.json();

    //! Format to skip seconds
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
/*! 📌 Gets user's current geolocation (latitude, longitude) */
export async function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return "lahore"; // fallback if browser doesn't support
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords; 
        resolve(`${latitude},${longitude}`);
      },
      error => {
        // If user blocks or error occurs → fallback to Lahore
        console.warn("Geolocation error:", error.message);
        resolve("lahore");
      }
    );
  });
}


/*! 📅 Returns date info (short day name, short month name, date number) */
export function getDateInfo(daysAhead = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  //! Short names for months & days
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dateNum = String(date.getDate()).padStart(2, "0");
  const monthShort = months[date.getMonth()];
  const dayShort = days[date.getDay()];

  return { date: dateNum, month: monthShort, day: dayShort };
}

/*! 📆 Gets the number of forecast days selected from UI */
export function selectDaysForForcast() {
    let btnClick;
    document.querySelectorAll('.forcast-days-selected')
        .forEach((btn) => {
            if (btn.classList.contains('active-forcast-day-selector')) {
                btnClick = btn;
            } 
        });
    return btnClick.dataset.forcastSelected;
}

/*! 🌤 Renders the forecast cards for given city & days, returns button elements */
export async function renderForecast(city, days) {
    const result = await fetchForecast(city, days);
    const forecast = result.forecast.forecastday;
    let html = '';

    forecast.forEach((day, index) => {  
        //! Prepare data arrays for rain % and temp for summary chart
        let forcastDataForSummary = [[], []];
        let rainPercentage = forcastDataForSummary[0];
        let tempPercentage = forcastDataForSummary[1];

        forecast[index].hour.forEach((hourData, index) => {
            if (index % 2 !== 0) { //! Only every second hour
                rainPercentage.push(`${hourData.chance_of_rain}`);
                tempPercentage.push(`${parseInt(hourData.temp_c)}`);
            }
        });

        //! Create forecast card HTML
        html += `
            <div class="forcast-for-day ${index===0?'forcast-for-day-selected':''} forcast-for-day${index+1}" 
                 data-for-forecast-summary="${forcastDataForSummary}">
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
        `;
    });

    //! Insert forecast cards into DOM
    document.querySelector('.forcasts').innerHTML = html;

    //! Enable selection of a forecast day
    const buttons = document.querySelectorAll('.forcast-for-day');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        buttons.forEach(btn => btn.classList.remove('forcast-for-day-selected'));
        this.classList.add('forcast-for-day-selected');
      });
    });

    //! Update chart when a forecast day is clicked
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const str = btn.dataset.forForecastSummary;
        const allValues = str.split(',').map(Number);
        const firstHalf = allValues.slice(0, 12);
        const secondHalf = allValues.slice(12, 24);

        if (summaryFor === 'rain') {
          generateChart(firstHalf, 'Chances of Rain', '%');
        } else {
          generateChart(secondHalf, 'Temperature in Celcius', 'C');
        }
      });
    });

    return document.querySelectorAll('.forcast-for-day');
}

/* 🔤 Converts a string into slug format (lowercase, hyphens) */
export function toSlug(input) {
  return input.trim().toLowerCase().replace(/\s+/g, '-');
}

/* ⏳ Formats a datetime string (e.g., "2025-08-13 20:43") into "08:43 PM" */
export async function formatTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}
