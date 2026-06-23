const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEAPI_POKEMON = "pokemon/";
const POKEAPI_TYPE = "type/";
const POKEAPI_SPECIES = "pokemon-species/";
const POKEAPI_EVOCHAIN = "evolution-chain/";
const POKEAPI_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/";
const POKEMON_LOADING_INTERVAL = 40;

let pokemons = {};
let evoChains = {};
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
  }
}

async function loadTypeImages(pokemonApiObject) {
  const types = pokemons[pokemonApiObject.id].base.types;

  for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
    const type = types[typeIndex].type;
    let typeId = type.url.substring(POKEAPI_BASE_URL.length + POKEAPI_TYPE.length);
    const currentTypeObject = await getData(POKEAPI_TYPE + typeId);
    type["typeImage"] = currentTypeObject.sprites["generation-viii"]["legends-arceus"]["symbol_icon"];
  }
}

async function loadPokemonSpecies(pokemon) {
  const species = await getData(POKEAPI_SPECIES + pokemon.base.id);
  const evoChainUrl = species.evolution_chain.url;
  const evoChainId = evoChainUrl.substring(POKEAPI_BASE_URL.length + POKEAPI_EVOCHAIN.length, evoChainUrl.length - 1);
  pokemon["evoChain"] = { id: evoChainId, url: evoChainUrl };
}

async function loadPokemonEvoChain(evoChainId, evoChainUrl) {
  const evoChain = await getData(evoChainUrl.substring(POKEAPI_BASE_URL.length));
  evoChains[`${evoChainId}`] = evoChain.chain;
}

async function loadMorePokemon() {
  await loadPokemons();
  renderCards(pokemons);
}

async function openDialog(pokemonId) {
  const pokemon = getPokemonFromCacheById(pokemonId);
  await checkIfEvoChainIsLoaded(pokemon);
  let dialogRef = document.getElementById("dialog");
  renderDialog(dialogRef, pokemon);
  dialogRef.showModal();
  document.body.classList.add("overFlowHidden");
}

function closeDialog() {
  let dialogRef = document.getElementById("dialog");
  dialogRef.close();
}

async function checkIfEvoChainIsLoaded(pokemon) {
  if (!pokemon["evoChain"]) {
    await loadPokemonSpecies(pokemon);
  }
  if (!evoChains[`${pokemon.evoChain.id}`]) {
    await loadPokemonEvoChain(pokemon.evoChain.id, pokemon.evoChain.url);
    buildEvoChainObject(pokemon);
  }
}

function buildEvoChainObject(pokemon) {
  const evoChain = evoChains[pokemon.evoChain.id];
  addPokemonToEvoChainObject(getPokemonIdBySpeciesUrl(evoChain.species.url), evoChain, rank=1);
  if (!evoChain.evolves_to[0]) {
    return;
  } else {
    addPokemonToEvoChainObject(getPokemonIdBySpeciesUrl(evoChain.evolves_to[0].species.url), evoChain, rank=2);
    if (!evoChain.evolves_to[0].evolves_to[0]) {
      return;
    } else {
      addPokemonToEvoChainObject(getPokemonIdBySpeciesUrl(evoChain.evolves_to[0].evolves_to[0].species.url), evoChain, rank=3);
    }
  }
}

function addPokemonToEvoChainObject(pokemonId, evoChain, rank) {
  if (!evoChain["pokemons"]) {
    evoChain["pokemons"] = {};
  }
  evoChain.pokemons[rank] = {
    image: `${POKEAPI_IMG_URL + pokemonId}.png`,
  };
}

function getPokemonIdBySpeciesUrl(url) {
  return `${url}`.substring(POKEAPI_BASE_URL.length + POKEAPI_SPECIES.length, `${url}`.length - 1);
}

function disableBodyScrollability() {
  document.body.classList.remove("overFlowHidden");
}
