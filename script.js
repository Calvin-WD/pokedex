const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEAPI_POKEMON = "pokemon/";
const POKEMON_LOADING_INTERVAL = 30;

let pokemons = {};
let pokemonApiIndexCounter = 0;

async function init() {
  await loadPokemons();
  renderSmallCards(pokemons);
  console.log(pokemons);
  
}

/**
 * Load 30 (POKEMON_LOADING_INTERVAL) Pokemons from the PokeApi put them into the pokemons cache by usind the id as the key
 * Increases the global pokeapi-index-counter
 */
async function loadPokemons() {
  for (let index = 0; index < POKEMON_LOADING_INTERVAL; index++) {
    pokemonApiIndexCounter++;
    const pokemonApiObject = await getPokemonObjectFromPokeApi(pokemonApiIndexCounter);
    pokemons[pokemonApiIndexCounter] = getPokemonStatsForSmallCard(pokemonApiObject);
  }
}
