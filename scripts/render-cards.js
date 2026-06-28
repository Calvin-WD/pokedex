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
  let filteredPokemons = filterPokemonValuesByName(searchValue);
  contentWrapperRef.innerHTML = "";
  renderCards(filteredPokemons);

  if (filteredPokemons.length === 0) {
    contentWrapperRef.innerHTML = getNoMatchFoundTemplate();
  }
}

/**
 * Builds and appends one Pokémon card with its type icons.
 */
function renderSingleCard(contentWrapperRef, pokemon) {
  const currentTypeValues = Object.values(pokemon.base.types);
  const pokemonTemplateData = {
    id: pokemon.base.id,
    name: pokemon.base.name,
    nameUpperCase: pokemon.base.name.toUpperCase(),
    image: pokemon.base.sprites.other.home.front_default,
    primaryTypeName: pokemon.base.types[0].type.name,
    typeIconsHtml: getCardTypeIconsHtml(currentTypeValues),
  };
  contentWrapperRef.innerHTML += getPokemonCardTemplate(pokemonTemplateData);
}

/**
 * Creates the HTML for the type icons shown on a Pokémon card.
 */
function getCardTypeIconsHtml(typeValues) {
  let cardTypeIconsHtml = "";
  for (let typeIndex = 0; typeIndex < typeValues.length; typeIndex++) {
    const currentType = typeValues[typeIndex].type;
    const typeTemplateData = {
      name: currentType.name,
      image: currentType.typeImage,
    };
    cardTypeIconsHtml += getPokemonCardTypeImageTemplate(typeTemplateData);
  }
  return cardTypeIconsHtml;
}

function showHideLoadingSpinner() {
  const loadingSpinnerRef = document.querySelector('[data-id="loading-spinner"]');
  const contentRef = document.querySelector('[data-id="content"]');
  toggleVisibility(contentRef);
  toggleVisibility(loadingSpinnerRef);
}
