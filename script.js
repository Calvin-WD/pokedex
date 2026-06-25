const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEAPI_POKEMON = "pokemon/";
const POKEAPI_TYPE = "type/";
const POKEAPI_SPECIES = "pokemon-species/";
const POKEAPI_EVOCHAIN = "evolution-chain/";
const POKEAPI_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/";
const POKEMON_LOADING_INTERVAL = 40;

async function init() {
  const loadedPokemon = await loadPokemons();
  renderCards(loadedPokemon);
}