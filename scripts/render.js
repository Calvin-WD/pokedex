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
    const currentTypeValues = Object.values(currentPokemon.base.types);
    const footerHtmlString = getCardFooterHtmlString(currentTypeValues);
    contentWrapperRef.innerHTML += getPokemonCardTemplate(currentPokemon, footerHtmlString);
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
  const currentTypeValues = Object.values(currentPokemon.base.types);
  let dialogHeaderHtml = getDialogHeaderHtmlString(currentPokemon, currentTypeValues);
  let dialogBodyHtml = getDialogBodyHtmlString(currentPokemon);
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
function getDialogBodyHtmlString(pokemon) {
  const abilityNames = getAbilityNamesAsString(pokemon);
  console.log(abilityNames);

  return getDialogBodyTemplate(pokemon, abilityNames);
}

// function getAboutTabContentHtmlString(pokemon, abilityNames) {
//   const aboutTabContentArray = [
//     { Name: pokemon.name },
//     { Height: pokemon.height },
//     { Weight: pokemon.weight },
//     { Abilities: abilityNames },
//   ];
//   let fullTabContentHtmlString = "";

//   for (let index = 0; index < aboutTabContentArray.length; index++) {
//     const element = aboutTabContentArray[index];
//     fullTabContentHtmlString += getAboutTabContentTemplate(element)
//   }
// }
/** Get body html string END */

/** Get footer html string */
function getDialogFooterHtmlString() {
  return getDialogFooterTemplate();
}
/** Get footer html string END */

/**
 * Render Dialog END
 */
