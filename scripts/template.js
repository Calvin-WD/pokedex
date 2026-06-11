function getSmallPokemonCardTemplate(pokemon) {
  return (
    `<div class="card text-bg-dark smallCard-width h-100">
      <div class="card-header d-flex flex-row-reverse justify-content-between align-items-center">
        <h5>${pokemon.name.toUpperCase()}</h5> <h6>#${pokemon.id}</h6>
      </div>
      <div class="card-body position-relative d-flex justify-content-center smallCard-body-height bg-${pokemon.types[0].name} p-0">
        <img src="${pokemon.image}" class="smallCard-img w-75">
      </div>
      <div class="card-footer">This is some text within a card body.</div>
    </div>`
  );
}
