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
const paginationContainer = document.querySelector(".pagination-container");
const closeBtn = document.querySelector(".fa-x");
const loader = document.querySelector(".loader");

let searchInputValue = "";
const baseUrl = `https://restcountries.com/v3.1/`;

searchInput.addEventListener("input", (event) => searchInputValue = event.target.value);

class CountriesManager{
  constructor() {
    this.allCountries = [];
    this.activePage = 1;
    this.activeCountries = [];
    this.selectedCountry = null;
  }

  setAllCountries(countries) {
    this.allCountries = countries
  }

  getAllCountries() {
    return this.allCountries
  }

  resetSelectedCountry() {
    this.selectedCountry = null;
  }

  setSelectedCountry(country) {
    this.selectedCountry = country;
  }

  getSelectedCountry() {
    return this.selectedCountry;
  }

  setActivePage(pageNumber) {
    this.activePage = pageNumber;
  }

  getActivePage() {
    return this.activePage;
  }

  resetActivePage() {
    this.activePage = 1;
  }

  setActiveCountries() {
    this.activeCountries = this.allCountries[this.activePage - 1];
  }

  getActiveCountries() {
    return this.activeCountries;
  }

  paginateCountries(countries) {
    const paginatedCountries = [];
    const chunkSize = 20;
    let pageNumber = 1;
    pagination.innerHTML = "";

    for (let i = 0; i < countries.length; i += chunkSize) {
      paginatedCountries.push(countries.slice(i, i + chunkSize));
      const html = `<li class="pagination-list-item item-${pageNumber}">${pageNumber}</li>`;
      pagination.insertAdjacentHTML("beforeend", html);
      pageNumber++;
    }
    pagination.querySelector(`.item-${this.getActivePage()}`).classList.add("selected-page");
    return paginatedCountries;
  }
}

function addToastify(errorMessage) {
  Toastify({
    text: errorMessage,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #ff0000, #800000)"
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
    const { flags: {png: image}, name} = country;
    const html = `<li class="country-list-item" data-name=${name[Object.keys(name)[0]].split(" ").join("-")}>
                    <p class="list-country-name">${name[Object.keys(name)[0]]}</p>
                    <img src=${image} class="list-flag-image">
                  </li>`;
    countryList.insertAdjacentHTML("beforeend", html);
  })
}

async function factoryFetch(url) {
  try {
    const response = await fetch(url)
    if (response.status !== 200) throw new Error("Something went wrong!");
    const data = await response.json();
    return data;
  } catch (error) {
    addToastify(error);
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  const countriesManager = new CountriesManager();

  factoryFetch(baseUrl + "all")
    .then(data => {
      loader.style.visibility = "hidden";
      paginationContainer.style.visibility = "visible"
      countriesManager.setAllCountries(countriesManager.paginateCountries(data));
      countriesManager.setActiveCountries();
      displayCountriesList(countriesManager.getActiveCountries());
    })
    .catch(error => console.log(error));

  searchForm.addEventListener("submit",  (event) => {
    event.preventDefault();
    const url = baseUrl + `name/${searchInputValue}?fullText=true`;
  factoryFetch(url)
  .then(data => {
    countriesManager.setSelectedCountry(data[0])
      const { flags: {png: image}, capital, currencies, languages, population, name} = countriesManager.getSelectedCountry();
      displaySelectedCountry(image, capital, currencies[Object.keys(currencies)[0]].name, languages[Object.keys(languages)], population, name[Object.keys(name)[0]]);
    })
    .catch(error => console.log(error));
  })

  regionFilter.addEventListener("input", (event) => {
    if (event.target.value === "all") {
    const url = baseUrl + event.target.value;
    factoryFetch(url)
      .then(data => {
        countriesManager.resetActivePage();
        countriesManager.setAllCountries(countriesManager.paginateCountries(data));
        countriesManager.setActiveCountries()
        displayCountriesList(countriesManager.getActiveCountries());
      })
      .catch(error => console.log(error));
    return;
    }
    const url = baseUrl + `region/${event.target.value}`;
    factoryFetch(url)
    .then(data => {
      countriesManager.resetActivePage();
      countriesManager.setAllCountries(countriesManager.paginateCountries(data));
      countriesManager.setActiveCountries()
      displayCountriesList(countriesManager.getActiveCountries());
    })
    .catch(error => console.log(error));
  })

  countryList.addEventListener("click", (event) => {
    if (event.target.closest("li").getAttribute("data-name")) {
      const url = baseUrl + `name/${event.target.closest("li").getAttribute("data-name").split("-").join(" ")}?fullText=true`;
      factoryFetch(url)
        .then(data => {
          countriesManager.setSelectedCountry(data[0]);
          const { flags: {png: image}, capital, currencies, languages, population, name} = countriesManager.getSelectedCountry();
          displaySelectedCountry(image, capital, currencies[Object.keys(currencies)[0]].name, languages[Object.keys(languages)], population, name[Object.keys(name)[0]]);
        })
        .catch(error => console.log(error));
      }
  });

  pagination.addEventListener("click", (event) => {
    if (event.target.closest("li").classList.contains("pagination-list-item")) {
      const listItem = event.target.closest("li");
      pagination.querySelector(`.item-${countriesManager.getActivePage()}`).classList.remove("selected-page");
      countriesManager.setActivePage(listItem.textContent);
      listItem.classList.add("selected-page");
      countriesManager.setActiveCountries()
      displayCountriesList(countriesManager.getActiveCountries());
    }
  });

  paginationContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("fa-arrow-left") && countriesManager.getActivePage() > 1) {
      pagination.querySelector(`.item-${countriesManager.getActivePage()}`).classList.remove("selected-page");
      countriesManager.setActivePage(parseInt(countriesManager.getActivePage()) - 1);
      pagination.querySelector(`.item-${countriesManager.getActivePage()}`).classList.add("selected-page");
      countriesManager.setActiveCountries()
      displayCountriesList(countriesManager.getActiveCountries());
    }

    if (event.target.classList.contains("fa-arrow-right") && countriesManager.getActivePage() < countriesManager.getAllCountries().length) {
      pagination.querySelector(`.item-${countriesManager.getActivePage()}`).classList.remove("selected-page");
      countriesManager.setActivePage(parseInt(countriesManager.getActivePage()) + 1);
      pagination.querySelector(`.item-${countriesManager.getActivePage()}`).classList.add("selected-page");
      countriesManager.setActiveCountries()
      displayCountriesList(countriesManager.getActiveCountries());
    }
  });

  overlay.addEventListener("click", () => {
    overlay.style.visibility = "hidden";
    selectedCountry.style.visibility = "hidden";
    countriesManager.resetSelectedCountry();
  });

  closeBtn.addEventListener("click", () => {
    overlay.style.visibility = "hidden";
    selectedCountry.style.visibility = "hidden";
    countriesManager.resetSelectedCountry();
  });
});
