// document.getElementById("Title").innerHTML="Welcome"; // Just a testing purpose script
// Marcelo Mendoza 2023 - https://github.com/MarceloAndresMendoza

// == APP FLOW ==
// App starts
// └ Saved location from localStorage?
//  ├ Yes: [Use this instead] => [Get Weather Report (Saved location)]
//  └ No: First time app loaded (Suggest press the getLocation button<) - DONE
//   └ [GetLocation Button] Try to get Geolocation
//     ├ Got coordinates => [Get Weather Report (Exact location)]
//     └ Did'nt got coordinates
//      └ Try to get IP from IPAPI.com - DONE
//       ├ Got coordinates => [Get Weather Report (Aproximate location)]
//       └ Didn't got IP => [Manual location set]

// ========================================
// ===== Check if got any coordinates =====
// ========================================
const gotCoordinates = document.getElementById('gotcoords');

// Create a new MutationObserver (check changes on the div element)
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        // Check if the mutation is an innerHTML change
        if (mutation.type === 'childList') {
            // ===> GET WEATHER
            const lat = document.getElementById('latitude').innerText;
            const lon = document.getElementById('longitude').innerText;
            getForecast(lat, lon);
        }
    });
});
// Start observing the element
observer.observe(gotCoordinates, {
    childList: true
});
// =======================================


// ========================================
// ======= Get IP location via API ========
// ========================================
const getIPlocation = (onlyIp = "false") => {
    const url = "https://ipapi.co/json/";
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            document.getElementById("yourIP").innerHTML = data.ip;
            if (!onlyIp) {
                document.getElementById("yourLocation").innerHTML = data.city + ", " + data.country;
                document.getElementById("yourLocationLabel").innerHTML = "Your aproximated location:";
                document.getElementById("latitude").innerHTML = data.latitude.toFixed(2);
                document.getElementById("longitude").innerHTML = data.longitude.toFixed(2);
                document.getElementById("gotcoords").innerHTML = 'true';
                document.getElementById("geolocationinfo").innerHTML = 'obtained now via IP';
            }
            return data;
        })
        .catch((error) => {
            document.getElementById("yourIP").innerHTML = error;
            return error;
        });
};
// ========================================

const getReverseGeocode = (lat, lon) => {
    // Get your precise location address
    const url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // console.log(data);
            // alert(data.address.city + " " + data.address.country);
            document.getElementById("yourLocationLabel").innerHTML = "Your precise location:";
            const neighbourhood = (data.address.road == undefined) ? "" : data.address.road + ", ";
            document.getElementById("yourLocation").innerHTML = neighbourhood + data.address.city + ", " + data.address.country;
            return data;
        })
}

function btGetLocation() {
    // User presses the 'update' button.
    if ("geolocation" in navigator) {
        // Geolocation is available
        let geoLocationTimeout = setTimeout(() => {
            // In the case could not obtain gelocation coordinates, shows an error.
            document.getElementById('geolocationinfo').innerHTML = "Couldn't get geolocation. Check permissions on your device."
            // ===> Try IP location
            getIPlocation();
        }, 10000);
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude.toFixed(2);
            const lon = position.coords.longitude.toFixed(2);
            document.getElementById('latitude').innerHTML = lat;
            document.getElementById('longitude').innerHTML = lon;
            document.getElementById("gotcoords").innerHTML = 'true';
            document.getElementById("geolocationinfo").innerHTML = 'obtained now via geolocation';
            getIPlocation(true);
            getReverseGeocode(position.coords.latitude, position.coords.longitude);
            // Got geolocation coords, cancel the timeout
            clearTimeout(geoLocationTimeout);
            // ===> Get weather data (precise)
        });
    } else {
        // Geolocation is not available
        document.getElementById('geolocationinfo').innerHTML = "Geolocation not available or not allowed by user."
        // ===> Try IP location}
        getIPlocation();
    }
    // This is only to avoid rage clicking
    const button = document.getElementById('btGetLocation')
    button.disabled = true;
    button.innerText = "Wait ..."
    setTimeout(function () {
        button.disabled = false;
        button.innerText = "Update"
    }, 1000);
}

document.getElementById('btGetLocation').addEventListener('click', btGetLocation);

const getForecast = (lat, lon) => {
    // First, save current coordinates on localStorage
    localStorage.setItem("savedLocation", "true");
    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", lon);
    // Check weather on open-meteo API
    const url = `https://api.open-meteo.com/v1/forecast?current_weather=true&latitude=${lat}&longitude=${lon}&hourly=precipitation_probability&hourly=temperature_2m`;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // document.getElementById('data').innerHTML = data.image;
            document.getElementById("URL").innerHTML = url;
            document.getElementById("temp").innerHTML =
                data.current_weather.temperature + " °C";
            document.getElementById("rain").innerHTML =
                data.hourly.precipitation_probability[1] + " %";
            getForecastDataChart(data, 24);
            return data;
        });
};

let myChart;

const getForecastDataChart = (data, numberOfDataPoints) => {
    // Initialize myData here
    const myData = {
        dataTempValues: "",
        dataFullDateTimeLabels: "",
        dataTimeLabels: "",
        dataRainValues: ""
    };
    myData.dataTempValues = data.hourly.temperature_2m.slice(0, numberOfDataPoints);
    myData.dataFullDateTimeLabels = data.hourly.time.slice(0, numberOfDataPoints);
    myData.dataTimeLabels = data.hourly.time.slice(0, numberOfDataPoints).map(timestring => timestring.slice(11, 16));
    myData.dataRainValues = data.hourly.precipitation_probability.slice(0, numberOfDataPoints);

    const ctx = document.getElementById("forecastChart");

    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: myData.dataTimeLabels,
            datasets: [
                {
                    label: "Temperature",
                    data: myData.dataTempValues,
                    borderWidth: 3,
                    borderColor: '#ff9f40',
                    backgroundColor: '#cc7d20'
                },
                {
                    label: "Rain chance %",
                    data: myData.dataRainValues,
                    borderWidth: 3,
                    borderColor: '#36a2eb',
                    backgroundColor: '#9BD0F5'
                }
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
    document.getElementById('loading').className = 'global-hidden';
    const currentMonthName = monthName(myData.dataFullDateTimeLabels[0].slice(5, 7));
    document.getElementById('forecast-date').innerHTML = currentMonthName + "," + myData.dataFullDateTimeLabels[0].slice(8, 10);



};

// Create an array of the 12 month names
const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

function monthName(num) {
    if (num > 0 && num <= 12) {
        return months[num - 1];
    }
    return "Error: Not a valid number";
}


const savedLocation = localStorage.getItem("savedLocation");
if (savedLocation == null) {
    // First time app load
    document.getElementById("geolocationinfo").innerHTML = 'Press "Update" to obtain your current location.';
    btGetLocation();
} else {
    // There is a saved location
    // ===> Get weather data (saved)
    const lat = localStorage.getItem("latitude");
    const lon = localStorage.getItem("longitude");
    document.getElementById('latitude').innerHTML = lat;
    document.getElementById('longitude').innerHTML = lon;
    document.getElementById("gotcoords").innerHTML = 'true';
    document.getElementById("geolocationinfo").innerHTML = 'previously saved data, press "update" to renew';
    getIPlocation(true);
    getReverseGeocode(lat, lon);
}