/** 
 * Gets the pokemon object from the Pokeapi using the id and returns it
 */
async function getPokemonObjectFromPokeApi(id) {
  return (await getData(`pokemon/${id}`));
}

/** 
 * Extract the basic values from the pokemon Pokeapi Object and returns it as a json
 * Values: id, name, types, image
 */
function getPokemonStatsForSmallCard(pokemonApiObject) {
  let id = pokemonApiObject.id;
  let name = pokemonApiObject.name;
  let types = getPokemonTypes(pokemonApiObject);
  let img = pokemonApiObject.sprites.other.home.front_default;

  return {
    "id":id,
    "name":name,
    "types":types,
    "image": img,
    "renderd": false
  }
}

/**
 * Iterates through the types and returns it as an Array
 */
function getPokemonTypes(pokemonApiObject) {
  let types = [];

  for (let indexType = 0; indexType < pokemonApiObject.types.length; indexType++) {
    const type = pokemonApiObject.types[indexType].type;
    types.push(type);
  }
  return types;
}
