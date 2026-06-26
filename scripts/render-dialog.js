/**
 * Renders the full dialog content for a cached Pokémon.
 */
async function renderDialog(dialogRef, pokemonId) {
  const pokemon = getPokemonFromCacheById(pokemonId);
  const typeValues = Object.values(pokemon.base.types);
  await ensureEvoChainIsLoaded(pokemon);
  let dialogHeaderHtml = getDialogHeaderHtmlString(pokemon, typeValues);
  let dialogBodyHtml = getDialogBodyHtmlString(pokemon, typeValues);
  let dialogFooterHtml = getDialogFooterHtmlString(pokemon);
  dialogRef.innerHTML = getDialogContentTemplate(typeValues, dialogHeaderHtml, dialogBodyHtml, dialogFooterHtml);
}

/**
 * Shows the next loaded Pokémon in the open dialog.
 */
function showNextPokemonInDialog(pokemonId) {
  const dialogRef = document.getElementById("dialog");
  const nextButtonRef = document.querySelector('[data-id="next-button"]');
  const currentPokemonId = pokemonId + 1;
  toggleDisable(nextButtonRef);
  if (currentPokemonId <= Object.keys(pokemons).length) {
    dialogRef.dataset.pokemonId = currentPokemonId;
    renderDialog(dialogRef, currentPokemonId);
  } else {
    console.error("Keine weiteren Pokemon geladen");
  }
  toggleDisable(nextButtonRef);
}

/**
 * Shows the previous Pokémon in the open dialog.
 */
function showPreviousPokemonInDialog(pokemonId) {
  const dialogRef = document.getElementById("dialog");
  const prevButtonRef = document.querySelector('[data-id="prev-button"]');
  const currentPokemonId = pokemonId - 1;
  toggleDisable(prevButtonRef);
  if (currentPokemonId > 0) {
    dialogRef.dataset.pokemonId = currentPokemonId;
    renderDialog(dialogRef, currentPokemonId);
  } else {
    console.error("Keine vorherigen Pokemon vorhanden");
  }
  toggleDisable(prevButtonRef);
}

/**
 * Opens the dialog after rendering the selected Pokémon.
 */
async function openDialog(pokemonId) {
  let dialogRef = document.getElementById("dialog");
  dialogRef.dataset.pokemonId = pokemonId;
  await renderDialog(dialogRef, pokemonId);
  dialogRef.showModal();
  document.body.classList.add("overFlowHidden");
}

/**
 * Closes the Pokémon dialog.
 */
function closeDialog() {
  let dialogRef = document.getElementById("dialog");
  dialogRef.close();
}

/**
 * Creates the dialog header HTML for a Pokémon.
 */
function getDialogHeaderHtmlString(pokemon, typeValues) {
  let fullBadgesHtmlString = getDialogTypeBadgeHtmlString(typeValues);
  return getDialogHeaderTemplate(pokemon, fullBadgesHtmlString);
}

/**
 * Creates the type badge HTML for the dialog header.
 */
function getDialogTypeBadgeHtmlString(typeValues) {
  let badgesHtmlString = "";
  for (let indexType = 0; indexType < typeValues.length; indexType++) {
    const type = typeValues[indexType].type;
    badgesHtmlString += getHeaderTypeBadgeTemplate(capitalize(type.name));
  }
  return badgesHtmlString;
}

/**
 * Creates the dialog body HTML with about, stats, and evolution content.
 */
function getDialogBodyHtmlString(pokemon, typeValues) {
  const abilityNames = getAbilityNamesAsString(pokemon);
  const aboutTabContentHtml = getAboutTabContentHtmlString(pokemon, abilityNames);
  const statTabContentHtml = getStatsTabContentHtmlString(pokemon, typeValues);
  const evoChainTabContentHtml = getEvoChainTabContentHtmlString(pokemon);

  return getDialogBodyTemplate(aboutTabContentHtml, statTabContentHtml, evoChainTabContentHtml);
}

/**
 * Creates the HTML for the dialog's about tab.
 */
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

/**
 * Creates the HTML for the dialog's stats tab.
 */
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

/**
 * Creates the HTML for the dialog's evolution tab.
 */
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

/**
 * Creates the dialog footer HTML.
 */
function getDialogFooterHtmlString() {
  return getDialogFooterTemplate();
}
