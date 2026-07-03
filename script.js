/**
 * Loads the initial Pokémon batch and renders the first cards.
 */
async function init() {
  try {
    const loadedPokemon = await loadPokemons();
    let renderId = 0;
    visiblePokemons = loadedPokemon;
    renderCards(loadedPokemon, renderId);
  } catch (error) {
    const contentWrapperRef = document.getElementById("content-wrapper");
    contentWrapperRef.innerHTML = getMessageTemplate("Loading Failure!");
    console.log(error);
  }
}
