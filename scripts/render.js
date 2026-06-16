/**
 * Render Cards
 */

function renderCards(pokemons) {
  const contentWrapperRef = document.getElementById("content-wrapper");
  for (
    let index = pokemonApiIndexCounter - POKEMON_LOADING_INTERVAL + 1;
    index <= Object.keys(pokemons).length;
    index++
  ) {
    const tag = 'button type="button"';
    const currentPokemon = pokemons[index];
    const currentTypeValues = Object.values(currentPokemon.types);
    const footerHtmlString = getCardFooterHtmlString(currentTypeValues);
    contentWrapperRef.innerHTML += getPokemonCardTemplate(tag, currentPokemon, currentTypeValues, footerHtmlString);
  }
}

function getCardFooterHtmlString(typeValues) {
  let footerHtmlString = "";
  for (let typeIndex = 0; typeIndex < typeValues.length; typeIndex++) {
    const currentTypeImgUrl = typeValues[typeIndex].type.typeImage;
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
  const currentTypeValues = Object.values(currentPokemon.types);
  let dialogHeaderHtml = getDialogHeaderHtmlString(currentPokemon, currentTypeValues);
  let dialogBodyHtml = getDialogBodyHtmlString();
  let dialogFooterHtml = getDialogFooterHtmlString();
  dialogRef.innerHTML = getDialogContentTemplate(currentTypeValues, dialogHeaderHtml, dialogBodyHtml, dialogFooterHtml);
}

/** Get header html string */
function getDialogHeaderHtmlString(pokemon, typeValues) {
  let fullBadgesHtmlString = getDialogTypeBadgeHtmlString(typeValues);
  return getDialogHeaderTemplate(pokemon, fullBadgesHtmlString);
}

function getDialogTypeBadgeHtmlString(typeValues) {
  let badgesHtmlString = "";
  for (let indexType = 0; indexType < typeValues.length; indexType++) {
    const type = typeValues[indexType].type;
    badgesHtmlString += getHeaderTypeBadgeTemplate(type.name);
  }
  return badgesHtmlString;
}
/** Get header html string END */

/** Get body html string */
function getDialogBodyHtmlString() {
  return getDialogBodyTemplate();
}
/** Get body html string END */

/** Get footer html string */
function getDialogFooterHtmlString() {
  return getDialogFooterTemplate();
}
/** Get footer html string END */

/**
 * Render Dialog END
 */
