function renderSmallCards(pokemons) {
  const contentWrapperRef = document.getElementById("content-wrapper");
  contentWrapperRef.innerHTML = "";

  for (let index = pokemonApiIndexCounter - POKEMON_LOADING_INTERVAL + 1; index <= POKEMON_LOADING_INTERVAL; index++) {
    currentPokemon = pokemons[index];
    contentWrapperRef.innerHTML += getSmallPokemonCardTemplate(currentPokemon);
  }
}
