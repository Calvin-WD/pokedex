function getPokemonFromCacheById(pokemonId) {
  return pokemons[pokemonId];
}

function getAbilityNamesAsString(pokemon) {
  let abilityNames = [];
  for (let abilityIndex = 0; abilityIndex < pokemon.base.abilities.length; abilityIndex++) {
    const abilityName = pokemon.base.abilities[abilityIndex].ability.name;
    abilityNames.push(abilityName);
  }
  return abilityNames.join(", ");
}

function cachePokemonBaseData(pokemonApiObject) {
  pokemons[pokemonApiObject.id] = {
    base: {
      id: pokemonApiObject.id,
      name: pokemonApiObject.name,
      height: pokemonApiObject.height,
      weight: pokemonApiObject.weight,
      abilities: pokemonApiObject.abilities,
      types: pokemonApiObject.types,
      sprites: pokemonApiObject.sprites
    },
  };
}