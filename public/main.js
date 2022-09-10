const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//<--------SETTING TIME AND DATE----------------------------->

var weekdayNum, day, monthNum;

function currentDate() {
    var d = new Date();
    weekdayNum = d.getDay();
    day = d.getDate();
    monthNum = d.getMonth();
    var hours = d.getHours();
    var min = d.getMinutes();
    document.getElementById("current-day-time").innerHTML = weekdays[weekdayNum] + " " + day + " " + months[monthNum] + " " + hours + ":" + min;
}


//<--------GETTING CITY COODINATES----------------------------->
locData("Kolkata");
var lat, lon;

function getlocInput() {
    var loc = document.getElementById("search").value;
    locData(loc);
}

function locData(loc) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${loc}&appid=64de1703faed7185c168b523fdea7482`)
        .then(response => response.json())
        .then(Data => {
            document.getElementById("location").innerHTML = Data[0].name + " " + Data[0].country;
            lat = Data[0].lat;
            lon = Data[0].lon;
            console.log(lat, lon);
            currentDate();
            currentweather();
            futweather();
            //Weeklyweather();
        })
        .catch(error => {
            alert("Unable to find the location");
        });
}



//<-------------------CURRENT WEATHER-------------------->
function currentweather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=64de1703faed7185c168b523fdea7482&units=metric`)
        .then(response => response.json())
        .then(CurrentData => {
            document.getElementById("current-temp-value").innerHTML = Math.round(CurrentData.main.temp) + "&degC";
            document.getElementById("current-temp-summary").innerHTML = CurrentData.weather[0].main;
            document.getElementById("feels-like-temp").innerHTML = "Feels like: " + Math.round(CurrentData.main.feels_like) + "&degC";
            let mintemp = Math.round(CurrentData.main.temp_min);
            let maxtemp = Math.round(CurrentData.main.temp_max);
            document.getElementById("current-wind").innerHTML = "Wind: " + CurrentData.wind.speed + "m/s";
            document.getElementById("current-humidity").innerHTML = "Humidity: " + CurrentData.main.humidity + "%";
            var currentimg = CurrentData.weather[0].icon;
            document.getElementById("current-temp-img").setAttribute('src', `http://openweathermap.org/img/wn/${currentimg}@2x.png`);
        })
        .catch(error => {
            alert("Unable to Display Current Weather");
        });
}



//<--------------------HOURLY AND WEEKLY WEATHER-------------------->
function futweather() {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=64de1703faed7185c168b523fdea7482&units=metric`)
        .then(response => response.json())
        .then(futData => {
            let containerRef = document.querySelector("#hourly-weather-container")

            let allBox = ``;


            for (let i = 0; i < 8; i++) {
                let hourlyimg = futData.list[i].weather[0].icon;
                allBox += `<div class="hourly-weather-item">
                            <p class="hourly-item-time">${futData.list[i].dt_txt.slice(10, 16)}</p>
                            <img src="http://openweathermap.org/img/wn/${hourlyimg}@2x.png" alt="Mostly sunny">
                            <p id="hourly-item-temp">${futData.list[i].main.temp} &deg C </p>
                            </div>
                            `;
            }

            containerRef.innerHTML = allBox;

            let weeklyconatinerRef = document.querySelector("#weekly-weather-container")

            let intBox = ``;
            //weekdayNum++;
            for (let i = 0; i < 40; i = i + 8) {
                let weeklyimg = futData.list[i].weather[0].icon;
                intBox += `<div class="weekly-weather-item">
                <div class="weekly-day-time">
                    ${weekdays[CheckDay(weekdayNum++)]}   
                </div>
                <div class="weekly-img">
                    <img src="http://openweathermap.org/img/wn/${weeklyimg}@2x.png" alt="">
                </div>
                <p id="weekly-low-high-temp">${futData.list[i].main.temp_max}&degC / ${futData.list[i].main.temp_min}&degC</p>
                <p id="weekly-humidity">Humidity: ${futData.list[i].main.humidity}%</p>
                </div>`;
                console.log(futData.list[i].dt_txt);
            }

            weeklyconatinerRef.innerHTML = intBox;
        })
        .catch(hourlyerror => {
            alert("Unable to Display Future Weather");
        });
}

function CheckDay(days) {
    if (days > 6) {
        return days - 7;
    } else {
        return days;
    }
}



//<----------------------WEEKLY WEATHER------------------->


// function Weeklyweather() {
//     fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=64de1703faed7185c168b523fdea7482&units=metric`)
//         .then(response => response.json())
//         .then(WeeklyData => {
//             let weeklyconatinerRef = document.querySelector("#weekly-weather-container")

//             let intBox = ``;
//             //weekdayNum++;
//             for (let i = 0; i < 40; i = i + 8) {
//                 let weeklyimg = WeeklyData.list[i].weather[0].icon;
//                 intBox += `<div class="weekly-weather-item">
//                 <div class="weekly-day-time">
//                     ${weekdays[weekdayNum++]}   
//                 </div>
//                 <div class="weekly-img">
//                     <img src="http://openweathermap.org/img/wn/${weeklyimg}@2x.png" alt="">
//                 </div>
//                 <p id="weekly-low-high-temp">${WeeklyData.list[i].main.temp_max}&degC / ${WeeklyData.list[i].main.temp_min}&degC</p>
//                 <p id="weekly-humidity">Humidity: ${WeeklyData.list[i].main.humidity}%</p>
//                 </div>`;
//                 console.log(WeeklyData.list[i].dt_txt);
//             }

//             weeklyconatinerRef.innerHTML = intBox;
//         })
//         .catch(weeklyerror => {
//             alert("Unable to Display Weekly Weather");
//         });
// }