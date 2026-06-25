function removeBodyScrollLock() {
  document.body.classList.remove("overFlowHidden");
}

function capitalize(string) {
  if (typeof string === "string") {
    return string.replace(string.charAt(0), string.charAt(0).toUpperCase());
  } else return string;
}

function toggleDisable(element) {
  element.disabled = !element.disabled;
}
