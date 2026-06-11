function renderSmallCards(pokemons) {
  const contentWrapperRef = document.getElementById("content-wrapper");
  contentWrapperRef.innerHTML = "";
  for (let index = pokemonApiIndexCounter - POKEMON_LOADING_INTERVAL + 1; index <= POKEMON_LOADING_INTERVAL; index++) {
    currentPokemon = pokemons[index];
    currentTypeValuesAsArray = Object.values(currentPokemon.types);
    let footerHtmlString = getFooterHtmlString(currentTypeValuesAsArray);
    contentWrapperRef.innerHTML += getSmallPokemonCardTemplate(currentPokemon, currentTypeValuesAsArray, footerHtmlString);
  }
}

function getFooterHtmlString(currentTypeValuesAsArray) {
  let footerHtmlString = "";
  for (let typeIndex = 0; typeIndex < currentTypeValuesAsArray.length; typeIndex++) {
    const currentTypeImgUrl = currentTypeValuesAsArray[typeIndex].typeImage;
    footerHtmlString += getSmallPokemonCardTypeImageTemplate(currentTypeImgUrl);
  }
  return footerHtmlString;
}
