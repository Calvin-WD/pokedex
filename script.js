const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEAPI_POKEMON = "pokemon/";
const POKEAPI_TYPE = "type/";
const POKEMON_LOADING_INTERVAL = 30;

let pokemons = {};
let allTypeRefs = {};
let pokemonApiIndexCounter = 0;

async function init() {
  await loadPokemons();
  renderSmallCards(pokemons);
}

/**
 * Loads 30 (POKEMON_LOADING_INTERVAL) Pokemons from the PokeApi, put them into the pokemons cache by using the id as the key
 * Increases the global pokeapi-index-counter
 */
async function loadPokemons() {
  for (let index = 0; index < POKEMON_LOADING_INTERVAL; index++) {
    pokemonApiIndexCounter++;
    const pokemonApiObject = await getPokemonObjectFromPokeApi(pokemonApiIndexCounter);
    pokemons[pokemonApiIndexCounter] = await getPokemonStatsForSmallCard(pokemonApiObject);
  }
}