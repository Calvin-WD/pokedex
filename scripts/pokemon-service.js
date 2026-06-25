let pokemons = {};
let evoChains = {};
let pokemonApiIndexCounter = 0;

async function loadPokemons() {
  let loadedPokemons = [];
  for (let index = 0; index < POKEMON_LOADING_INTERVAL; index++) {
    pokemonApiIndexCounter++;
    const pokemonApiObject = await fetchPokeApiData(POKEAPI_POKEMON + pokemonApiIndexCounter);
    cachePokemonBaseData(pokemonApiObject);
    await loadTypeImages(pokemonApiObject);
    loadedPokemons.push(pokemons[pokemonApiObject.id]);
  }
  return loadedPokemons;
}

function cachePokemonBaseData(pokemonApiObject) {
  const baseData = createPokemonBaseData(pokemonApiObject);
  pokemons[pokemonApiObject.id] = baseData;
}

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

async function loadTypeImages(pokemonApiObject) {
  const types = pokemons[pokemonApiObject.id].base.types;

  for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
    const type = types[typeIndex].type;
    let typeId = type.url.substring(POKEAPI_BASE_URL.length + POKEAPI_TYPE.length);
    const currentTypeObject = await fetchPokeApiData(POKEAPI_TYPE + typeId);
    type["typeImage"] = currentTypeObject.sprites["generation-viii"]["legends-arceus"]["symbol_icon"];
  }
}

async function loadPokemonSpecies(pokemon) {
  const species = await fetchPokeApiData(POKEAPI_SPECIES + pokemon.base.id);
  const evoChainUrl = species.evolution_chain.url;
  const evoChainId = evoChainUrl.substring(POKEAPI_BASE_URL.length + POKEAPI_EVOCHAIN.length, evoChainUrl.length - 1);
  pokemon["evoChain"] = { id: evoChainId, url: evoChainUrl };
}

async function loadPokemonEvoChain(evoChainId, evoChainUrl) {
  const evoChain = await fetchPokeApiData(evoChainUrl.substring(POKEAPI_BASE_URL.length));
  evoChains[`${evoChainId}`] = evoChain.chain;
}

async function loadMorePokemons() {
  const loadMoreButtonRef = document.querySelector('[data-id="load-more-button"]');
  toggleDisable(loadMoreButtonRef);
  const loadedPokemons = await loadPokemons();
  const inputRef = document.querySelector('[data-id="search-input"]');
  if (!inputRef.value) {
    renderCards(loadedPokemons);
  } else {
    renderFilteredCards(inputRef.value);
  }
  toggleDisable(loadMoreButtonRef);
}

async function ensureEvoChainIsLoaded(pokemon) {
  if (!pokemon["evoChain"]) {
    await loadPokemonSpecies(pokemon);
  }
  if (!evoChains[`${pokemon.evoChain.id}`]) {
    await loadPokemonEvoChain(pokemon.evoChain.id, pokemon.evoChain.url);
    buildEvoChainObject(pokemon);
  }
}

function buildEvoChainObject(pokemon) {
  let evoChain = evoChains[pokemon.evoChain.id];
  let nextEvoChain = evoChain;
  let evoRank = 1;
  while (nextEvoChain) {
    let currentPokemonId = getPokemonIdBySpeciesUrl(nextEvoChain.species.url);
    nextEvoChain = addPokemonToEvoChainObject(currentPokemonId, evoChain, nextEvoChain, evoRank);
    evoRank++;
  }
}

function addPokemonToEvoChainObject(pokemonId, evoChain, nextEvoChain, evoRank) {
  ensureEvoChainHasPokemonObject(evoChain);
  evoChain.pokemons[evoRank] = {
    image: `${POKEAPI_IMG_URL + pokemonId}.png`,
  };
  return nextEvoChain.evolves_to[0];
}

function ensureEvoChainHasPokemonObject(evoChain) {
  if (!evoChain["pokemons"]) {
    evoChain["pokemons"] = {};
  }
}

function getPokemonFromCacheById(pokemonId) {
  return pokemons[pokemonId];
}

function getPokemonIdBySpeciesUrl(url) {
  return `${url}`.substring(POKEAPI_BASE_URL.length + POKEAPI_SPECIES.length, `${url}`.length - 1);
}

function filterPokemonValuesByName(searchValue) {
  // currentPokemons = pokemons;
  let filteredPokemonsArray = Object.values(pokemons);
  filteredPokemonsArray = filteredPokemonsArray.filter((element) => element.base.name.includes(searchValue));
  return filteredPokemonsArray;
}

function getAbilityNamesAsString(pokemon) {
  let abilityNames = [];
  for (let abilityIndex = 0; abilityIndex < pokemon.base.abilities.length; abilityIndex++) {
    const abilityName = pokemon.base.abilities[abilityIndex].ability.name;
    abilityNames.push(capitalize(abilityName));
  }
  return abilityNames.join(", ");
}

function getAboutTabContentAsArray(pokemon, abilityNames) {
  return [
    { value: pokemon.base.name, title: "Name" },
    { value: pokemon.base.height, title: "Height" },
    { value: pokemon.base.weight, title: "Weight" },
    { value: abilityNames, title: "Abilities" },
  ];
}

function getStatsTabContentAsArray(pokemonStatsArray) {
  let statsTabContentArray = [];
  for (let statsIndex = 0; statsIndex < pokemonStatsArray.length; statsIndex++) {
    const currentStat = pokemonStatsArray[statsIndex];
    statsTabContentArray.push({ title: currentStat.stat.name, value: currentStat.base_stat });
  }
  return statsTabContentArray;
}
