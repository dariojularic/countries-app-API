import './style.css'

const searchInput = document.querySelector(".country-name-input");
const continentFilter = document.querySelector(".continent-filter");
const searchForm = document.querySelector(".search-form");
const overlay = document.querySelector(".overlay");
const selectedCountry = document.querySelector(".selected-country");
const countryList = document.querySelector(".grid-list");
const selectedCountryFlag = document.querySelector(".selected-country-flag");
const selectedCountryCapital = document.querySelector(".capital");
const selectedCountryCurrency = document.querySelector(".currency");
const selectedCountryLanguages = document.querySelector(".languages");
const selectedCountryPopulation = document.querySelector(".population");

let searchInputValue = "";
const baseUrl = `https://restcountries.com/v3.1/`;

searchInput.addEventListener("input", () => searchInputValue = searchInput.value)

function displaySelectedCountry(image, capital, currency, language, population) {
  selectedCountryFlag.src = image;
  selectedCountryCapital.textContent = capital;
  selectedCountryCurrency.textContent = currency;
  selectedCountryLanguages.textContent = language;
  selectedCountryPopulation.textContent = population;


}

async function getCountryByName(name) {
  const response = await fetch(baseUrl + `name/${name}`)
  const data = await response.json();
  console.log(data)
  return data
}

async function getCountryByContinent(continent) {
  const response = await fetch(baseUrl + `region/${continent}`)
  const data = await response.json();
  console.log(data)
}

async function getAllCountries() {
  const response = await fetch(baseUrl + `all`)
  const data = await response.json();
  console.log(data)
}
getAllCountries()

searchForm.addEventListener("submit", (event) => {
  event.preventDefault()

  getCountryByName(searchInputValue)
    .then(data => {
      const { flags: {png: image}, capital, currencies, languages, population} = data[0];
      console.log("dataaafaf", languages[Object.keys(languages)])

      displaySelectedCountry(image, capital, currencies[Object.keys(currencies)[0]].name, languages[Object.keys(languages)], population)
      selectedCountryFlag.src = data[0].flags.png
      console.log("data", data[0].currencies)
    })

})

overlay.addEventListener("click", () => {
  overlay.style.visibility = "hidden"
  selectedCountry.style.visibility = "hidden"
})
