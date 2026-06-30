/**
 * Loads the initial Pokémon batch and renders the first cards.
 */
async function init() {
  try {
    const loadedPokemon = await loadPokemons();
    renderCards(loadedPokemon);
  } catch (error) {
    const contentWrapperRef = document.getElementById("content-wrapper");
    contentWrapperRef.innerHTML = getMessageTemplate("Loading Failure!");
    console.log(error);
  }
}
