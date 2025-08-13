import { fetchCurrentWeather } from "./script.js";

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
            fetchCurrentWeather(`${latitude},${longitude}`); // Call your function here
        },
        error => {
            alert(`Error getting location: ${error.message}`);
        }
    );
}