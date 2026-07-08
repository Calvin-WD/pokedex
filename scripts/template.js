/**
 * Creates the HTML for a Pokémon card.
 */
function getPokemonCardTemplate(pokemonTemplateData) {
  return `<li>
      <button 
      type="button"
      class="card pokemon-card button-reset bg-body-tertiary h-100 p-0"
      data-id="card"
      data-pokemon-id="${pokemonTemplateData.id}"
      data-visible-pokemon-index="${pokemonTemplateData.visiblePokemonIndex}"
      aria-label="#${pokemonTemplateData.id} ${pokemonTemplateData.name}, open details"
      onclick="openDialog(${pokemonTemplateData.visiblePokemonIndex})">
        <header class="card-header d-flex flex-row justify-content-between align-items-center">
          <span>#${pokemonTemplateData.id}</span>
          <h2 class="text-end">${pokemonTemplateData.nameUpperCase}</h2>
        </header>
        <div
        class="card-body pokemon-card-body position-relative d-flex justify-content-center bg-type-${pokemonTemplateData.primaryTypeName} p-0">
          <img src="${pokemonTemplateData.image}" alt="Pokemon: ${pokemonTemplateData.name}" class="pokemon-card-image w-75" data-id="card-image">
        </div>
        <footer class="d-flex justify-content-center gap-5 p-1">${pokemonTemplateData.typeIconsHtml}</footer>
      </button>
    </li>`;
}

/**
 * Creates the HTML for a Pokémon type icon.
 */
function getPokemonCardTypeImageTemplate(typeTemplateData) {
  return `<img
        src="${typeTemplateData.image}"
        alt="Type: ${typeTemplateData.name}"
        class="pokemon-card-type-image"
        loading="lazy">`;
}

/**
 * Creates the complete dialog shell with stable dynamic content areas.
 */
function getDialogContentTemplate(dialogContentTemplateData) {
  return `<div class="modal-dialog">
        <div class="modal-content rounded-3"
        data-id="overlay-pokemon-name">
          <header class="modal-header flex-column p-3 border-0">
            <div class="d-flex justify-content-end align-items-center w-100">
              <button
              type="button"
              class="btn button-reset button-close"
              data-bs-theme="dark"
              aria-label="Close the Overview"
              onclick="closeDialog()"
              data-id="close-dialog-button">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div data-id="dialog-header-content">
            ${dialogContentTemplateData.headerHtml}
            </div>
          </header>
          <div class="modal-body bg-body-secondary text-body rounded-3 px-3 py-2">
              ${dialogContentTemplateData.tabListHtml}
            <div class="tab-content dialog-tab-content overflow-y-auto overflow-x-hidden"
            id="myTabContent"
            data-id="dialog-tab-panes"
            tabindex="-1">
            ${dialogContentTemplateData.tabPanesHtml}
            </div>
          </div>
        </div>
      </div>`;
}

/**
 * Creates the dialog header with Pokémon details and type badges.
 */
function getDialogHeaderTemplate() {
  return `<div class="d-flex flex-row-reverse align-items-center justify-content-end w-100 gap-2">
        <h2 class="modal-title" id="cardExtensionLabel" data-id="dialog-pokemon-name">
        </h2>
        <span class="dialog-pokemon-id" data-id="dialog-pokemon-id"></span>
      </div>
      <div class="d-flex flex-column gap-4">
        <div class="d-flex justify-content-around align-items-center">
          <button
          type="button"
          class="btn button-reset button-skip"
          data-id="prev-button"
          aria-label="Show previous Pokemon"
          onclick="previousDialogPokemon(this,Number(this.closest('dialog').dataset.visiblePokemonIndex))">
            <i class="bi bi-caret-left-fill"></i>
          </button>
          <img
          alt=""
          class="dialog-image w-50"
          data-id="dialog-image"
          />
          <button
          type="button"
          class="btn button-reset button-skip"
          data-id="next-button"
          aria-label="Show next Pokemon"
          onclick="nextDialogPokemon(this,Number(this.closest('dialog').dataset.visiblePokemonIndex))">
            <i class="bi bi-caret-right-fill"></i>
          </button>
        </div>
        <div class="d-flex flex-row justify-content-center gap-3" data-id="dialog-type-badges">
        </div>
      </div>`;
}

/**
 * Creates a type badge for the dialog header.
 */
function getHeaderTypeBadgeTemplate(type) {
  return `<span class="badge badge-type ${type.bg} rounded-5">
    ${type.name}
  </span>`;
}

/**
 * Creates the navigation tab list for the dialog body.
 */
function getDialogTabListTemplate(navTabHtml) {
  return `<ul class="nav nav-underline justify-content-around mb-1" id="myTab" role="tablist">${navTabHtml}</ul>`;
}

/**
 * Creates the about tab button for the dialog navigation.
 */
function getDialogAboutTabButtonTemplate() {
  return `<li class="nav-item" role="presentation">
      <button
        class="nav-link button-reset button-nav active"
        id="about-tab"
        data-bs-toggle="tab"
        data-bs-target="#about-tab-pane"
        type="button"
        role="tab"
        aria-controls="about-tab-pane"
        aria-selected="true"
      >
        About
      </button>
    </li>`;
}

/**
 * Creates the stats tab button for the dialog navigation.
 */
function getDialogStatsTabButtonTemplate() {
  return `<li class="nav-item" role="presentation">
      <button
        class="nav-link button-reset button-nav"
        id="stats-tab"
        data-bs-toggle="tab"
        data-bs-target="#stats-tab-pane"
        type="button"
        role="tab"
        aria-controls="stats-tab-pane"
        aria-selected="false"
      >
        Stats
      </button>
    </li>`;
}

/**
 * Creates the evolution tab button for the dialog navigation.
 */
function getDialogEvolutionTabButtonTemplate() {
  return `<li class="nav-item" role="presentation">
      <button
        class="nav-link button-reset button-nav"
        id="evolution-tab"
        data-bs-toggle="tab"
        data-bs-target="#evolution-tab-pane"
        type="button"
        role="tab"
        aria-controls="evolution-tab-pane"
        aria-selected="false"
      >
        Evolution
      </button>
    </li>`;
}

/**
 * Creates the empty content panel for the dialog's about tab.
 */
function getDialogAboutTabPaneTemplate() {
  return `<div
      class="tab-pane fade show active"
      id="about-tab-pane"
      data-id="about-tab-pane"
      role="tabpanel"
      aria-labelledby="about-tab"
    ></div>`;
}

/**
 * Creates the empty content panel for the dialog's stats tab.
 */
function getDialogStatsTabPaneTemplate() {
  return `<div
      class="tab-pane fade"
      id="stats-tab-pane"
      data-id="stats-tab-pane"
      role="tabpanel"
      aria-labelledby="stats-tab"
    ></div>`;
}

/**
 * Creates the content panel for the dialog's evolution tab.
 */
function getDialogEvolutionTabPaneTemplate() {
  return `<div
      class="tab-pane fade"
      id="evolution-tab-pane"
      data-id="evolution-tab-pane"
      role="tabpanel"
      aria-labelledby="evolution-tab"
    >
      <div
        class="d-flex justify-content-center align-items-center gap-2 py-2"
        data-id="evolution-tab-pane-content"
      ></div>
    </div>`;
}

/**
 * Creates one row for the dialog's about tab.
 */
function getAboutPaneRowTemplate(templateData) {
  return `<dl class="row flex-column flex-sm-row align-items-start align-items-sm-center pt-2 mb-0">
      <dt class="col-12 col-sm-4">${templateData.key}</dt>
      <dd class="col-12 col-sm-8 mb-0">${templateData.value}</dd>
    </dl>`;
}

/**
 * Creates one stats row for the dialog's stats tab.
 */
function getStatsPaneRowTemplate(statsTemplateData) {
  return `<dl class="row flex-column flex-sm-row align-items-start align-items-sm-center pt-2 mb-0">
      <dt class="col-12 col-sm-4">${statsTemplateData.statsTitle}:</dt>
      <dd class="col-12 col-sm-8 mb-0">
        <div
        class="progress"
        data-id="stats-progress-${statsTemplateData.statsTitle}"
        role="progressbar"
        aria-label="Example with label"
        aria-valuenow="${statsTemplateData.statsValue}"
        aria-valuemin="0"
        aria-valuemax="${statsTemplateData.statsMaxValue}">
          <div
          class="progress-bar h-75 rounded ${statsTemplateData.rowBg}"
          data-id="stats-progressbar-${statsTemplateData.statsTitle}"
          style="width: ${statsTemplateData.statsBarWidth}%">
          </div>
        </div>
      </dd>
    </dl>`;
}

/**
 * Creates one evolution image for the dialog's evolution tab.
 */
function getEvolutionPaneImageTemplate(evoChainTemplateData) {
  return `<img src="${evoChainTemplateData.image}" alt="Pokemon: ${evoChainTemplateData.name}" class="dialog-tab-content-evolution-image">`;
}

/**
 * Creates the arrow shown between evolution stages.
 */
function getEvolutionPaneArrowTemplate() {
  return `<i class="bi bi-arrow-right"></i>`;
}

/**
 * Creates a feedback message for  empty search results.
 */
function getNoMatchFoundFeedbackMessageTemplate(string) {
  return `<p class="container feedback-message d-flex justify-content-center text-center" data-id="not-found">${string}</p>`;
}

/**
 * Creates a feedback message for failures.
 */
function getFeedbackMessageTemplate(string) {
  return `<p class="container feedback-message d-flex justify-content-center text-center">${string}</p>`;
}
