// document.getElementById("Title").innerHTML="Welcome"; // Just a testing purpose script
// Marcelo Mendoza 2023 - https://github.com/MarceloAndresMendoza

// == APP FLOW ==
// App starts
// └ Saved location from localStorage?
//  ├ Yes: [Use this instead] => [Get Weather Report (Saved location)]
//  └ No: First time app loaded (Suggest press the getLocation button<)
//   └ [GetLocation Button] Try to get Geolocation
//     ├ Got coordinates => [Get Weather Report (Exact location)]
//     └ Did'nt got coordinates
//      └ Try to get IP from IPAPI.com
//       ├ Got coordinates => [Get Weather Report (Aproximate location)]
//       └ Didn't got IP => [Manual location set]
const savedLocation = localStorage.getItem(savedLocation);
if (savedLocation) {
    // There is a saved location
    
} else {
    // First time app load
    
}


const getIP = () => {
    const url = "https://ipapi.co/json/";
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // document.getElementById('data').innerHTML = data.image;
            document.getElementById("yourIP").innerHTML = data.ip;
            document.getElementById("yourLocation").innerHTML =
                data.city + ", " + data.country_name;
            getForecast(data.latitude, data.longitude);
            return data;
        });
};

const getForecast = (lat, lon) => {

    getGeolocation();

    function getGeolocation() {
        if ("geolocation" in navigator) {
            let geoLocationTimeout = setTimeout(() => {
                document.getElementById('geolocation').innerHTML = "Couldn't get geolocation. Check permissions on your device."
            }, 10000);
            // document.getElementById('geolocation').innerHTML = "Geolocation available."
            navigator.geolocation.getCurrentPosition((position) => {
                if (gotPosition(position.coords.latitude, position.coords.longitude)) {
                    clearTimeout(geoLocationTimeout);
                }
            });
            // console.log('Geolocation available')
        } else {
            // console.log('Geolocation NOT available')
            document.getElementById('geolocation').innerHTML = "Geolocation not available or not allowed by user."
        }
    }

    function gotPosition(glat, glon) {
        console.log('Got position:' + glat.toFixed(2) + ", " + glon.toFixed(2));
        // console.log(lat + " " + lon);
        document.getElementById('latitude').innerHTML = glat.toFixed(2);
        document.getElementById('longitude').innerHTML =glon.toFixed(2);
        lat = glat;
        lon = glon;
        document.getElementById('yourLocationLabel').innerHTML = "Your precise location:";
        return true;
    }

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
    new Chart(ctx, {
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



getIP();