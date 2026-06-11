function getSmallPokemonCardTemplate(pokemon, typesArray, footerHtmlString) {
  return `<div class="card text-bg-dark smallCard-width h-100">
      <div class="card-header d-flex flex-row-reverse justify-content-between align-items-center">
        <h5>${pokemon.name.toUpperCase()}</h5> <h6>#${pokemon.id}</h6>
      </div>
      <div class="card-body position-relative d-flex justify-content-center smallCard-body-height bg-${typesArray[0].name} p-0">
        <img src="${pokemon.image}" class="smallCard-img w-75">
      </div>
      <div class="card-footer d-flex justify-content-center gap-5">${footerHtmlString}</div>
    </div>`;
}

function getSmallPokemonCardTypeImageTemplate(typeImgUrl) {
  return `<img src="${typeImgUrl}" class="smallCard-type-img">`;
}
