/** 
 * Card Templates
 */

function getPokemonCardTemplate(tag, pokemon, typesArray, footerHtmlString, extension = "") {
  return `<${tag} class="card text-bg-dark card-width h-100 p-0" data-pokemon-id="${pokemon.id}" onclick="openDialog(${pokemon.id})">
      <div class="card-header d-flex flex-row-reverse justify-content-between align-items-center">
        <h5 class="text-end">${pokemon.name.toUpperCase()}</h5> <h6>#${pokemon.id}</h6>
      </div>
      <div class="card-body position-relative d-flex justify-content-center card-body-height bg-type-${typesArray[0].name} p-0">
        <img src="${pokemon.image}" class="card-image w-75" data-id="card-image">
      </div>
      <div class="d-flex justify-content-center gap-5 p-1">${footerHtmlString}</div>
      ${extension}
    </${tag}>`;
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

function getDialogContentTemplate(pokemon) {
  return `<div class="modal-dialog">
        <div class="modal-content bg-type-fire rounded-4">
          ${getDialogHeaderTemplate(pokemon)}
          ${getDialogBodyTemplate()}
          ${getDialogFooterTemplate()}
        </div>
      </div>`;
}

function getDialogHeaderTemplate(pokemon) {
  return `<div class="modal-header flex-column p-3 border-0">
      <button type="button" class="btn-close" onclick="closeDialog()"></button>
      <div class="d-flex flex-row-reverse justify-content-end align-items-center w-100 gap-2">
        <h3 class="modal-title fs-5" id="cardExtensionLabel">
          ${pokemon.name}
        </h3>
        <h4>#${pokemon.id}</h4>
      </div>
      <div class="d-flex justify-content-around">
        <div class="d-flex flex-column justify-content-center gap-3">
          <span class="badge text-bg-dark">Fire</span>
          <span class="badge text-bg-dark">Flying</span>
        </div>
        <img
          src="${pokemon.image}"
          alt=""
          class="w-50"
        />
      </div>
    </div>`;
}

function getDialogBodyTemplate() {
  return `<div class="modal-body card-bg-white rounded-top-4 p-3">
      ${getDialogBodyNavTabsTemplate()}
      ${getDialogBodyNavContentTemplate()}
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
          id="base-tab"
          data-bs-toggle="tab"
          data-bs-target="#base-tab-pane"
          type="button"
          role="tab"
          aria-controls="base-tab-pane"
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

function getDialogBodyNavContentTemplate() {
  return (
    `<div class="tab-content" id="myTabContent">
      <div
        class="tab-pane fade show active"
        id="about-tab-pane"
        role="tabpanel"
        aria-labelledby="about-tab"
        tabindex="0"
      >
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Species</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Height</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Weight</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Abilities</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
      </div>
      <div class="tab-pane fade" id="base-tab-pane" role="tabpanel" aria-labelledby="base-tab" tabindex="0">
        <dl class="row pt-2 mb-0">
          <dt class="col-3">HP</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Attack</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Defense</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Sp. Def</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Sp. Atk</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Speed</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Total</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
      </div>
      <div class="tab-pane fade" id="evolution-tab-pane" role="tabpanel" aria-labelledby="evolution-tab" tabindex="0">
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Species</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Height</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Weight</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
        <dl class="row pt-2 mb-0">
          <dt class="col-3">Abilities</dt>
          <dd class="col-9">Description Details</dd>
        </dl>
      </div>
    </div>`
  );
}

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

/** 
 * Dialog Templates END
 */
