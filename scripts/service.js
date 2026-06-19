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
    statsTabContentArray.push({"title":currentStat.stat.name, "value":currentStat.base_stat});
  }
  return statsTabContentArray;
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
      sprites: pokemonApiObject.sprites,
      stats: pokemonApiObject.stats,
    },
  };
}