async function getData(path = "") {
  let response = await fetch(POKEAPI_BASE_URL + path);
  return (responseToJson = await response.json());
}

/**
 * Gets the pokemon object from the Pokeapi using the id and returns it
 */
async function getPokemonObjectFromPokeApi(id="") {
  return await getData(POKEAPI_POKEMON + id);
}

/**
 * Gets all types from the Pokeapit and returns it
 */
async function getTypeObjectFromPokeApi(id="") {
  return await getData(POKEAPI_TYPE + id);
}

/** 
 * Returns the type images url based on the type id
 */
async function getTypeImageUrl(typeId) {
  let typeObject = await getTypeObjectFromPokeApi(typeId);
  return typeObject.sprites["generation-viii"]["legends-arceus"]["symbol_icon"];
}

async function getSpeciesObjectFromApi(id="") {
  return await getData(POKEAPI_SPECIES + id);
}