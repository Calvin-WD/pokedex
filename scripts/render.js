function renderCards(pokemons) {
  const contentWrapperRef = document.getElementById("content-wrapper");
  // contentWrapperRef.innerHTML = "";
  for (let index = pokemonApiIndexCounter - POKEMON_LOADING_INTERVAL + 1; index <= Object.keys(pokemons).length; index++) {
    const tag = 'button type="button"';
    const currentPokemon = pokemons[index];
    const currentTypeValuesAsArray = Object.values(currentPokemon.types);
    const footerHtmlString = getFooterHtmlString(currentTypeValuesAsArray);
    contentWrapperRef.innerHTML += getPokemonCardTemplate(tag, currentPokemon, currentTypeValuesAsArray, footerHtmlString);
  }
}

function getFooterHtmlString(currentTypeValuesAsArray) {
  let footerHtmlString = "";
  for (let typeIndex = 0; typeIndex < currentTypeValuesAsArray.length; typeIndex++) {
    const currentTypeImgUrl = currentTypeValuesAsArray[typeIndex].typeImage;
    footerHtmlString += getPokemonCardTypeImageTemplate(currentTypeImgUrl);
  }
  return footerHtmlString;
}

// function renderDialog() {
//   const dialogRef = document.getElementById("dialog-wrapper");
//   dialogRef.innerHTML = getPokemonCardExtensionTemplate();
// }
