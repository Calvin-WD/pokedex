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
 * Extract the basic values from the pokemon Pokeapi Object and returns it as a json
 * Values: id, name, types, image
 */
async function getPokemonStatsForSmallCard(pokemonApiObject) {
  let id = pokemonApiObject.id;
  let name = pokemonApiObject.name;
  let currentTypes = await getTypes(pokemonApiObject);
  let img = pokemonApiObject.sprites.other.home.front_default;
  return {
    id: id,
    name: name,
    types: currentTypes,
    image: img,
  };
}

/**
 * Iterates through the types and returns it as an Array
 * The Array could contain more than type
 * The single type is a json
 */
async function getTypes(pokemonApiObject) {
  let currentTypes = [];
  for (let indexType = 0; indexType < pokemonApiObject.types.length; indexType++) {
    let type = pokemonApiObject.types[indexType].type;
    let typeId = type.url.substr(POKEAPI_BASE_URL.length + POKEAPI_TYPE.length);
    type["typeImage"] = await getTypeImageUrl(typeId);
    currentTypes[type.name] = type;
  }
  return currentTypes;
}

/** 
 * Returns the type images url based on the type id
 */
async function getTypeImageUrl(typeId) {
  let typeObject = await getTypeObjectFromPokeApi(typeId);
  return typeObject.sprites["generation-viii"]["legends-arceus"]["symbol_icon"];
}