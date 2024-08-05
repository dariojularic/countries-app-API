import './style.css';
import numeral from 'numeral';

const searchInput = document.querySelector(".country-name-input");
const regionFilter = document.querySelector(".region-filter");
const searchForm = document.querySelector(".search-form");
const overlay = document.querySelector(".overlay");
const selectedCountry = document.querySelector(".selected-country");
const countryList = document.querySelector(".grid-list");
const selectedCountryFlag = document.querySelector(".selected-country-flag");
const selectedCountryCapital = document.querySelector(".span-capital");
const selectedCountryCurrency = document.querySelector(".span-currency");
const selectedCountryLanguages = document.querySelector(".span-language");
const selectedCountryPopulation = document.querySelector(".span-population");
const selectedCountryName = document.querySelector(".span-name");
// ireland ne radi, izbaci mi united kingdom
// ocu filtrirat po regionu ili kontinentima??
// georgia i south korea ne radi --- name ili full name API endpoint
// paginacija
let searchInputValue = "";
const baseUrl = `https://restcountries.com/v3.1/`;

searchInput.addEventListener("input", (event) => searchInputValue = event.target.value)


// paginateCountries()
// CountriesManager
// how to split an array in to 10 small arrays
// how to paginate an array in to 10 pages
// how to make 2D array from a single array

class CountriesManager{
  constructor() {
    this.allCountries = []
    this.countriesToDisplay = []
  }

  setAllCountries(countries) {
    this.allCountries = countries
  }

  getAllCountries() {
    return this.allCountries
  }

  setCountriesToDisplay(countries) {
    this.countriesToDisplay = countries
  }

  getCountriesToDisplay() {
    return this.countriesToDisplay
  }
}

const countriesManager = new CountriesManager();

function paginateCountries(countries) {
  let chunks = [];
  const chunkSize = 10;

  for (let i = 0; i < countries.length; i += chunkSize) {
    chunks.push(countries.slice(i, i + chunkSize))
  }
  console.log("paginated chunks", chunks)
}

function displaySelectedCountry(image, capital, currency, language, population , name) {
  selectedCountryFlag.src = image;
  selectedCountryCapital.textContent = capital;
  selectedCountryCurrency.textContent = currency;
  selectedCountryLanguages.textContent = language;
  selectedCountryPopulation.textContent = numeral(population).format("0,0");
  selectedCountryName.textContent = name;
  overlay.style.visibility = "visible";
  selectedCountry.style.visibility = "visible";
}

function displayCountriesList(countries) {
  countryList.innerHTML = "";
  countries.forEach(country => {
    const { flags: {png: image}, name} = country
    const html = `<li class="country-list-item" data-name=${name[Object.keys(name)[0]]}>
                    <p class="list-country-name">${name[Object.keys(name)[0]]}</p>
                    <img src=${image} class="list-flag-image">
                  </li>`
    countryList.insertAdjacentHTML("beforeend", html)
  })
}
// try catch i toastify
async function getCountryByName(name) {
  const response = await fetch(baseUrl + `name/${name}`)
  const data = await response.json();
  return data
}

async function getCountryByRegion(region) {
  const response = await fetch(baseUrl + `region/${region}`)
  const data = await response.json();
  return data
}

async function getAllCountries() {
  const response = await fetch(baseUrl + `all`)
  const data = await response.json();
  console.log(data)
  return data
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  const data = await getCountryByName(searchInputValue)
  console.log("data", data)
  getCountryByName(searchInputValue)
    .then(data => {
      const { flags: {png: image}, capital, currencies, languages, population, name} = data[0];
      displaySelectedCountry(image, capital, currencies[Object.keys(currencies)[0]].name, languages[Object.keys(languages)], population, name[Object.keys(name)[0]])
    })
    .catch(error => console.log(error))

})

regionFilter.addEventListener("input", (event) => {
  if (event.target.value === "all") {
    getAllCountries()
      .then(data => {
        countriesManager.setCountries(data)
        displayCountriesList(data)
        paginateCountries(data)
      })
      .catch(error => console.log(error))
    return
  }
  getCountryByRegion(event.target.value)
    .then(data => displayCountriesList(data))
    .catch(error => console.log(error))
})

countryList.addEventListener("click", (event) => {
  if (event.target.closest("li").getAttribute("data-name")) {
    getCountryByName(event.target.closest("li").getAttribute("data-name"))
      .then(data => {
        console.log(data)
        const { flags: {png: image}, capital, currencies, languages, population, name} = data[0];
        displaySelectedCountry(image, capital, currencies[Object.keys(currencies)[0]].name, languages[Object.keys(languages)], population, name[Object.keys(name)[0]])
      })
      .catch(error => console.log(error))
  }
})

overlay.addEventListener("click", () => {
  overlay.style.visibility = "hidden"
  selectedCountry.style.visibility = "hidden"
})
