/**
 * Card Templates
 */

function getPokemonCardTemplate(pokemon, footerHtml) {
  return `<button type="button" class="card text-bg-dark card-width h-100 p-0" data-pokemon-id="${pokemon.base.id}" onclick="openDialog(${pokemon.base.id})">
      <div class="card-header d-flex flex-row-reverse justify-content-between align-items-center">
        <h5 class="text-end">${pokemon.base.name.toUpperCase()}</h5> <h6>#${pokemon.base.id}</h6>
      </div>
      <div class="card-body position-relative d-flex justify-content-center card-body-height bg-type-${pokemon.base.types[0].type.name} p-0">
        <img src="${pokemon.base.sprites.other.home.front_default}" class="card-image w-75" data-id="card-image">
      </div>
      <div class="d-flex justify-content-center gap-5 p-1">${footerHtml}</div>
    </button>`;
}

function getPokemonCardTypeImageTemplate(typeImgUrl) {
  return `<img src="${typeImgUrl}" class="card-type-image">`;
}

/**
 * Card Templates END
 */

/**
 * Dialog Templates
 */

/** Content Template */
function getDialogContentTemplate(typesArray, headerHtml, dialogBodyHtml, dialogFooterHtml) {
  return `<div class="modal-dialog">
        <div class="modal-content bg-type-${typesArray[0].type.name} rounded-4">
          ${headerHtml}
          ${dialogBodyHtml}
          ${dialogFooterHtml}
        </div>
      </div>`;
}
/** Content Template END */

/** Header templates */
function getDialogHeaderTemplate(pokemon, badgesHtml) {
  return `<div class="modal-header flex-column p-3 border-0">
      <button type="button" class="btn-close" onclick="closeDialog()"></button>
      <div class="d-flex flex-row-reverse justify-content-end w-100 gap-2">
        <h3 class="modal-title fs-5" id="cardExtensionLabel">
          ${pokemon.base.name.toUpperCase()}
        </h3>
        <h4>#${pokemon.base.id}</h4>
      </div>
      <div class="d-flex justify-content-around">
        <div class="d-flex flex-column justify-content-center gap-3">
          ${badgesHtml}
        </div>
        <img
          src="${pokemon.base.sprites.other.home.front_default}"
          alt=""
          class="w-50"
        />
      </div>
    </div>`;
}

function getHeaderTypeBadgeTemplate(typeName) {
  return `<span class="badge text-bg-dark">${typeName.toUpperCase()}</span>`;
}
/** Header templates END */

/** Body templates */
function getDialogBodyTemplate(aboutTabContentHtml, statTabContentHtml) {
  return `<div class="modal-body card-bg-white rounded-top-4 p-3">
      ${getDialogBodyNavTabsTemplate()}
      ${getDialogBodyNavContentTemplate(aboutTabContentHtml, statTabContentHtml)}
    </div>`;
}

function getDialogBodyNavTabsTemplate() {
  return `<ul class="nav nav-tabs justify-content-around" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
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
          class="nav-link"
          id="stat-tab"
          data-bs-toggle="tab"
          data-bs-target="#stat-tab-pane"
          type="button"
          role="tab"
          aria-controls="stat-tab-pane"
          aria-selected="false"
        >
          Base Stats
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
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

function getDialogBodyNavContentTemplate(aboutTabContentHtml, statTabContentHtml) {
  return `<div class="tab-content" id="myTabContent">
      <div
        class="tab-pane fade show active"
        id="about-tab-pane"
        role="tabpanel"
        aria-labelledby="about-tab"
        tabindex="0"
      >
        ${aboutTabContentHtml}
      </div>
      <div
        class="tab-pane fade"
        id="stat-tab-pane"
        role="tabpanel"
        aria-labelledby="stat-tab"
        tabindex="0"
      >
        ${statTabContentHtml}
      </div>
      <div
        class="tab-pane fade"
        id="evolution-tab-pane"
        role="tabpanel"
        aria-labelledby="evolution-tab"
        tabindex="0"
      >
        <div></div>
    </div>
  </div>`;
}

function getAboutTabContentTemplate(aboutObject) {
  return `<dl class="row pt-2 mb-0">
      <dt class="col-5">${aboutObject.title}</dt>
      <dd class="col-7">${aboutObject.value}</dd>
    </dl>`;
}

function getStatsTabContentTemplate(statsObject) {
  return (
    `<dl class="row pt-2 mb-0">
      <dt class="col-5">${statsObject.title}</dt>
      <dd class="col-7">${statsObject.value}</dd>
    </dl>`
  );
}

function getEvoChainTabContentTemplate() {

}
/** Body templates END */

/** Footer templates */
function getDialogFooterTemplate() {
  return `<div class="modal-footer justify-content-between card-bg-white rounded-bottom-4 border-0">
  <button type="button" class="btn">
  Previous
  </button>
  <button type="button" class="btn">
  Next
  </button>
  </div>`;
}
/** Footer templates END */

/**
 * Dialog Templates END
 */
