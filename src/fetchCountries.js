const BASE_URL = 'https://restcountries.com/v3.1/name';
const SEARCH_FILTER = 'fields=name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(`${BASE_URL}/${name}?${SEARCH_FILTER}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
}

export default { fetchCountries };
