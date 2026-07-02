const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEAPI_POKEMON = "pokemon/";
const POKEAPI_TYPE = "type/";
const POKEAPI_SPECIES = "pokemon-species/";
const POKEAPI_EVOCHAIN = "evolution-chain/";
const POKEAPI_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/";
const POKEMON_LOADING_INTERVAL = 40;
let pokemons = {};
let types = {};
let typeRequests = {};
let evoChains = {};
let pokemonApiIndexCounter = 0;

/**
 * Loads the next batch of Pokémon and stores their base data.
 */
async function loadPokemons() {
  showHideLoadingSpinner();
  try {
    const pokemonBatchList = await loadPokemonBatchListFromPokeApi();
    const loadedPokemons = await Promise.all(
      pokemonBatchList.results.map((pokemon) => loadPokemonByListEntry(pokemon)),
    );
    pokemonApiIndexCounter += POKEMON_LOADING_INTERVAL;
    return loadedPokemons;
  } finally {
    showHideLoadingSpinner();
  }
}

async function loadPokemonByListEntry(pokemon) {
  const id = getPokemonIdByUrl(pokemon.url, POKEAPI_POKEMON);
  const pokemonApiObject = await fetchPokeApiData(POKEAPI_POKEMON + id);
  cachePokemonBaseData(pokemonApiObject);
  await ensureTypesAreLoaded(pokemonApiObject);
  return pokemons[pokemonApiObject.id];
}

/**
 * Loads another Pokémon batch and updates the card list based on the current search.
 */
async function loadMorePokemons() {
  try {
    const loadedPokemons = await loadPokemons();
    const inputRef = document.querySelector('[data-id="search-input"]');
    if (!inputRef.value) {
      renderCards(loadedPokemons);
    } else {
      renderFilteredCards(inputRef.value);
    }
  } catch (error) {
    const contentWrapperRef = document.getElementById("content-wrapper");
    contentWrapperRef.innerHTML = getMessageTemplate("Loading more Failure!");
    console.error(error);
  }
}

/**
 * Loads and adds icon images for each type of a cached Pokémon.
 */
async function loadTypes(currentTypes) {
  await Promise.all(
    currentTypes.map(async (currentType) => {
      if (types[currentType.type.name]) {
        console.log(`${currentType.type.name} is alreay loaded!`);
        return;
      }
      if (!typeRequests[currentType.type.name]) {
        const typeId = currentType.type.url.substring(POKEAPI_BASE_URL.length + POKEAPI_TYPE.length);
        typeRequests[currentType.type.name] = fetchPokeApiData(POKEAPI_TYPE + typeId);
      }
      const currentTypeObject = await typeRequests[currentType.type.name];
      if (!types[currentType.type.name]) {
        cacheTypeData(createTypeCacheData(currentTypeObject));
        console.log(`${currentType.type.name} has loaded!`);
      }
    }),
  );
}

async function ensureTypesAreLoaded(pokemonApiObject) {
  const currentTypes = pokemons[pokemonApiObject.id].base.types;
  await loadTypes(currentTypes);
}

function createTypeCacheData(currentTypeObject) {
  return {
    name: currentTypeObject.name,
    image: currentTypeObject.sprites["generation-viii"]["legends-arceus"]["symbol_icon"],
  };
}

function cacheTypeData(typeData) {
  types[typeData.name] = {
    name: typeData.name,
    image: typeData.image,
  };
}

/**
 * Loads species data and stores the Pokémon's evolution chain reference.
 */
async function loadPokemonSpecies(pokemon) {
  const species = await fetchPokeApiData(POKEAPI_SPECIES + pokemon.base.id);
  const evoChainUrl = species.evolution_chain.url;
  const evoChainId = evoChainUrl.substring(POKEAPI_BASE_URL.length + POKEAPI_EVOCHAIN.length, evoChainUrl.length - 1);
  pokemon["evoChain"] = { id: evoChainId, url: evoChainUrl };
}

/**
 * Loads and caches an evolution chain by its id.
 */
async function loadPokemonEvoChain(evoChainId, evoChainUrl) {
  const evoChain = await fetchPokeApiData(evoChainUrl.substring(POKEAPI_BASE_URL.length));
  evoChains[`${evoChainId}`] = evoChain.chain;
}

async function loadPokemonBatchListFromPokeApi() {
  return await fetchPokeApiData(`pokemon?limit=${POKEMON_LOADING_INTERVAL}&offset=${pokemonApiIndexCounter}`);
}

/**
 * Creates the local base data structure from a Pokémon API response.
 */
function createPokemonBaseData(pokemonApiObject) {
  return {
    base: {
      id: pokemonApiObject.id,
      name: pokemonApiObject.name,
      height: pokemonApiObject.height,
      weight: pokemonApiObject.weight,
      abilities: pokemonApiObject.abilities,
      types: pokemonApiObject.types,
      sprites: pokemonApiObject.sprites,
      stats: pokemonApiObject.stats,
    },
  };
}

/**
 * Stores the relevant base data for one Pokémon in the cache.
 */
function cachePokemonBaseData(pokemonApiObject) {
  const baseData = createPokemonBaseData(pokemonApiObject);
  pokemons[pokemonApiObject.id] = baseData;
}

/**
 * Ensures the selected Pokémon has its evolution chain data available.
 */
async function ensureEvoChainIsLoaded(pokemon) {
  if (!pokemon["evoChain"]) {
    await loadPokemonSpecies(pokemon);
  }
  if (!evoChains[`${pokemon.evoChain.id}`]) {
    await loadPokemonEvoChain(pokemon.evoChain.id, pokemon.evoChain.url);
    buildEvoChainObject(pokemon);
  }
}

/**
 * Builds a simplified evolution chain object with Pokémon image references.
 */
function buildEvoChainObject(pokemon) {
  let evoChain = evoChains[pokemon.evoChain.id];
  let nextEvoChain = evoChain;
  let evoRank = 1;
  while (nextEvoChain) {
    let currentPokemonId = getPokemonIdByUrl(nextEvoChain.species.url, POKEAPI_SPECIES);
    nextEvoChain = addPokemonToEvoChainObject(currentPokemonId, evoChain, nextEvoChain, evoRank);
    evoRank++;
  }
}

/**
 * Adds one evolution stage to the simplified evolution chain object.
 */
function addPokemonToEvoChainObject(pokemonId, evoChain, nextEvoChain, evoRank) {
  ensureEvoChainHasPokemonObject(evoChain);
  evoChain.pokemons[evoRank] = {
    image: `${POKEAPI_IMG_URL + pokemonId}.png`,
  };
  return nextEvoChain.evolves_to[0];
}

/**
 * Ensures the evolution chain has a container for its Pokémon stages.
 */
function ensureEvoChainHasPokemonObject(evoChain) {
  if (!evoChain["pokemons"]) {
    evoChain["pokemons"] = {};
  }
}

/**
 * Returns a cached Pokémon by its id or logs an error if it is missing.
 */
function getPokemonFromCacheById(pokemonId) {
  if (pokemons[pokemonId]) {
    return pokemons[pokemonId];
  } else {
    console.error("Pokemon is not cached yet!");
  }
}

/**
 * Extracts a Pokémon id from a API URL.
 */
function getPokemonIdByUrl(url, source) {
  return `${url}`.substring(POKEAPI_BASE_URL.length + source.length, `${url}`.length - 1);
}

/**
 * Returns cached Pokémon whose names include a search value with at least three characters.
 */
function filterPokemonValuesByName(searchValue) {
  let filteredPokemonsArray = Object.values(pokemons);
  if (searchValue.length >= 3) {
    filteredPokemonsArray = filteredPokemonsArray.filter((element) =>
      element.base.name.includes(searchValue.toLowerCase()),
    );
  }
  return filteredPokemonsArray;
}

/**
 * Returns the Pokémon's ability names as a readable string.
 */
function getAbilityNamesAsString(pokemon) {
  let abilityNames = [];
  for (let abilityIndex = 0; abilityIndex < pokemon.base.abilities.length; abilityIndex++) {
    const abilityName = pokemon.base.abilities[abilityIndex].ability.name;
    abilityNames.push(capitalize(abilityName));
  }
  return abilityNames.join(", ");
}

/**
 * Creates the data rows used to render the dialog's stats tab.
 */
function getStatsTabContentAsArray(pokemonStatsArray) {
  let statsTabContentArray = [];
  for (let statsIndex = 0; statsIndex < pokemonStatsArray.length; statsIndex++) {
    const currentStat = pokemonStatsArray[statsIndex];
    statsTabContentArray.push({ title: currentStat.stat.name, value: currentStat.base_stat });
  }
  return statsTabContentArray;
}
