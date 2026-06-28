/**
 * Loads the selected Pokémon data and updates the open dialog content.
 */
async function showDialogPokemon(pokemonId) {
  const dialogRef = document.getElementById("dialog");
  const pokemon = getPokemonFromCacheById(pokemonId);
  let typeValues = [];
  typeValues = Object.values(pokemon.base.types);
  await ensureEvoChainIsLoaded(pokemon);

  updateDialog(dialogRef, pokemon, typeValues, pokemonId);
}

/**
 * Renders the full dialog content for a cached Pokémon.
 */
async function renderDialog(dialogRef, pokemonId) {
  renderDialogWrapper(dialogRef, pokemonId);
  await showDialogPokemon(pokemonId);
}

/**
 * Renders the stable dialog wrapper with empty dynamic content areas.
 */
function renderDialogWrapper(dialogRef, pokemonId) {
  const pokemon = getPokemonFromCacheById(pokemonId);
  const typeValues = Object.values(pokemon.base.types);
  let dialogNavTabHtml = getDialogNavTabHtmlString();
  let dialogNavContentHtml = getDialogNavContentTemplate();
  dialogRef.innerHTML = getDialogContentTemplate(typeValues, dialogNavTabHtml, dialogNavContentHtml);
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
 * Stores the current Pokémon id and refreshes all dynamic dialog areas.
 */
function updateDialog(dialogRef, pokemon, typeValues, pokemonId) {
  dialogRef.dataset.pokemonId = pokemonId;
  updateDialogContent(pokemon, typeValues);
}

/**
 * Updates all Pokémon-specific dialog content for the current Pokémon.
 */
function updateDialogContent(pokemon, typeValues) {
  updateDialogBg(typeValues);
  updateDialogHeader(pokemon, typeValues);
  updateDialogNavContent(pokemon, typeValues);
}

/**
 * Updates the dialog background class based on the Pokémon's primary type.
 */
function updateDialogBg(typeValues) {
  const dialogBgWrapperRef = document.querySelector('[data-id="dialog-bg-wrapper"]');
  const classPrefix = "bg-type-";
  const currentTypeClassName = classPrefix + typeValues[0].type.name;
  removeOldDialogBg(dialogBgWrapperRef, classPrefix, currentTypeClassName);
  dialogBgWrapperRef.classList.add(currentTypeClassName);
}

/**
 * Removes outdated type background classes from the dialog wrapper.
 */
function removeOldDialogBg(dialogBgWrapperRef, classPrefix, currentTypeClassName) {
  dialogBgWrapperRef.classList.forEach((typeClassName) => {
    if (typeClassName.startsWith(classPrefix) && typeClassName != currentTypeClassName) {
      dialogBgWrapperRef.classList.remove(typeClassName);
    }
  });
}

/**
 * Updates the dialog header with the current Pokémon details.
 */
function updateDialogHeader(pokemon, typeValues) {
  const dialogHeaderRef = document.querySelector('[data-id="dialog-header-content"]');
  dialogHeaderRef.innerHTML = getDialogHeaderContentHtmlString(pokemon, typeValues);
}

/**
 * Updates the about, stats and evolution tab contents for the current Pokémon.
 */
function updateDialogNavContent(pokemon, typeValues) {
  const abilityNames = getAbilityNamesAsString(pokemon);
  const aboutContentRef = document.querySelector('[data-id="about-tab-pane"]');
  const statContentRef = document.querySelector('[data-id="stat-tab-pane"]');
  const evolutionContentRef = document.querySelector('[data-id="evolution-tab-pane"]');

  aboutContentRef.innerHTML = getAboutTabContentHtmlString(pokemon, abilityNames);
  statContentRef.innerHTML = getStatsTabContentHtmlString(pokemon, typeValues);
  evolutionContentRef.innerHTML = getEvoChainTabContentHtmlString(pokemon);
}

/**
 * Shows the next loaded Pokémon in the open dialog.
 */
async function nextDialogPokemon(buttonRef, pokemonId) {
  pokemonId = pokemonId + 1;
  if (pokemons[pokemonId]) {
    toggleDisable(buttonRef);
    await showDialogPokemon(pokemonId);
    toggleDisable(buttonRef);
  } else {
    console.error("No more Pokemons are loaded!");
  }
}

/**
 * Shows the previous Pokémon in the open dialog.
 */
async function previousDialogPokemon(buttonRef, pokemonId) {
  pokemonId = pokemonId - 1;
  if (pokemons[pokemonId]) {
    toggleDisable(buttonRef);
    await showDialogPokemon(pokemonId);
    toggleDisable(buttonRef);
  } else {
    console.error("You already reached the first Pokemon!");
  }
}

/**
 * Creates the dialog header HTML for a Pokémon.
 */
function getDialogHeaderContentHtmlString(pokemon, typeValues) {
  let fullBadgesHtmlString = getDialogTypeBadgeHtmlString(typeValues);
  return getDialogHeaderTemplate(pokemon, fullBadgesHtmlString);
}

/**
 * Creates the type badge HTML for the dialog header.
 */
function getDialogTypeBadgeHtmlString(typeValues) {
  const classPrefix = "bg-type-";
  let badgesHtmlString = "";
  for (let indexType = 0; indexType < typeValues.length; indexType++) {
    const type = typeValues[indexType].type;
    const typeBackground = classPrefix + type.name;
    badgesHtmlString += getHeaderTypeBadgeTemplate(capitalize(type.name), typeBackground);
  }
  return badgesHtmlString;
}

/**
 * Creates the dialog tab navigation HTML.
 */
function getDialogNavTabHtmlString() {
  return getDialogNavTabsTemplate();
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

