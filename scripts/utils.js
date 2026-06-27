/**
 * Removes the scroll lock from the page body.
 */
function removeBodyScrollLock() {
  document.body.classList.remove("overFlowHidden");
}

/**
 * Capitalizes the first character of a string.
 */
function capitalize(string) {
  if (typeof string === "string") {
    return string.replace(string.charAt(0), string.charAt(0).toUpperCase());
  } else return string;
}

/**
 * Toggles the disabled state of an element.
 */
function toggleDisable(element) {
  element.disabled = !element.disabled;
}

function toggleVisibility(element) {
  element.classList.toggle("visually-hidden");
}

function changeLoadingButtonState(loadMoreButtonRef) {
  const loadTextRef = document.querySelector('[data-id="button-load-text"]');
  const loadingTextRef = document.querySelector('[data-id="button-loading-text"]');
  const spinnerRef = document.querySelector('[data-id="button-loading-spinner"]');
  toggleDisable(loadMoreButtonRef);
  toggleVisibility(loadTextRef);
  toggleVisibility(loadingTextRef);
  toggleVisibility(spinnerRef);
}