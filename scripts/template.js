function getPokemonCardTemplate(tag, pokemon, typesArray, footerHtmlString, extension = "") {
  return `<${tag} class="card text-bg-dark card-width h-100 p-0" data-pokemon-id="${pokemon.id}" data-bs-toggle="modal" data-bs-target="#cardExtension">
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
