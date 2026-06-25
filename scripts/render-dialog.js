async function renderDialog(dialogRef, pokemonId) {
  const pokemon = getPokemonFromCacheById(pokemonId);
  const typeValues = Object.values(pokemon.base.types);
  await ensureEvoChainIsLoaded(pokemon);
  let dialogHeaderHtml = getDialogHeaderHtmlString(pokemon, typeValues);
  let dialogBodyHtml = getDialogBodyHtmlString(pokemon, typeValues);
  let dialogFooterHtml = getDialogFooterHtmlString(pokemon);
  dialogRef.innerHTML = getDialogContentTemplate(typeValues, dialogHeaderHtml, dialogBodyHtml, dialogFooterHtml);
}

function showNextPokemonInDialog(pokemonId) {
  const dialogRef = document.getElementById("dialog");
  const currentPokemonId = pokemonId + 1;
  if (currentPokemonId <= Object.keys(pokemons).length) {
    dialogRef.dataset.pokemonId = currentPokemonId;
    renderDialog(dialogRef, currentPokemonId);
  } else {
    console.error("Keine weiteren Pokemon geladen");
  }
}

function showPreviousPokemonInDialog(pokemonId) {
  const dialogRef = document.getElementById("dialog");
  const currentPokemonId = pokemonId - 1;
  if (currentPokemonId > 0) {
    dialogRef.dataset.pokemonId = currentPokemonId;
    renderDialog(dialogRef, currentPokemonId);
  } else {
    console.error("Keine vorherigen Pokemon vorhanden");
  }
}

async function openDialog(pokemonId) {
  let dialogRef = document.getElementById("dialog");
  dialogRef.dataset.pokemonId = pokemonId;
  await renderDialog(dialogRef, pokemonId);
  dialogRef.showModal();
  document.body.classList.add("overFlowHidden");
}

function closeDialog() {
  let dialogRef = document.getElementById("dialog");
  dialogRef.close();
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
    badgesHtmlString += getHeaderTypeBadgeTemplate(capitalize(type.name));
  }
  return badgesHtmlString;
}
/** Get header html string END */

/** Get body html string */
function getDialogBodyHtmlString(pokemon, typeValues) {
  const abilityNames = getAbilityNamesAsString(pokemon);
  const aboutTabContentHtml = getAboutTabContentHtmlString(pokemon, abilityNames);
  const statTabContentHtml = getStatsTabContentHtmlString(pokemon, typeValues);
  const evoChainTabContentHtml = getEvoChainTabContentHtmlString(pokemon);

  return getDialogBodyTemplate(aboutTabContentHtml, statTabContentHtml, evoChainTabContentHtml);
}

function getAboutTabContentHtmlString(pokemon, abilityNames) {
  const aboutTabContentArray = getAboutTabContentAsArray(pokemon, abilityNames);
  let fullTabContentHtmlString = "";
  for (let index = 0; index < aboutTabContentArray.length; index++) {
    const element = aboutTabContentArray[index];
    element.value = capitalize(element.value);
    fullTabContentHtmlString += getAboutTabContentTemplate(element);
  }
  return fullTabContentHtmlString;
}

function getStatsTabContentHtmlString(pokemon, typeValues) {
  const statsTabContentArray = getStatsTabContentAsArray(pokemon.base.stats);
  const typeName = typeValues[0].type.name;
  let fullTabContentHtmlString = "";
  for (let index = 0; index < statsTabContentArray.length; index++) {
    const element = statsTabContentArray[index];
    element.title = capitalize(element.title);
    fullTabContentHtmlString += getStatsTabContentTemplate(element, typeName);
  }
  return fullTabContentHtmlString;
}

function getEvoChainTabContentHtmlString(pokemon) {
  const evoChain = evoChains[pokemon.evoChain.id];
  const evoChainPokemons = evoChain.pokemons;
  let fullTapContentHtmlString = "";
  for (let index = 1; index <= Object.keys(evoChainPokemons).length; index++) {
    const element = evoChainPokemons[index];
    if (index > 1) {
      fullTapContentHtmlString += getEvoChainArrowTemplate();
    }
    fullTapContentHtmlString += getEvoChainTabContentTemplate(element.image);
  }
  return fullTapContentHtmlString;
}
/** Get body html string END */

/** Get footer html string */
function getDialogFooterHtmlString() {
  return getDialogFooterTemplate();
}
/** Get footer html string END */