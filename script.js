/**
 * Loads the initial Pokémon batch and renders the first cards.
 */
async function init() {
  try {
    const loadedPokemon = await loadPokemons();
    let visiblePokemonIndex = 0;
    visiblePokemonIds = getPokemonIds(loadedPokemon);
    renderCards(visiblePokemonIds, visiblePokemonIndex);
  } catch (error) {
    const contentWrapperRef = document.getElementById("content-wrapper");
    contentWrapperRef.innerHTML = getMessageTemplate("Loading Failure!");
    console.log(error);
  }
}
