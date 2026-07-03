/**
 * Renders all provided Pokémon as cards in the main content area.
 */
function renderCards(pokemonIdsToRender, visiblePokemonIndex) {
  const contentWrapperRef = document.getElementById("content-wrapper");
  let contentHtmlString = "";

  for (let index = 0; index < pokemonIdsToRender.length; index++) {
    const currentPokemon = getPokemonFromCacheById(pokemonIdsToRender[index]);
    contentHtmlString += renderSingleCard(currentPokemon, visiblePokemonIndex);
    visiblePokemonIndex++;
  }

  contentWrapperRef.innerHTML += contentHtmlString;
}

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
 * Clears the card list and renders Pokémon that match the search value.
 */
function renderFilteredCards(searchValue) {
  const contentWrapperRef = document.getElementById("content-wrapper");
  let visiblePokemonIndex = 0;
  let filteredPokemons = filterPokemonValuesByName(searchValue);

  visiblePokemonIds = getPokemonIds(filteredPokemons);
  contentWrapperRef.innerHTML = "";
  renderCards(visiblePokemonIds, visiblePokemonIndex);

  if (visiblePokemonIds.length === 0) {
    contentWrapperRef.innerHTML = getMessageTemplate("No match found!");
  }
}

/**
 * Builds one Pokémon card with its type icons.
 */
function renderSingleCard(pokemon, index) {
  const currentTypeValues = Object.values(pokemon.base.types);
  const pokemonTemplateData = {
    id: pokemon.base.id,
    name: pokemon.base.name,
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
 * Toggles the main content and full-content loading spinner visibility.
 */
function showHideLoadingSpinner() {
  const loadingSpinnerRef = document.querySelector('[data-id="loading-spinner"]');
  const contentRef = document.querySelector('[data-id="content"]');
  
  toggleVisibility(contentRef);
  toggleVisibility(loadingSpinnerRef);
}
