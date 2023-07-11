// document.getElementById("Title").innerHTML="Welcome"; // Just a testing purpose script

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

    getGeolocation();
    
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

function getGeolocation() {
    navigator.geolocation.watchPosition(showPosition);
}

function showPosition(position) {
    alert(position.coords.latitude);
}

getIP();