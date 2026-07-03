/**
 * Loads the selected Pokémon data and updates the open dialog content.
 */
async function showDialogPokemon(dialogId) {
  const dialogRef = document.getElementById("dialog");
  const pokemon = visiblePokemons.at(dialogId);
  let typeValues = [];
  typeValues = Object.values(pokemon.base.types);
  await ensureEvoChainIsLoaded(pokemon);

  updateDialog(dialogRef, pokemon, typeValues, dialogId);
}

/**
 * Renders the full dialog content for a cached Pokémon.
 */
async function renderDialog(dialogRef, pokemonId, dialogId) {
  renderDialogWrapper(dialogRef, pokemonId);
  await showDialogPokemon(dialogId);
}

/**
 * Renders the stable dialog wrapper with empty dynamic content areas.
 */
function renderDialogWrapper(dialogRef, pokemonId) {
  const pokemon = getPokemonFromCacheById(pokemonId);
  const typeValues = Object.values(pokemon.base.types);
  const dialogContentTemplateData = {
    primaryTypeName: typeValues[0].type.name,
    navTabHtml: getDialogNavTabHtmlString(),
    navContentHtml: getDialogNavContentTemplate(),
  };
  dialogRef.innerHTML = getDialogContentTemplate(dialogContentTemplateData);
}

/**
 * Opens the dialog after rendering the selected Pokémon.
 */
async function openDialog(pokemonId, dialogId) {
  let dialogRef = document.getElementById("dialog");
  dialogRef.dataset.pokemonId = pokemonId;
  dialogRef.dataset.dialogId = dialogId;
  await renderDialog(dialogRef, pokemonId, dialogId);
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
function updateDialog(dialogRef, pokemon, typeValues, dialogId) {
  dialogRef.dataset.dialogId = dialogId;
  dialogRef.dataset.pokemonId = pokemon.base.id;
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
  const evoChainTemplateData = getEvoChainTemplateData(pokemon);
  const aboutContentRef = document.querySelector('[data-id="about-tab-pane"]');
  const statContentRef = document.querySelector('[data-id="stat-tab-pane"]');
  const evolutionContentRef = document.querySelector('[data-id="evolution-tab-pane-content"]');

  aboutContentRef.innerHTML = getAboutTabContentHtmlString(pokemon, abilityNames);
  statContentRef.innerHTML = getStatsTabContentHtmlString(pokemon, typeValues);
  evolutionContentRef.innerHTML = getEvoChainTabContentHtmlString(evoChainTemplateData);
}

/**
 * Shows the next loaded Pokémon in the open dialog.
 */
async function nextDialogPokemon(buttonRef, dialogId) {
  dialogId = dialogId + 1;
  if (isValidDialogId(dialogId)) {
    toggleDisable(buttonRef);
    await showDialogPokemon(dialogId);
    toggleDisable(buttonRef);
  } else {
    console.error("No more Pokemons are loaded!");
  }
}

/**
 * Shows the previous Pokémon in the open dialog.
 */
async function previousDialogPokemon(buttonRef, dialogId) {
  dialogId = dialogId - 1;
  if (isValidDialogId(dialogId)) {
    toggleDisable(buttonRef);
    await showDialogPokemon(dialogId);
    toggleDisable(buttonRef);
  } else {
    console.error("You already reached the first Pokemon!");
  }
}

/**
 * Creates the dialog header HTML from prepared Pokémon template data.
 */
function getDialogHeaderContentHtmlString(pokemon, typeValues) {
  const pokemonTemplateData = {
    id: pokemon.base.id,
    name: pokemon.base.name.toUpperCase(),
    image: pokemon.base.sprites.other.home.front_default,
    badgesHtml: getDialogTypeBadgeHtmlString(typeValues),
  };
  return getDialogHeaderTemplate(pokemonTemplateData);
}

/**
 * Creates the type badge HTML for all dialog header types.
 */
function getDialogTypeBadgeHtmlString(typeValues) {
  const classPrefix = "bg-type-";
  let badgesHtmlString = "";
  for (let indexType = 0; indexType < typeValues.length; indexType++) {
    const type = typeValues[indexType].type;
    const typeBackground = classPrefix + type.name;
    const typeTemplateData = {
      name: capitalize(type.name),
      bg: typeBackground,
    };
    badgesHtmlString += getHeaderTypeBadgeTemplate(typeTemplateData);
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
  const aboutTabTemplateData = getAboutTabTemplateData(pokemon, abilityNames);
  let fullTabContentHtmlString = "";
  for (let index = 0; index < aboutTabTemplateData.length; index++) {
    const currentTemplateData = aboutTabTemplateData[index];
    currentTemplateData.value = capitalize(currentTemplateData.value);
    fullTabContentHtmlString += getAboutTabContentTemplate(currentTemplateData);
  }
  return fullTabContentHtmlString;
}

/**
 * Creates the HTML for the dialog's stats tab from prepared stat data.
 */
function getStatsTabContentHtmlString(pokemon, typeValues) {
  const statsTabContentArray = getStatsTabContentAsArray(pokemon.base.stats);
  let fullTabContentHtmlString = "";
  for (let index = 0; index < statsTabContentArray.length; index++) {
    const currentStat = statsTabContentArray[index];
    const statTemplateData = {
      title: capitalize(currentStat.title),
      value: currentStat.value,
      primaryTypeName: typeValues[0].type.name,
    };
    fullTabContentHtmlString += getStatsTabContentTemplate(statTemplateData);
  }
  return fullTabContentHtmlString;
}

/**
 * Creates the HTML for the dialog's evolution tab.
 */
function getEvoChainTabContentHtmlString(evoChainTemplateData) {
  let fullTapContentHtmlString = "";
  for (let index = 0; index < evoChainTemplateData.length; index++) {
    const currentTemplateData = evoChainTemplateData[index];
    if (index > 0) {
      fullTapContentHtmlString += getEvoChainArrowTemplate();
    }
    fullTapContentHtmlString += getEvoChainTabContentTemplate(currentTemplateData);
  }
  return fullTapContentHtmlString;
}

/**
 * Creates the template data rows used in the dialog's about tab.
 */
function getAboutTabTemplateData(pokemon, abilityNames) {
  return [
    { value: pokemon.base.name, title: "Name" },
    { value: pokemon.base.height, title: "Height" },
    { value: pokemon.base.weight, title: "Weight" },
    { value: abilityNames, title: "Abilities" },
  ];
}

/**
 * Creates the template data used in the dialog's evolution tab.
 */
function getEvoChainTemplateData(pokemon) {
  const evoChain = evoChains[pokemon.evoChain.id];
  const evoChainPokemons = evoChain.pokemons;
  let evoChainImages = [];
  for (let index = 1; index <= Object.keys(evoChainPokemons).length; index++) {
    const currentPokemonImage = evoChainPokemons[index].image;
    evoChainImages.push({ image: currentPokemonImage });
  }
  return evoChainImages;
}
