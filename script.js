const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEAPI_POKEMON = "pokemon/";
const POKEAPI_TYPE = "type/";
const POKEAPI_SPECIES = "pokemon-species/";
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
    const pokemonApiObject = await getData(POKEAPI_POKEMON + pokemonApiIndexCounter);
    cachePokemonBaseData(pokemonApiObject);
    await loadTypeImages(pokemonApiObject);
    console.log(pokemonApiObject);
    
  }
  
  console.log(pokemons);
  
}

async function loadTypeImages(pokemonApiObject) {
  const types = pokemons[pokemonApiObject.id].base.types;

  for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
    const type = types[typeIndex].type;
    let typeId = type.url.substr(POKEAPI_BASE_URL.length + POKEAPI_TYPE.length);
    const currentTypeObject = await getData(POKEAPI_TYPE + typeId);
    type["typeImage"] = currentTypeObject.sprites["generation-viii"]["legends-arceus"]["symbol_icon"];
  }
}

async function loadPokemonSpecies(pokemonId) {
  const species = await getData(POKEAPI_SPECIES + pokemonId);
  pokemons[pokemonId]["extension"] = { species: species };
}

async function loadMorePokemon() {
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

