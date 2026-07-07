/**
 * Appends all provided Pokémon as cards to the main content area.
 */
function renderCards(pokemonIdsToRender, visiblePokemonIndex) {
  const contentWrapperRef = document.getElementById("pokemon-card-list");
  let contentHtmlString = "";

  for (let index = 0; index < pokemonIdsToRender.length; index++) {
    const currentPokemon = getPokemonFromCacheById(pokemonIdsToRender[index]);
    contentHtmlString += renderSingleCard(currentPokemon, visiblePokemonIndex);
    visiblePokemonIndex++;
  }

  contentWrapperRef.innerHTML += contentHtmlString;
}

/**
 * Adds newly loaded Pokémon cards or refreshes the filtered card list.
 */
function renderLoadedPokemonCards(loadedPokemons) {
  const inputRef = document.querySelector('[data-id="search-input"]');

  if (!inputRef.value) {
    const loadedPokemonIds = getPokemonIds(loadedPokemons);
    const visiblePokemonIndex = visiblePokemonIds.length;
    visiblePokemonIds = visiblePokemonIds.concat(loadedPokemonIds);
    renderCards(loadedPokemonIds, visiblePokemonIndex);
  } else {
    renderFilteredCards(inputRef.value);
  }
}

/**
 * Clears the card list and renders Pokémon that match the search value, or a feedback message if none match.
 */
function renderFilteredCards(searchValue) {
  const contentWrapperRef = document.getElementById("pokemon-card-list");
  let visiblePokemonIndex = 0;
  let filteredPokemons = filterPokemonValuesByName(searchValue);

  visiblePokemonIds = getPokemonIds(filteredPokemons);
  contentWrapperRef.innerHTML = "";
  renderCards(visiblePokemonIds, visiblePokemonIndex);

  if (visiblePokemonIds.length === 0) {
    contentWrapperRef.innerHTML = getFeedbackMessageTemplate("No match found!");
  }
}

/**
 * Builds one Pokémon card with its type icons.
 */
function renderSingleCard(pokemon, index) {
  const currentTypeValues = Object.values(pokemon.base.types);
  const pokemonTemplateData = {
    id: pokemon.base.id,
    name: capitalize(pokemon.base.name),
    nameUpperCase: pokemon.base.name.toUpperCase(),
    image: pokemon.base.sprites.other.home.front_default,
    primaryTypeName: pokemon.base.types[0].type.name,
    typeIconsHtml: getCardTypeIconsHtml(currentTypeValues),
    visiblePokemonIndex: index,
  };

  return getPokemonCardTemplate(pokemonTemplateData);
}

/**
 * Creates the HTML for the type icons shown on a Pokémon card.
 */
function getCardTypeIconsHtml(typeValues) {
  let cardTypeIconsHtml = "";

  for (let typeIndex = 0; typeIndex < typeValues.length; typeIndex++) {
    const currentType = typeValues[typeIndex].type;
    const typeTemplateData = {
      name: types[currentType.name].name,
      image: types[currentType.name].image,
    };
    cardTypeIconsHtml += getPokemonCardTypeImageTemplate(typeTemplateData);
  }

  return cardTypeIconsHtml;
}

/**
 * Toggles visibility between the card list section and the loading spinner.
 */
function showHideLoadingSpinner() {
  const loadingSpinnerRef = document.querySelector('[data-id="loading-spinner"]');
  const contentRef = document.querySelector('[data-id="content-cards"]');

  toggleVisibility(contentRef);
  toggleVisibility(loadingSpinnerRef);
}
