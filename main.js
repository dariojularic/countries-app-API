import './style.css';
import numeral from 'numeral';
import Toastify from 'toastify-js'

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
const pagination = document.querySelector(".pagination");
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

  paginateCountries(countries) {
    this.allCountries = [];
    const chunkSize = 10;
    let numOfPages = 1;
    pagination.innerHTML = "";

    for (let i = 0; i < countries.length; i += chunkSize) {
      this.allCountries.push(countries.slice(i, i + chunkSize))
      const html = `<li class="pagination-list-item">
                      <p class="pagination-number">${numOfPages}</p>
                    </li>`
      pagination.insertAdjacentHTML("beforeend", html)
      numOfPages++
    }
    // console.log("paginated chunks", chunks)
  }
}

const countriesManager = new CountriesManager();

function addToastify(errorMessage) {
  Toastify({
    text: errorMessage,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)"
    },
    offset: {
      x: 50,
      y: 10
    }
  }).showToast();
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

async function factoryFetch(url) {
  try {
    const response = await fetch(url)
    if (response.status !== 200) throw new Error("Something went wrong!");
    const data = await response.json();
    return data
  } catch (error) {
    addToastify(error)
  }
}

searchForm.addEventListener("submit",  (event) => {
  event.preventDefault()
  const url = baseUrl + `name/${searchInputValue}`
  factoryFetch(url)
    .then(data => {
      const { flags: {png: image}, capital, currencies, languages, population, name} = data[0];
      displaySelectedCountry(image, capital, currencies[Object.keys(currencies)[0]].name, languages[Object.keys(languages)], population, name[Object.keys(name)[0]])
    })
    .catch(error => console.log(error))
})

regionFilter.addEventListener("input", (event) => {
  if (event.target.value === "all") {
    const url = baseUrl + event.target.value;
    factoryFetch(url)
      .then(data => {
        countriesManager.paginateCountries(data)
        console.log(countriesManager.getAllCountries()[0])
        displayCountriesList(countriesManager.getAllCountries()[0])
      })
      .catch(error => console.log(error))
    return
  }
  const url = baseUrl + `region/${event.target.value}`
  factoryFetch(url)
    .then(data => {
      countriesManager.paginateCountries(data)
      displayCountriesList(countriesManager.getAllCountries()[0])
    })
    .catch(error => console.log(error))
})

countryList.addEventListener("click", (event) => {
  if (event.target.closest("li").getAttribute("data-name")) {
    const url = baseUrl + `name/${event.target.closest("li").getAttribute("data-name")}`
    factoryFetch(url)
      .then(data => {
        const { flags: {png: image}, capital, currencies, languages, population, name} = data[0];
        displaySelectedCountry(image, capital, currencies[Object.keys(currencies)[0]].name, languages[Object.keys(languages)], population, name[Object.keys(name)[0]])
      })
      .catch(error => console.log(error))
  }
})

pagination.addEventListener("click", (event) => {
  console.log(event.target.innerHTML)
  displayCountriesList(countriesManager.getAllCountries()[event.target.innerHTML - 1])
})

overlay.addEventListener("click", () => {
  overlay.style.visibility = "hidden"
  selectedCountry.style.visibility = "hidden"
})
