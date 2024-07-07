const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const grantAccessBtn = document.querySelector("[data-grantAccess]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const searchInput = document.querySelector("[data-searchInput]");
const errorCont = document.querySelector('.error-container');


const api_key = "3336a969a4f095342015505173dbfff1";
let currentTab = userTab ;
currentTab.classList.add("current-tab");

getFromSessionStorage();

function switchTab(clickedtab){
    if(currentTab == clickedtab){
        return ;
    };
    currentTab.classList.remove("current-tab");
    currentTab = clickedtab;
    currentTab.classList.add("current-tab");

    if(! searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
            // search --> your tab
    else{
        searchForm.classList.remove('active');
        userInfoContainer.classList.remove("active");

        // Ab main your weather section me aaya hu to mera ko weather bhi display krna padega, So let's check local storage first
        // For Coordinates, if we have saved them there.

        getFromSessionStorage();
    }
};

userTab.addEventListener('click' ,function(){
    switchTab(userTab);
});

searchTab.addEventListener('click', function(){
    switchTab(searchTab);
});

        // Check if Coordinates are already present in storage
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(! localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);

        fetchUserWeatherInfo(coordinates);
    }
};

async function fetchUserWeatherInfo(coordinates){
    const {lat, longi} = coordinates;
            // Make Grant Access Container invisible
    grantAccessContainer.classList.remove("active");
            // Make loader visible
    loadingScreen.classList.add("active");
    
            // Make API Call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${longi}&appid=${api_key}&units=metric`);

        const data = await response.json();

                // Loading screen Hata do
        loadingScreen.classList.remove("active");

                // User Info Container Ko Visible Karao
        userInfoContainer.classList.add("active");
                // Rendering Information
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        grantAccessContainer.classList.add("active");

        console.log("Can't Able to fetch the location ");
            // Add a msg to again provide location
    }
};

function renderWeatherInfo(data){
            // Firstly we have to fetch the elements from our html file then we have to put them in
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudeness = document.querySelector("[data-clouds]");

        // (Putting Values) :- [Using Optional Chaining Operator] :-  It will fetch the data from Json Object. If that value is not present then it gives undefined value instead of giving error. 
        // ? --> Checks whteher present or not
    cityName.innerHTML = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerHTML = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0].icon}.png`;
    temp.innerHTML = `${data?.main?.temp.toFixed(2)} °C`;
    windspeed.innerHTML = `${data?.wind?.speed} m/s`;
    humidity.innerHTML = `${data?.main?.humidity}%`;
    cloudeness.innerHTML = `${data?.clouds?.all}%`;
};

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude, 
        longi : position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // Alert dalo
        console.log(alert('Geolocation is not supported'));
    }
}

grantAccessBtn.addEventListener('click' , getLocation);

searchForm.addEventListener("submit", function(e){
    e.preventDefault();
    let cityname = searchInput.value;

    if(cityname === ""){
        return ;
    }
    else{
        fetchSearchWeatherInfo(cityname);
    }
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorCont.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
        const data = await response.json();
        if(!data.sys){
            throw data;
        }

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.log(err);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        errorCont.classList.add("active");
    }
};