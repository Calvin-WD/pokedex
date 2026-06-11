async function getData(path = "") {
  let response = await fetch(POKEAPI_BASE_URL + path);
  return (responseToJson = await response.json());
}
