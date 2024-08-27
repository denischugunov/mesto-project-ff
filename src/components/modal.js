// Функция обработки клика для открытия окна (с навешиванием слушателей для его закрытия)
function handleOpenModule(module) {
  openModule(module);
  module.addEventListener("click", clickHandler);
  document.addEventListener("keydown", keydownHandler);
}

// Функция открытия окна
function openModule(module) {
  module.classList.remove("popup_is-animated");
  module.classList.add("popup_is-opened");
}

// Функция обработки клика для закрытия окна
function clickHandler(evt) {
  const module = evt.target.closest(".popup");
  if (
    evt.target.classList.contains("popup__close") ||
    !evt.target.closest(".popup__content")
  ) {
    closeModule(module);
  } else if (evt.target.classList.contains("popup__button")) {
    validateForm(module);
  }
}

// Функция валидации форм
// Ее нет в ТЗ, но, на мой взгляд, валидация тут уместна.
// Чтобы форма не закрывалась по кнопке, если данные неправильные введены
function validateForm(module) {
  const inputs = module.querySelectorAll("input");
  const allValid = Array.from(inputs).every((input) => input.validity.valid);
  if (allValid) {
    closeModule(module);
  }
}

// Функция обработки нажатия клавиши 'esc'
function keydownHandler(evt) {
  const module = document.querySelector(".popup.popup_is-opened");
  if (evt.key === "Escape") {
    closeModule(module);
  }
}

// Функция закрытия окна
function closeModule(module) {
  module.classList.add("popup_is-animated");
  module.classList.remove("popup_is-opened");
  module.removeEventListener("click", clickHandler);
  document.removeEventListener("keydown", keydownHandler);
}

export { handleOpenModule };
