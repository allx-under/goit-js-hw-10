import './css/styles.css';
import { fetchCountries } from './js/fetchCoutries';
import { Notify } from 'notiflix';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const refs = {
    countryInput: document.querySelector('#search-box'),
    countries: document.querySelector('.country-list')
}

refs.countryInput.addEventListener('input',debounce(onInputSearch, DEBOUNCE_DELAY))

function onInputSearch(e) {
    const countryToSearch = e.target.value.trim();

    if (countryToSearch === "") {
        clearCountries();
        return;
    }
    fetchCountries(countryToSearch)
        .then(countries => {
            if (countries.length > 10) {
                Notify.info("Too many matches found. Please enter a more specific name.");
                clearCountries();
            } else if (countries.length >= 2) {
                renderCountries(countries)
            } else {
                renderDetailCountry(countries)
            }
        })
        .catch(() => {
            Notify.failure("Oops, there is no country with that name");
            e.target.value = "";
            clearCountries();
        })
}

function renderCountries(countries) {
    const countryList = countries.map(country => `<li><img width=30px src="${country.flags.svg}" alt="${country.name.official}"> <span>${country.name.official}</span></li>`).join('');
    refs.countries.innerHTML = countryList;
}

function renderDetailCountry(countries) {
    const country = countries.map(country => { 
        return `<li>
                <img width=30px src="${country.flags.svg}" alt="${country.name.official}"></img>
                <h2 style="display: inline-block">${country.name.official}</h2>
                <p>Capital: ${country.capital}</p>
                <p>Population: ${country.population}</p>
                <p>Languages: ${Object.values(country.languages)}</p>
                </li>`
    }).join('');
    refs.countries.innerHTML = country;
}

function clearCountries() {
    refs.countries.textContent = ""
}
