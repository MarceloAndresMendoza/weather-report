import"./hoisted.03e7ed6d.js";const o=()=>{fetch("https://ipapi.co/json/").then(e=>e.json()).then(e=>(document.getElementById("yourIP").innerHTML=e.ip,document.getElementById("yourLocation").innerHTML=e.city+", "+e.country_name,a(e.latitude,e.longitude),e))},a=(n,e)=>{const r=`https://api.open-meteo.com/v1/forecast?current_weather=true&latitude=${n}&longitude=${e}&hourly=precipitation_probability&hourly=temperature_2m`;fetch(r).then(t=>t.json()).then(t=>(document.getElementById("URL").innerHTML=r,document.getElementById("temp").innerHTML=t.current_weather.temperature+" °C",document.getElementById("rain").innerHTML=t.hourly.precipitation_probability[1]+" %",u(t,24),t))},u=(n,e)=>{const r={dataValues:"",dataLabels:""};r.dataValues=n.hourly.temperature_2m.slice(0,e),r.dataLabels=n.hourly.time.slice(0,e);const t=document.getElementById("forecastChart");new Chart(t,{type:"line",data:{labels:r.dataLabels,datasets:[{label:"Temperature",data:r.dataValues,borderWidth:1}]},options:{scales:{y:{beginAtZero:!0}}}})};o();
