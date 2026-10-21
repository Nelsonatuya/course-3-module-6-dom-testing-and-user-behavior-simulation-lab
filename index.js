function displayError(message) {
  const errorElement = document.getElementById("error-message");

  if (!errorElement) return false;

  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
  return true;
}

function clearError() {
  const errorElement = document.getElementById("error-message");

  if (!errorElement) return;

  errorElement.textContent = "";
  errorElement.classList.add("hidden");
}

function addElementToDOM(containerId, content) {
  const container = document.getElementById(containerId);

  if (!container) return null;

  const element = document.createElement("p");
  element.textContent = content;
  container.appendChild(element);
  return element;
}

function removeElementFromDOM(elementId) {
  const element = document.getElementById(elementId);

  if (!element || !element.parentNode) return false;

  element.parentNode.removeChild(element);
  return true;
}

function simulateClick(containerId, content) {
  return addElementToDOM(containerId, content);
}

function handleFormSubmit(formId, contentId) {
  const form = document.getElementById(formId);

  if (!form) {
    displayError("Form not found");
    return false;
  }

  const input = form.querySelector("input");
  if (!input) {
    displayError("Input field not found");
    return false;
  }

  const value = input.value.trim();
  if (!value) {
    displayError("Input cannot be empty");
    return false;
  }

  const addedElement = addElementToDOM(contentId, value);
  if (!addedElement) {
    displayError("Content area not found");
    return false;
  }

  clearError();
  return true;
}

function initializeDOMBehavior() {
  const clickButton = document.getElementById("simulate-click");
  const form = document.getElementById("user-form");

  if (clickButton) {
    clickButton.addEventListener("click", () => {
      simulateClick("dynamic-content", "Button Clicked!");
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handleFormSubmit("user-form", "dynamic-content");
    });
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDOMBehavior);
  } else {
    initializeDOMBehavior();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    addElementToDOM,
    removeElementFromDOM,
    simulateClick,
    handleFormSubmit,
    initializeDOMBehavior,
  };
}
