import './style.css'

const searchInput = document.querySelector(".country-name-input");
const continentFilter = document.querySelector(".continent-filter");

let searchInputValue = "";

searchInput.addEventListener("input", () => searchInputValue = searchInput.value)

async function getCountryByName(name) {
  const response = await fetch(`https://restcountries.com/v3.1/name/${name}`)
  const data = await response.json();
  console.log(data)
}

async function getCountryByContinent(continent) {
  const response = await fetch(`https://restcountries.com/v3.1/region/${continent}`)
  const data = await response.json();
  console.log(data)
}

async function getAllCountries() {
  const response = await fetch(`https://restcountries.com/v3.1/all`)
  const data = await response.json();
  console.log(data)
}
getAllCountries()
