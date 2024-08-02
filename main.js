import './style.css'

const searchInput = document.querySelector(".country-name-input");
const continentFilter = document.querySelector(".continent-filter");
const searchForm = document.querySelector(".search-form");
const overlay = document.querySelector(".overlay");
const selectedCountry = document.querySelector(".selected-country");


let searchInputValue = "";
const baseUrl = `https://restcountries.com/v3.1/`;

searchInput.addEventListener("input", () => searchInputValue = searchInput.value)

async function getCountryByName(name) {
  const response = await fetch(baseUrl + `name/${name}`)
  const data = await response.json();
  console.log(data)
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
})

overlay.addEventListener("click", () => {
  overlay.style.visibility = "hidden"
  selectedCountry.style.visibility = "hidden"
})
