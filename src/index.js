import getRefs from './get-refs';
import API from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = getRefs();

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const inputText = e.target.value.trim();

  if (refs.inputEl.value === '') {
    clearMarkupCountryCard();
    clearMarkupCountrysList();
    return;
  }

  API.fetchCountries(inputText).then(renderCountry).catch(onFetchError);
}

function onFetchError(error) {
  clearMarkupCountryCard();
  clearMarkupCountrysList();
  
  Notify.failure('Oops, there is no country with that name');
}

function renderCountry(name) {
  
  if (name.length > 10) {
    clearMarkupCountryCard();
    clearMarkupCountrysList();
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (name.length >= 2 && name.length <= 10) {
    markupCountrysList(name);
    clearMarkupCountryCard();
  } else {
    markupCountryCard(name);
    clearMarkupCountrysList();
  }
}

function markupCountryCard(country) {
  const markup = country
    .map(
      ({
        name: { official },
        capital,
        population,
        flags: { svg },
        languages,
      }) => {
        const langList = Object.values(languages).map(
          language => ' ' + language
        );
        return `  <div class='country-info__name-thumb'><img src="${svg}" alt="flag" width="30" height="20" class="country-info__img" /><span
      class="country-info__name"
    >${official}</span></div>
    <ul class="country-info__list">
      <li class="country-info__item">
        <p class="country-info__text"><b>Capital:</b> <span class="country-info__text-description">${capital}</span></p>
      </li>
      <li class="country-info__item">
        <p class="country-info__text"><b>Population:</b> <span class="country-info__text-description">${population}</span></p>
      </li>
      <li class="country-info__item">
        <p class="country-info__text"><b>Languages:</b> <span class="country-info__text-description">${langList}</span></p>
      </li>
    </ul>`;
      }
    )
    .join('');
  refs.countryInfo.innerHTML = markup;
}

function markupCountrysList(countrys) {
  const markup = countrys
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class='country-item'><img src="${svg}" alt="flag" width="30" height="20" class="country-item__img" /><span
      class="country-item__name"
    >${official}</span></li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function clearMarkupCountryCard() {
  refs.countryInfo.innerHTML = '';
}

function clearMarkupCountrysList() {
  refs.countryList.innerHTML = '';
}
