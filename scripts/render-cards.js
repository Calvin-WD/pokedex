
/**
 * Renders all provided Pokémon as cards in the main content area.
 */
function renderCards(pokemonsToRender) {
  const contentWrapperRef = document.getElementById("content-wrapper");
  for (let index = 0; index < pokemonsToRender.length; index++) {
    const currentPokemon = pokemonsToRender[index];
    renderSingleCard(contentWrapperRef, currentPokemon);
  }
}

/**
 * Clears the card list and renders Pokémon that match the search value.
 */
function renderFilteredCards(searchValue) {
  const contentWrapperRef = document.getElementById("content-wrapper");
  let filteredPokemons = [];
  contentWrapperRef.innerHTML = "";

  filteredPokemons = filterPokemonValuesByName(searchValue.toLowerCase());
  renderCards(filteredPokemons);
}

/**
 * Builds and appends one Pokémon card with its type icons.
 */
function renderSingleCard(contentWrapperRef, pokemon) {
  const currentTypeValues = Object.values(pokemon.base.types);
  const cardTypeIconsHtml = getCardTypeIconsHtml(currentTypeValues);
  contentWrapperRef.innerHTML += getPokemonCardTemplate(pokemon, cardTypeIconsHtml);
}

/**
 * Creates the HTML for the type icons shown on a Pokémon card.
 */
function getCardTypeIconsHtml(typeValues) {
  let cardTypeIconsHtml = "";
  for (let typeIndex = 0; typeIndex < typeValues.length; typeIndex++) {
    const currentTypeImgUrl = typeValues[typeIndex].type.typeImage;
    cardTypeIconsHtml += getPokemonCardTypeImageTemplate(currentTypeImgUrl);
  }
  return cardTypeIconsHtml;
}
