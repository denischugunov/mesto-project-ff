// Функция обработки клика для открытия окна (с навешиванием слушателей для его закрытия)
function handleOpenPopup(popupElement) {
  openPopup(popupElement);
  popupElement.addEventListener("click", handlePopupCloseClick);
  document.addEventListener("keydown", handleEscKeydown);
}

// Функция открытия окна
function openPopup(popupElement) {
  popupElement.classList.remove("popup_is-animated");
  popupElement.classList.add("popup_is-opened");
}

// Функция обработки клика для закрытия окна
function handlePopupCloseClick(evt) {
  const popupElement = evt.target.closest(".popup");
  if (
    evt.target.classList.contains("popup__close") ||
    !evt.target.closest(".popup__content") ||
    evt.target.classList.contains("popup__button")
  ) {
    closePopup(popupElement);
  }
}

// Функция обработки нажатия клавиши 'esc'
function handleEscKeydown(evt) {
  if (evt.key === "Escape") {
    const popupElement = document.querySelector(".popup.popup_is-opened");
    closePopup(popupElement);
  }
}

// Функция закрытия окна
function closePopup(popupElement) {
  popupElement.classList.add("popup_is-animated");
  popupElement.classList.remove("popup_is-opened");
  popupElement.removeEventListener("click", handlePopupCloseClick);
  document.removeEventListener("keydown", handleEscKeydown);
}

export { handleOpenPopup };
