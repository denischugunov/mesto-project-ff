import { checkImageHeadRequest } from "./api.js";

// Функция отображения сообщения об ошибке для поля ввода
const showInputError = (
  formElement,
  inputElement,
  errorMessage,
  validationConfig
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);

  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
};

// Функция скрытия сообщения об ошибке для поля ввода
const hideInputError = (formElement, inputElement, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.errorClass);
  errorElement.textContent = "";
};

// Функция проверки валидности поля и отображения/скрытия ошибок
const isValid = async (formElement, inputElement, validationConfig) => {
  // Проверка на patternMismatch
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  // Проверка, если это поле для загрузки аватара
  if (inputElement.classList.contains("popup__input_edit-avatar")) {
    const result = await checkLinkIsImage(inputElement);

    if (!result) {
      inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
      inputElement.setCustomValidity("");
    }
  }

  // Проверка валидности после установки кастомного сообщения об ошибке
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      validationConfig
    );
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
};

// Функция проверки валидности ссылки для обновления аватарки
async function checkLinkIsImage(inputElement) {
  const linkImage = inputElement.value.trim();

  if (linkImage.length === 0) {
    return false;
  }

  try {
    const isImage = await checkImageHeadRequest(linkImage);
    return isImage;
  } catch (error) {
    return false;
  }
}

// Функция проверки наличия недопустимых полей в форме
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Функция управления состоянием кнопки отправки формы
const toggleButtonState = (inputList, buttonElement, validationConfig) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
};

// Функция для навешивания слушателей событий на поля ввода
const setEventListeners = (formElement, validationConfig) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", async () => {
      await isValid(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig);
    });
  });
};

// Функция инициализации валидации форм
const enableValidation = (validationConfig) => {
  const formList = Array.from(
    document.querySelectorAll(validationConfig.formSelector)
  );

  formList.forEach((formElement) => {
    setEventListeners(formElement, validationConfig);
  });
};

// Функция очистки данных валидации при повторном открытии форм
const clearValidation = async (profileForm, validationConfig) => {
  const localInputs = Array.from(
    profileForm.querySelectorAll(validationConfig.inputSelector)
  );
  for (const localInput of localInputs) {
    await isValid(profileForm, localInput, validationConfig);
    hideInputError(profileForm, localInput, validationConfig);
  }
  const localButton = profileForm.querySelector(
    validationConfig.submitButtonSelector
  );
  toggleButtonState(localInputs, localButton, validationConfig);
};

export { enableValidation, clearValidation };
