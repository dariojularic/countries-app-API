import './style.css';
import numeral from 'numeral';

const searchInput = document.querySelector(".country-name-input");
const continentFilter = document.querySelector(".continent-filter");
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

let searchInputValue = "";
const baseUrl = `https://restcountries.com/v3.1/`;

searchInput.addEventListener("input", () => searchInputValue = searchInput.value)

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
  console.log("dadada", countries)

  countries.forEach(country => {
    const { flags: {png: image}, name} = country
    const html = `<li class="country-list-item">
                    <p class="list-country-name">${name[Object.keys(name)[0]]}</p>
                    <img src=${image} class="list-flag-image">
                  </li>`
    console.log("country", country)
    console.log("image", image)
    console.log("name", name)
    countryList.insertAdjacentHTML("beforeend", html)
  })
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
  // console.log(data)
  return data
}

async function getAllCountries() {
  const response = await fetch(baseUrl + `all`)
  const data = await response.json();
  // console.log(data)
  return data
}

getAllCountries()

searchForm.addEventListener("submit", (event) => {
  event.preventDefault()

  getCountryByName(searchInputValue)
    .then(data => {
      const { flags: {png: image}, capital, currencies, languages, population, name} = data[0];
      // console.log("dataaafaf", languages[Object.keys(languages)])

      displaySelectedCountry(image, capital, currencies[Object.keys(currencies)[0]].name, languages[Object.keys(languages)], population, name[Object.keys(name)[0]])
      // selectedCountryFlag.src = data[0].flags.png
      // console.log("data", name[Object.keys(name)[0]])
    })
    .catch(error => console.log(error))

})

continentFilter.addEventListener("input", (event) => {
  // console.log(event.target.value)
  if (event.target.value === "all") {
    getAllCountries()
      .then(data => displayCountriesList(data))
      .catch(error => console.log(error))
    return
  }
  getCountryByContinent(event.target.value);
})

overlay.addEventListener("click", () => {
  overlay.style.visibility = "hidden"
  selectedCountry.style.visibility = "hidden"
})
