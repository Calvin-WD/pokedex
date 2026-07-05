let isChangingDialogPokemon = false;

/**
 * Loads the selected Pokémon data and updates the open dialog content.
 */
async function showDialogPokemon(visiblePokemonIndex) {
  const dialogRef = document.querySelector(`[data-id="dialog"]`);
  const pokemonId = visiblePokemonIds.at(visiblePokemonIndex);
  const pokemon = getPokemonFromCacheById(pokemonId);
  let typeValues = [];

  typeValues = Object.values(pokemon.base.types);
  await ensureEvoChainIsLoaded(pokemon);

  updateDialog(dialogRef, pokemon, typeValues, visiblePokemonIndex);
}

/**
 * Renders the stable dialog wrapper with empty dynamic content areas.
 */
function renderDialogWrapper(dialogRef) {
  const dialogContentTemplateData = getDialogContentTemplateData();

  dialogRef.innerHTML = getDialogContentTemplate(dialogContentTemplateData);
}

function getDialogContentTemplateData() {
  return {
    headerHtml: getDialogHeaderTemplate(),
    tabListHtml: getDialogTabListHtmlString(),
    tabPanesHtml: getDialogTabPanesHtmlString(),
  };
}

/**
 * Opens the dialog after rendering the selected Pokémon.
 */
async function openDialog(pokemonId, visiblePokemonIndex) {
  let dialogRef = document.querySelector(`[data-id="dialog"]`);

  dialogRef.dataset.pokemonId = pokemonId;
  dialogRef.dataset.visiblePokemonIndex = visiblePokemonIndex;

  renderDialogWrapper(dialogRef);
  await showDialogPokemon(visiblePokemonIndex);

  dialogRef.showModal();
  document.body.classList.add("overflow-hidden");
}

/**
 * Closes the Pokémon dialog.
 */
function closeDialog() {
  let dialogRef = document.querySelector(`[data-id="dialog"]`);
  dialogRef.close();
}

/**
 * Stores the current Pokémon id and refreshes all dynamic dialog areas.
 */
function updateDialog(dialogRef, pokemon, typeValues, visiblePokemonIndex) {
  dialogRef.dataset.visiblePokemonIndex = visiblePokemonIndex;
  dialogRef.dataset.pokemonId = pokemon.base.id;
  updateDialogContent(pokemon, typeValues);
}

/**
 * Updates all Pokémon-specific dialog content for the current Pokémon.
 */
function updateDialogContent(pokemon, typeValues) {
  updateDialogBg(typeValues);
  updateDialogHeader(pokemon, typeValues);
  updateDialogTabPaneContent(pokemon, typeValues);
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
  const dialogPokemonNameRef = document.querySelector('[data-id="dialog-pokemon-name"]');
  const dialogPokemonIdRef = document.querySelector('[data-id="dialog-pokemon-id"]');
  const dialogPokemonImageRef = document.querySelector('[data-id="dialog-image"]');
  const dialogPokemonBadgesRef = document.querySelector('[data-id="dialog-type-badges"]');

  const dialogHeaderPokemonData = getDialogHeaderPokemonData(pokemon, typeValues);

  dialogPokemonNameRef.innerHTML = dialogHeaderPokemonData.name;
  dialogPokemonIdRef.innerHTML = `#${dialogHeaderPokemonData.id}`;
  dialogPokemonImageRef.src = dialogHeaderPokemonData.imageSrc;
  dialogPokemonImageRef.alt = dialogHeaderPokemonData.imageAlt;
  dialogPokemonBadgesRef.innerHTML = dialogHeaderPokemonData.typeBadgesHtml;
}

/**
 * Updates the about, stats and evolution tab contents for the current Pokémon.
 */
function updateDialogTabPaneContent(pokemon, typeValues) {
  const abilityNames = getAbilityNamesAsString(pokemon);
  const evoChainTemplateData = getEvolutionPaneImagesData(pokemon);
  const aboutContentRef = document.querySelector('[data-id="about-tab-pane"]');
  const statContentRef = document.querySelector('[data-id="stat-tab-pane"]');
  const evolutionContentRef = document.querySelector('[data-id="evolution-tab-pane-content"]');

  aboutContentRef.innerHTML = getAboutPaneContentHtmlString(pokemon, abilityNames);
  statContentRef.innerHTML = getStatsPaneContentHtmlString(pokemon, typeValues);
  evolutionContentRef.innerHTML = getEvolutionPaneContentHtmlString(evoChainTemplateData);
}

/**
 * Shows the next loaded Pokémon in the open dialog.
 */
async function nextDialogPokemon(buttonRef, visiblePokemonIndex) {
  if (isChangingDialogPokemon) return;

  isChangingDialogPokemon = true;

  try {
    visiblePokemonIndex = visiblePokemonIndex + 1;
    if (isValidVisiblePokemonIndex(visiblePokemonIndex)) {
      await showDialogPokemon(visiblePokemonIndex);
    } else {
      console.error("No more Pokemons are loaded!");
    }
  } finally {
    isChangingDialogPokemon = false;
  }
}

/**
 * Shows the previous Pokémon in the open dialog.
 */
async function previousDialogPokemon(buttonRef, visiblePokemonIndex) {
  if (isChangingDialogPokemon) return;

  isChangingDialogPokemon = true;

  try {
    visiblePokemonIndex = visiblePokemonIndex - 1;
    if (isValidVisiblePokemonIndex(visiblePokemonIndex)) {
      await showDialogPokemon(visiblePokemonIndex);
    } else {
      console.error("You already reached the first Pokemon!");
    }
  } finally {
    isChangingDialogPokemon = false;
  }
}

function getDialogHeaderPokemonData(pokemon, typeValues) {
 return {
    name: pokemon.base.name.toUpperCase(),
    id: pokemon.base.id,
    imageSrc: pokemon.base.sprites.other.home.front_default,
    imageAlt: `Pokemon: ${capitalize(pokemon.base.name)}`,
    typeBadgesHtml: getDialogTypeBadgeHtmlString(typeValues),
  };
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
function getDialogTabListHtmlString() {
  let tabButtonsHtml = "";

  tabButtonsHtml = getDialogAboutTabButtonTemplate();
  tabButtonsHtml += getDialogStatsTabButtonTemplate();
  tabButtonsHtml += getDialogEvolutionTabButtonTemplate();

  return getDialogTabListTemplate(tabButtonsHtml );
}

/**
 * Creates the dialog tab content panel HTML.
 */
function getDialogTabPanesHtmlString() {
  let tabPanesHtml = "";

  tabPanesHtml = getDialogAboutTabPaneTemplate();
  tabPanesHtml += getDialogStatsTabPaneTemplate();
  tabPanesHtml += getDialogEvolutionTabPaneTemplate();

  return tabPanesHtml;
}

/**
 * Creates the HTML for the dialog's about tab.
 */
function getAboutPaneContentHtmlString(pokemon, abilityNames) {
  const aboutTabTemplateData = getAboutPaneRowsData(pokemon, abilityNames);
  let fullTabContentHtmlString = "";

  for (let index = 0; index < aboutTabTemplateData.length; index++) {
    const currentTemplateData = aboutTabTemplateData[index];
    currentTemplateData.value = capitalize(currentTemplateData.value);
    fullTabContentHtmlString += getAboutPaneRowTemplate(currentTemplateData);
  }

  return fullTabContentHtmlString;
}

/**
 * Creates the HTML for the dialog's stats tab from prepared stat data.
 */
function getStatsPaneContentHtmlString(pokemon, typeValues) {
  const statsTabContentArray = getStatsTabContentAsArray(pokemon.base.stats);
  let fullTabContentHtmlString = "";

  for (let index = 0; index < statsTabContentArray.length; index++) {
    const currentStat = statsTabContentArray[index];
    const statTemplateData = {
      title: capitalize(currentStat.title),
      value: currentStat.value,
      primaryTypeName: typeValues[0].type.name,
    };
    fullTabContentHtmlString += getStatsPaneRowTemplate(statTemplateData);
  }

  return fullTabContentHtmlString;
}

/**
 * Creates the HTML for the dialog's evolution tab.
 */
function getEvolutionPaneContentHtmlString(evoChainTemplateData) {
  let fullTapContentHtmlString = "";

  for (let index = 0; index < evoChainTemplateData.length; index++) {
    const currentTemplateData = evoChainTemplateData[index];

    if (index > 0) {
      fullTapContentHtmlString += getEvolutionPaneArrowTemplate();
    }
    fullTapContentHtmlString += getEvolutionPaneImageTemplate(currentTemplateData);
  }

  return fullTapContentHtmlString;
}

/**
 * Creates the template data rows used in the dialog's about tab.
 */
function getAboutPaneRowsData(pokemon, abilityNames) {
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
function getEvolutionPaneImagesData(pokemon) {
  const evoChain = evoChains[pokemon.evoChain.id];
  const evoChainPokemons = evoChain.pokemons;
  let evoChainImages = [];

  for (let index = 1; index <= Object.keys(evoChainPokemons).length; index++) {
    const currentPokemonImage = evoChainPokemons[index].image;
    evoChainImages.push({ image: currentPokemonImage });
  }

  return evoChainImages;
}
