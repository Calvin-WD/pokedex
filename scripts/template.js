/**
 * Creates the HTML for a Pokémon card.
 */
function getPokemonCardTemplate(pokemon, cardTypeIconsHtml) {
  return `<button 
    type="button"
    class="card button-reset button-card bg-body-tertiary card-width h-100 p-0"
    data-id="card"
    data-pokemon-id="${pokemon.base.id}"
    onclick="openDialog(${pokemon.base.id})">
      <header class="card-header d-flex flex-row-reverse justify-content-between align-items-center">
        <h5 class="text-end">${pokemon.base.name.toUpperCase()}</h5> <h6>#${pokemon.base.id}</h6>
      </header>
      <div
      class="card-body position-relative d-flex justify-content-center card-body-height bg-type-${pokemon.base.types[0].type.name} p-0">
        <img src="${pokemon.base.sprites.other.home.front_default}" class="card-image w-75" data-id="card-image">
      </div>
      <footer class="d-flex justify-content-center gap-5 p-1">${cardTypeIconsHtml}</footer>
    </button>`;
}

/**
 * Creates the HTML for a Pokémon type icon.
 */
function getPokemonCardTypeImageTemplate(typeImgUrl) {
  return `<img src="${typeImgUrl}" class="card-type-image">`;
}

/**
 * Creates the complete dialog shell with stable dynamic content areas.
 */
function getDialogContentTemplate(typesArray, dialogNavTabHtml, dialogNavContentHtml) {
  return `<div class="modal-dialog">
        <div class="modal-content bg-type-${typesArray[0].type.name} rounded-3"
        data-id="dialog-bg-wrapper">
          <header class="modal-header flex-column p-3 border-0"
          data-id="overlay-pokemon-name">
            <div class="d-flex justify-content-end align-items-center w-100">
              <button type="button" class="btn button-reset button-close" data-bs-theme="dark"
              onclick="closeDialog()"
              data-id="close-dialog-button">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div data-id="dialog-header-content">
            </div>
          </header>
          <div class="modal-body bg-body-secondary text-body rounded-3 px-3 py-2">
              ${dialogNavTabHtml}
            <div class="tab-content tab-content-maxHeight overflow-y-auto overflow-x-hidden"
            id="myTabContent"
            data-id="dialog-nav-content"
            tabindex="-1">
            ${dialogNavContentHtml}
            </div>
          </div>
        </div>
      </div>`;
}

/**
 * Creates the dialog header with Pokémon details and type badges.
 */
function getDialogHeaderTemplate(pokemon, badgesHtml) {
  return `<div class="d-flex flex-row-reverse align-items-center justify-content-end w-100 gap-2">
        <h3 class="modal-title fs-5" id="cardExtensionLabel">
          ${pokemon.base.name.toUpperCase()}
        </h3>
        <h4>#${pokemon.base.id}</h4>
      </div>
      <div class="d-flex flex-column gap-4">
        <div class="d-flex justify-content-around align-items-center">
          <button
          type="button"
          class="btn button-reset button-skip"
          data-id="prev-button"
          onclick="previousDialogPokemon(this, Number(this.closest('dialog').dataset.pokemonId))">
            <i class="bi bi-caret-left-fill"></i>
          </button>
          <img
          src="${pokemon.base.sprites.other.home.front_default}"
          alt=""
          class="w-50 dialog-image dialog-image-minwidth"
          data-id="dialog-image"
          />
          <button
          type="button"
          class="btn button-reset button-skip"
          data-id="next-button"
          onclick="nextDialogPokemon(this, Number(this.closest('dialog').dataset.pokemonId))">
            <i class="bi bi-caret-right-fill"></i>
          </button>
        </div>
        <div class="d-flex flex-row justify-content-center gap-3">
          ${badgesHtml}
        </div>
      </div>`;
}

/**
 * Creates a type badge for the dialog header.
 */
function getHeaderTypeBadgeTemplate(typeName, typeBackground) {
  return `<span class="badge badge-type ${typeBackground} rounded-5">
    ${typeName}
  </span>`;
}

/**
 * Creates the navigation tabs for the dialog body.
 */
function getDialogNavTabsTemplate() {
  return `<ul class="nav nav-underline justify-content-around mb-3" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
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
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link button-reset button-nav"
          id="stat-tab"
          data-bs-toggle="tab"
          data-bs-target="#stat-tab-pane"
          type="button"
          role="tab"
          aria-controls="stat-tab-pane"
          aria-selected="false"
        >
          Stats
        </button>
      </li>
      <li class="nav-item" role="presentation">
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
      </li>
    </ul>`;
}

/**
 * Creates empty tab panels for dynamic dialog content.
 */
function getDialogNavContentTemplate() {
  return `<div
        class="tab-pane fade show active"
        id="about-tab-pane"
        data-id="about-tab-pane"
        role="tabpanel"
        aria-labelledby="about-tab"
      >
      </div>
      <div
        class="tab-pane fade"
        id="stat-tab-pane"
        data-id="stat-tab-pane"
        role="tabpanel"
        aria-labelledby="stat-tab"
      >
      </div>
      <div
        class="tab-pane fade"
        id="evolution-tab-pane"
        role="tabpanel"
        aria-labelledby="evolution-tab"
      >
        <div class="d-flex justify-content-center align-items-center gap-2 py-2"
        data-id="evolution-tab-pane">
        </div>
    </div>`;
}

/**
 * Creates one row for the dialog's about tab.
 */
function getAboutTabContentTemplate(aboutObject) {
  return `<dl class="row flex-column flex-sm-row align-items-start align-items-sm-center pt-2 mb-0">
      <dt class="col-12 col-sm-4">${aboutObject.title}:</dt>
      <dd class="col-12 col-sm-8 mb-0">${aboutObject.value}</dd>
    </dl>`;
}

/**
 * Creates one row for the dialog's stats tab.
 */
function getStatsTabContentTemplate(statsObject, typeName) {
  return `<dl class="row flex-column flex-sm-row align-items-start align-items-sm-center pt-2 mb-0">
      <dt class="col-12 col-sm-4">${statsObject.title}:</dt>
      <dd class="col-12 col-sm-8 mb-0">
        <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar bg-type-${typeName} h-75 rounded" style="width: ${statsObject.value}%"></div>
        </div>
      </dd>
    </dl>`;
}

/**
 * Creates one evolution image for the dialog's evolution tab.
 */
function getEvoChainTabContentTemplate(evoChainImage) {
  return `<img src="${evoChainImage}" class="evoChain-image">`;
}

/**
 * Creates the arrow shown between evolution stages.
 */
function getEvoChainArrowTemplate() {
  return `<i class="bi bi-arrow-right"></i>`;
}

function getNoMatchFoundTemplate() {
  return `<p class="container d-flex justify-content-center" data-id="not-found">No match found!</p>`;
}
