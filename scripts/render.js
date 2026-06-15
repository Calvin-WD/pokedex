/** 
 * Render Cards
 */

function renderCards(pokemons) {
  const contentWrapperRef = document.getElementById("content-wrapper");
  // contentWrapperRef.innerHTML = "";
  for (let index = pokemonApiIndexCounter - POKEMON_LOADING_INTERVAL + 1; index <= Object.keys(pokemons).length; index++) {
    const tag = 'button type="button"';
    const currentPokemon = pokemons[index];
    const currentTypeValuesAsArray = Object.values(currentPokemon.types);
    const footerHtmlString = getCardFooterHtmlString(currentTypeValuesAsArray);
    contentWrapperRef.innerHTML += getPokemonCardTemplate(tag, currentPokemon, currentTypeValuesAsArray, footerHtmlString);
  }
}

function getCardFooterHtmlString(currentTypeValuesAsArray) {
  let footerHtmlString = "";
  for (let typeIndex = 0; typeIndex < currentTypeValuesAsArray.length; typeIndex++) {
    const currentTypeImgUrl = currentTypeValuesAsArray[typeIndex].typeImage;
    footerHtmlString += getPokemonCardTypeImageTemplate(currentTypeImgUrl);
  }
  return footerHtmlString;
}

/** 
 * Render Cards END
 */

/** 
 * Render Dialog
 */

function renderDialog(dialogRef, pokemonId) {
  const currentPokemon = getPokemonFromCacheById(pokemonId);
  const currentTypeValuesAsArray = Object.values(currentPokemon.types)
  dialogRef.innerHTML = getDialogContentTemplate(currentPokemon);
  console.log(currentPokemon);
  
}

function getDialogHeaderHtmlString() {
  
}
function getDialogBodyHtmlString() {

}

/** 
 * Render Dialog END
 */