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

/**
 * Opens the dialog after rendering the selected Pokémon.
 */
async function openDialog(visiblePokemonIndex) {
  let dialogRef = document.querySelector(`[data-id="dialog"]`);

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
  const dialogBgWrapperRef = document.querySelector('[data-id="overlay-pokemon-name"]');
  updateBg(typeValues, dialogBgWrapperRef);
  updateDialogHeader(pokemon, typeValues);
  updateDialogTabPaneContent(pokemon, typeValues);
}

/**
 * Updates the dialog background class based on the Pokémon's primary type.
 */
function updateBg(typeValues, elementRef) {
  const classPrefix = "bg-type-";
  const currentTypeClassName = classPrefix + typeValues[0].type.name;

  removeOldBg(elementRef, classPrefix, currentTypeClassName);
  elementRef.classList.add(currentTypeClassName);
}

/**
 * Removes outdated type background classes from the dialog wrapper.
 */
function removeOldBg(elementRef, classPrefix, currentTypeClassName) {
  elementRef.classList.forEach((typeClassName) => {
    if (typeClassName.startsWith(classPrefix) && typeClassName != currentTypeClassName) {
      elementRef.classList.remove(typeClassName);
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
  const evoChainTemplateData = getEvolutionPaneImagesData(pokemon);
  const evolutionContentRef = document.querySelector('[data-id="evolution-tab-pane-content"]');

  updateDialogAboutPaneContent(pokemon);
  updateDialogStatsPaneContent(pokemon, typeValues);
  evolutionContentRef.innerHTML = getEvolutionPaneContentHtmlString(evoChainTemplateData);
}

/**
 * Renders the about tab rows for the current Pokémon.
 */
function updateDialogAboutPaneContent(pokemon) {
  const aboutPaneRef = document.querySelector('[data-id="about-tab-pane"]');
  const pokemonAboutData = getPokemonAboutPaneData(pokemon);
  let aboutPaneHtml = "";

  for (let index = 0; index < pokemonAboutData.length; index++) {
    const currentTemplateData = pokemonAboutData[index];
    aboutPaneHtml += getAboutPaneRowTemplate(currentTemplateData);
  }
  aboutPaneRef.innerHTML = aboutPaneHtml;
}

/**
 * Renders the stats tab rows for the current Pokémon.
 */
function updateDialogStatsPaneContent(pokemon, typeValues) {
  const statsPaneRef = document.querySelector('[data-id="stats-tab-pane"]');
  const pokemonStatsData = getPokemonStatsPaneData(pokemon, typeValues);
  let statPaneHtml = "";

  for (let index = 0; index < pokemonStatsData.length; index++) {
    const currentTemplateData = pokemonStatsData[index];
    statPaneHtml += getStatsPaneRowTemplate(currentTemplateData);
  }
  statsPaneRef.innerHTML = statPaneHtml;
}

/**
 * Shows the next loaded Pokémon in the open dialog.
 */
async function nextDialogPokemon(buttonRef, visiblePokemonIndex) {
  if (isChangingDialogPokemon) return;

  isChangingDialogPokemon = true;

  try {
    visiblePokemonIndex = visiblePokemonIndex + 1;
    await showDialogPokemonIfValid(visiblePokemonIndex, "No more Pokemons are loaded!");
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
    await showDialogPokemonIfValid(visiblePokemonIndex, "You already reached the first Pokemon!");
  } finally {
    isChangingDialogPokemon = false;
  }
}

/**
 * Shows the given Pokémon if its index is valid, otherwise logs the provided error message.
 */
async function showDialogPokemonIfValid(visiblePokemonIndex, errorMessage) {
  if (isValidVisiblePokemonIndex(visiblePokemonIndex)) {
      await showDialogPokemon(visiblePokemonIndex);
    } else {
      console.error(errorMessage);
    }
}

/**
 * Creates the type badge HTML for all dialog header types.
 */
function getDialogTypeBadgeHtmlString(typeValues) {
  let badgesHtmlString = "";

  for (let indexType = 0; indexType < typeValues.length; indexType++) {
    const type = typeValues[indexType].type;
    const typeTemplateData = {
      name: capitalize(type.name),
      bg: `bg-type-${type.name}`,
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

  return getDialogTabListTemplate(tabButtonsHtml);
}

/**
 * Creates the empty tab pane containers for the dialog body, to be filled in separately.
 */
function getDialogTabPanesHtmlString() {
  let tabPanesHtml = "";

  tabPanesHtml = getDialogAboutTabPaneTemplate();
  tabPanesHtml += getDialogStatsTabPaneTemplate();
  tabPanesHtml += getDialogEvolutionTabPaneTemplate();

  return tabPanesHtml;
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
 * Builds the template data used to render the dialog wrapper's header, tab list and tab panes.
 */
function getDialogContentTemplateData() {
  return {
    headerHtml: getDialogHeaderTemplate(),
    tabListHtml: getDialogTabListHtmlString(),
    tabPanesHtml: getDialogTabPanesHtmlString(),
  };
}

/**
 * Builds the template data for the dialog header, including name, id, image and type badges.
 */
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
 * Builds the name, height, weight and ability rows shown in the dialog's about tab.
 */
function getPokemonAboutPaneData(pokemon) {
  return [
    { key: "Name:", value: capitalize(pokemon.base.name) },
    { key: "Height:", value: pokemon.base.height },
    { key: "Weight:", value: pokemon.base.weight },
    { key: "Abilities:", value: getAbilityNamesAsString(pokemon) },
  ];
}

/**
 * Builds the template data for the dialog's stats tab from the Pokémon's stats.
 */
function getPokemonStatsPaneData(pokemon, typeValues) {
  const pokemonStats = pokemon.base.stats;

  return buildPokemonStatsPaneData(pokemonStats, typeValues);
}

/**
 * Creates one stats row entry per stat, with its title, value and type-colored background.
 */
function buildPokemonStatsPaneData(pokemonStats, typeValues) {
  let statsTabContentArray = [];

  for (let statsIndex = 0; statsIndex < pokemonStats.length; statsIndex++) {
    const currentStats = pokemonStats[statsIndex];
    statsTabContentArray.push({
      statsTitle: capitalize(currentStats.stat.name),
      statsValue: currentStats.base_stat,
      statsBarWidth: ((currentStats.base_stat / 255) * 100).toFixed(2),
      statsMaxValue: 255,
      rowBg: `bg-type-${typeValues[0].type.name}`,
    });
  }
  return statsTabContentArray;
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
