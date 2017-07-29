window.onload = function() {
    var searchInput = document.querySelector("input[type='text']");
    var searchButton = document.querySelector("button");

    var validResultsDiv = document.querySelector("#valid-weather");
    var invalidResultsDiv = document.querySelector("#invalid-weather");

    var errorTextElem = document.querySelector("#invalid-weather p");
    var validCityName = document.querySelector("#valid-weather h1");
    var validWeatherDescription = document.querySelector(".weather-description");
    var validWeatherTemperature = document.querySelector(".weather-temperature");
    var validWeatherIconImg = document.querySelector("#valid-weather img");

    var forecastFirstDay = document.querySelector(".forecast-first .day-name");
    var forecastSecondDay = document.querySelector(".forecast-second .day-name");
    var forecastThirdDay = document.querySelector(".forecast-third .day-name");
    var forecastFirstIcon = document.querySelector(".forecast-first img");
    var forecastSecondIcon = document.querySelector(".forecast-second img");
    var forecastThirdIcon = document.querySelector(".forecast-third img");
    var forecastFirstDescription = document.querySelector(".forecast-first .weather-description");
    var forecastSecondDescription = document.querySelector(".forecast-second .weather-description");
    var forecastThirdDescription = document.querySelector(".forecast-third .weather-description");
    var forecastFirstTemperature = document.querySelector(".forecast-first .weather-temperature");
    var forecastSecondTemperature = document.querySelector(".forecast-second .weather-temperature");
    var forecastThirdTemperature = document.querySelector(".forecast-third .weather-temperature");

    //Hide results divs when we start the app initially
    validResultsDiv.style.display = "none";
    invalidResultsDiv.style.display = "none";

    //Get JSON data if user input was valid
    searchButton.onclick = function() {
      var searchTerm = searchInput.value;

      var http = new XMLHttpRequest();
      var url = "http://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&APPID=95c245d940471089415204e9a44b5891";
      var method = "GET";
      var type = "current";

      sendJsonRequest(http, url, method, type);

      var http = new XMLHttpRequest();
      url = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&APPID=95c245d940471089415204e9a44b5891";
      method = "GET";
      type = "forecast";

      sendJsonRequest(http, url, method, type);

    };

    //Draw current weather from return JSON data
    function drawCurrentWeather(http) {
      var weather = JSON.parse(http.responseText);
      var temperature = weather.main.temp;
      var city = weather.name;
      var description = weather.weather[0].description;
      var icon = "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";

      validResultsDiv.style.display = "block";
      invalidResultsDiv.style.display = "none";

      validCityName.textContent = city;
      validWeatherDescription.textContent = description;
      validWeatherTemperature.textContent = temperature;
      validWeatherIconImg.src = icon;
    }

    function drawforecastWeather(http) {
      var weather = JSON.parse(http.responseText);
      var currentDate = new Date();
      var currentMonthDay = currentDate.getDate();
      var forecastWeather = [];
      var futureDays = determineJsonFutureDays(weather);
      var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      for(var i=0; i<weather.list.length; i++) {
        var jsonDate = new Date(weather.list[i].dt_txt);
        var jsonMonthDay = jsonDate.getDate();
        var recordExists = checkRecordExists(forecastWeather, jsonMonthDay);

        if(jsonMonthDay !== currentMonthDay && recordExists === false) {
          forecastWeather.push(weather.list[i]);
        }
      }

      for(var j=0; j<4; j++) {
        console.log(forecastWeather[j]);
        var forecastDate = new Date(forecastWeather[j].dt_txt);
        var forecastDay = forecastDate.getDay();
        var forecastDayName = dayNames[forecastDay];
        var forecastTemperature = forecastWeather[j].main.temp;
        var forecastDescription = forecastWeather[j].weather[0].description;
        var forecastIcon = "http://openweathermap.org/img/w/" + forecastWeather[j].weather[0].icon + ".png";

        console.log(forecastDescription);

        if(j === 0) {
          forecastFirstDay.textContent = forecastDayName;
          forecastFirstIcon.src = forecastIcon;
          forecastFirstDescription.textContent = forecastDescription;
          forecastFirstTemperature.textContent = forecastTemperature;
        } else if(j === 1) {
          forecastSecondDay.textContent = forecastDayName;
          forecastSecondIcon.src = forecastIcon;
          forecastSecondDescription.textContent = forecastDescription;
          forecastSecondTemperature.textContent = forecastTemperature;
        } else if(j === 2) {
          forecastThirdDay.textContent = forecastDayName;
          forecastThirdIcon.src = forecastIcon;
          forecastThirdDescription.textContent = forecastDescription;
          forecastThirdTemperature.textContent = forecastTemperature;
        }

      }


  }

  //Checks if a weather record for a date is already added to the data array
  function checkRecordExists(forecastWeather, jsonMonthDay) {
    var recordExists = false;
    for(var j=0; j<forecastWeather.length; j++) {
      if(forecastWeather.length > 0) {
        var forecastWeatherDate = new Date(forecastWeather[j].dt_txt);
        var forecastWeatherMonthDay = forecastWeatherDate.getDate();

        if(forecastWeatherMonthDay === jsonMonthDay) {
          recordExists = true;
          break;
        }
      }
    }

    return recordExists;
  }

  //Determines the future days from the JSON data in a non duplicate fashion
  function determineJsonFutureDays(weather) {
    var futureDays = [];

    for(var i=0; i<weather.list.length; i++) {
      var jsonDate = new Date(weather.list[i].dt_txt);

      if(futureDays.indexOf(jsonDate.getDate()) === -1) {
        futureDays.push(jsonDate.getDate());
      }
    }

    return futureDays;
  }

    //Draw error message as JSON returned no results
    function drawNoWeatherFound() {
      validResultsDiv.style.display = "none";
      invalidResultsDiv.style.display = "block";
      errorTextElem.textContent = "There has been a problem finding weather information. Please try another search term.";
    }

    function sendJsonRequest(http, url, method, type) {
      http.open(method, url);

      http.onreadystatechange = function() {
        if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
          if(type === "current") {
            drawCurrentWeather(http);
          } else {
            drawforecastWeather(http);
          }
        } else if(http.readyState === XMLHttpRequest.DONE && http.status !== 200) {
          drawNoWeatherFound();
        }
      };

      http.send();
    }
};
