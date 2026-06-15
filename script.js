const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEAPI_POKEMON = "pokemon/";
const POKEAPI_TYPE = "type/";
const POKEMON_LOADING_INTERVAL = 40;

let pokemons = {};
let allTypeRefs = {};
let pokemonApiIndexCounter = 0;

async function init() {
  await loadPokemons();
  renderCards(pokemons);
  
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

async function loadMore() {
  await loadPokemons();
  renderCards(pokemons);
}

function openDialog(pokemonId) {
  let dialogRef = document.getElementById("dialog");
  renderDialog(dialogRef, pokemonId);
  dialogRef.showModal();
  document.body.classList.add("overFlowHidden");
}

function closeDialog() {
  let dialogRef = document.getElementById("dialog");
  dialogRef.close();
}

function disableBodyScrollability() {
  document.body.classList.remove("overFlowHidden");
}

function getPokemonFromCacheById(pokemonId) {
  return pokemons[pokemonId];
}
