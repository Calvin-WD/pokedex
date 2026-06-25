

function renderCards(pokemonsToRender) {
  const contentWrapperRef = document.getElementById("content-wrapper");
  for (let index = 0; index < pokemonsToRender.length; index++) {
    const currentPokemon = pokemonsToRender[index];
    renderSingleCard(contentWrapperRef, currentPokemon);
  }
}

function renderFilteredCards(searchValue) {
  const contentWrapperRef = document.getElementById("content-wrapper");
  let filteredPokemons = [];
  contentWrapperRef.innerHTML = "";

  filteredPokemons = filterPokemonValuesByName(searchValue.toLowerCase());
  renderCards(filteredPokemons);
}

function renderSingleCard(contentWrapperRef, pokemon) {
  const currentTypeValues = Object.values(pokemon.base.types);
  const cardTypeIconsHtml = getCardTypeIconsHtml(currentTypeValues);
  contentWrapperRef.innerHTML += getPokemonCardTemplate(pokemon, cardTypeIconsHtml);
}

function getCardTypeIconsHtml(typeValues) {
  let cardTypeIconsHtml = "";
  for (let typeIndex = 0; typeIndex < typeValues.length; typeIndex++) {
    const currentTypeImgUrl = typeValues[typeIndex].type.typeImage;
    cardTypeIconsHtml += getPokemonCardTypeImageTemplate(currentTypeImgUrl);
  }
  return cardTypeIconsHtml;
}
