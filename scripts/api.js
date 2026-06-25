/**
 * Fetches JSON data from the PokéAPI for the given path.
 */
async function fetchPokeApiData(path = "") {
  const response = await fetch(POKEAPI_BASE_URL + path);
  return await response.json();
}
