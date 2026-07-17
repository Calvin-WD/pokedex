const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEAPI_POKEMON = "pokemon/";
const POKEAPI_TYPE = "type/";
const POKEAPI_SPECIES = "pokemon-species/";
const POKEAPI_EVOCHAIN = "evolution-chain/";
const POKEAPI_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/";
const POKEMON_LOADING_INTERVAL = 20;
let pokemons = {};
let visiblePokemonIds = [];
let types = {};
let typeRequests = {};
let evoChains = {};
let pokemonApiIndexCounter = 0;
let isLoadingMorePokemon = false;

/**
 * Loads the next batch of Pokémon, caching their base and type data while a loading spinner is shown.
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

/**
 * Loads one Pokémon from a batch list entry and prepares its cached data.
 */
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
  if (isLoadingMorePokemon) return;

  isLoadingMorePokemon = true;

  try {
    const loadedPokemons = await loadPokemons();
    renderLoadedPokemonCards(loadedPokemons);
  } catch (error) {
    setLoadingErrorMessage(error);
  } finally {
    isLoadingMorePokemon = false;
  }
}

/**
 * Ensures all type data for a cached Pokémon is available.
 */
async function ensureTypesAreLoaded(pokemonApiObject) {
  const currentTypes = pokemons[pokemonApiObject.id].base.types;

  await loadTypes(currentTypes);
}

/**
 * Loads missing Pokémon type data and stores it in the shared type cache.
 */
async function loadTypes(currentTypes) {
  await Promise.all(
    currentTypes.map(async (currentType) => {
      if (isTypeLoaded(currentType)) {
        return;
      }
      ensureTypeRequestIsStarted(currentType);
      await finishTypeRequest(currentType);
    }),
  );
}

/**
 * Checks whether data for a Pokémon type is already cached.
 */
function isTypeLoaded(currentType) {
  if (types[currentType.type.name]) {
    return true;
  } else {
    return false;
  }
}

/**
 * Starts a shared type API request if no request is running yet.
 */
function ensureTypeRequestIsStarted(currentType) {
  if (!typeRequests[currentType.type.name]) {
    const typeId = currentType.type.url.substring(POKEAPI_BASE_URL.length + POKEAPI_TYPE.length);
    typeRequests[currentType.type.name] = fetchPokeApiData(POKEAPI_TYPE + typeId);
  }
}

/**
 * Waits for a type API request and stores the result if needed.
 */
async function finishTypeRequest(currentType) {
  const currentTypeObject = await typeRequests[currentType.type.name];

  if (!types[currentType.type.name]) {
    cacheTypeData(createTypeCacheData(currentTypeObject));
  }
}

/**
 * Creates the local type data structure from a type API response.
 */
function createTypeCacheData(currentTypeObject) {
  return {
    name: currentTypeObject.name,
    image: currentTypeObject.sprites["generation-viii"]["legends-arceus"]["symbol_icon"],
  };
}

/**
 * Stores the relevant type data in the shared type cache.
 */
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

/**
 * Loads the next Pokémon batch list from the PokéAPI.
 */
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
 * Adds one evolution stage to the simplified evolution chain object and returns the next stage in the chain.
 */
function addPokemonToEvoChainObject(pokemonId, evoChain, nextEvoChain, evoRank) {
  ensureEvoChainHasPokemonObject(evoChain);
  
  evoChain.pokemons[evoRank] = {
    name: capitalize(nextEvoChain.species.name),
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
 * Returns the id from a cached Pokémon object.
 */
function getPokemonId(pokemon) {
  return pokemon.base.id;
}

/**
 * Returns the ids from a list of cached Pokémon objects.
 */
function getPokemonIds(pokemonsToMap) {
  return pokemonsToMap.map((pokemon) => getPokemonId(pokemon));
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
 * Extracts a Pokémon id from an API URL.
 */
function getPokemonIdByUrl(url, source) {
  return `${url}`.substring(POKEAPI_BASE_URL.length + source.length, `${url}`.length - 1);
}

/**
 * Returns all cached Pokémon, filtered by name once the search value is at least three characters long.
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
 * Wraps a visible Pokémon index within the bounds of the visible Pokémon list.
 */
function validVisiblePokemonIndex(visiblePokemonIndex) {
  if (visiblePokemonIndex < 0) {
    return visiblePokemonIds.length - 1;
  } else if (visiblePokemonIndex >= visiblePokemonIds.length) {
    return 0;
  } else {
    return visiblePokemonIndex;
  }
}

/**
 * Shows the loading error message in the main content area.
 */
function setLoadingErrorMessage(error) {
  const contentWrapperRef = document.getElementById("pokemon-card-list");

  contentWrapperRef.innerHTML = getFeedbackMessageTemplate("Currently we have Problems with loading more Pokemon!");
  console.error(error);
}
