const apiKey = "insira sua api key da openweathermap"
const apiFlag = "https://flagsapi.com/" // bandeira do país
const icon = "https://openweathermap.org/img/wn/" // ícone da condição climática

const containerMain = document.querySelector(".container")
const inputCity = document.querySelector("#input-city")
const btSearch = document.querySelector("#btSearch")
const locationCurrent = document.querySelector("#location-current")
const containerCity = document.querySelector("div.city-data")
const containerWeather = document.querySelector("div.weather-data")
const nameCity = document.querySelector("#name-city")
const flagCountry = document.querySelector("#flag")
const temperature = document.querySelector("#temp")
const iconWeather = document.querySelector("#icon-weather")
const description = document.querySelector("#description")
const humidity = document.querySelector("#humidity")
const wind = document.querySelector("#wind")
const msgError = document.createElement("span")


async function getWeatherData(city = '', lat = '', lon = '') {
    let url

    if (lat != '' && lon != '') { // requisição a api via coordenadas geográficas
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=pt_br`
    }
    else { // requisição a api via nome da cidade
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`
        
    }

    const response = await fetch(url)

    const data = await response.json()

    return data
}

async function showWeatherData(city, lat, lon) {

    const data = await getWeatherData(city, lat, lon)

    if (data.cod === "404") {
        containerMain.appendChild(msgError) // adiciona a mensagem de cidade não encontrada ao conteiner principal
        msgError.innerHTML = "Cidade não encontrada"

        containerCity.classList.add("hide") // quando a cidade não é encontrada essas informações climáticas devem ficar ocultas
        containerWeather.classList.add("hide")
    }
    else {
        msgError.remove() // remove a mensagem quando a cidade é encontrada
        containerCity.classList.remove("hide") // assim que uma cidade é encontrada é removida essa clase que oculta essas informações climáticas
        containerWeather.classList.remove("hide")
        
        // conteúdo consumido da api de clima
        nameCity.innerHTML = data.name 
        flagCountry.setAttribute("src", apiFlag+data.sys.country+"/flat/64.png") // captura a sigla do país a partir da api de clima, e assim faz a requisição a api de bandeiras a do país respectivo

        temperature.innerHTML = Math.round(data.main.temp)
        iconWeather.setAttribute("src", icon+data.weather[0].icon+"@2x.png")
        description.innerHTML = data.weather[0].description
        humidity.innerHTML = data.main.humidity
        wind.innerHTML = data.wind.speed

    }
}

btSearch.addEventListener("click", ()=> {

    showWeatherData(inputCity.value)
 
})

inputCity.addEventListener("keydown", (evt) => {
    if (evt.code == "Enter") {
        showWeatherData(inputCity.value)
    }
})

locationCurrent.addEventListener("click", ()=> {
    navigator.geolocation.getCurrentPosition((pos) => { // obtem as coordenadas geográficas
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude

        showWeatherData( '', lat, lon) // faz a chamada a função passando as coordenadas, ao invés do nome da cidade
    })
})
