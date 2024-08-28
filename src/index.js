import { initialCards } from "./components/cards.js";
import { createCard, deleteCard, toggleLikeButton } from "./components/card.js";
import { handleOpenPopup } from "./components/modal.js";
import "./pages/index.css";

// глобальные переменные основной страницы
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const placesList = document.querySelector(".places__list");
const editBtn = document.querySelector(".profile__edit-button");
const addBtn = document.querySelector(".profile__add-button");

// глобальные переменные модальных окон
const popupEdit = document.querySelector(".popup_type_edit");
const popupAdd = document.querySelector(".popup_type_new-card");
const popupCard = document.querySelector(".popup_type_image");
const editProfileForm = popupEdit.querySelector('form[name="edit-profile"]');
const profileNameInput = editProfileForm.querySelector('[name="name"]');
const profileDescriptionInput = editProfileForm.querySelector(
  '[name="description"]'
);
const newPlaceForm = document.querySelector('form[name="new-place"]');
const placeNameInput = newPlaceForm.querySelector('[name="place-name"]');
const placeLinkInput = newPlaceForm.querySelector('[name="link"]');

// Выражения, чтобы самая первая анимация открытия модальных окон по клику была плавной
popupEdit.classList.add("popup_is-animated");
popupAdd.classList.add("popup_is-animated");
popupCard.classList.add("popup_is-animated");

// Функция инициализации карточек
initialCards.forEach((cardData) => {
  const cardElement = createCard(
    cardData,
    deleteCard,
    toggleLikeButton,
    openImagePopup
  );
  placesList.append(cardElement);
});

// функция изменения данных пользователя
function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  profileName.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
}

// Функция добавления новой карточки с местом
function handleNewPlaceSubmit(evt) {
  evt.preventDefault();

  const cardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value,
  };

  const cardElement = createCard(
    cardData,
    deleteCard,
    toggleLikeButton,
    openImagePopup
  );
  placesList.prepend(cardElement);

  newPlaceForm.reset();
}

// функция открытия изображения в большом окне
function openImagePopup(evt) {
  handleOpenPopup(popupCard);

  const popupImage = popupCard.querySelector("img");
  popupImage.src = evt.target.src;
  popupImage.alt = evt.target.alt;

  const popupCaption = popupCard.querySelector(".popup__caption");
  popupCaption.textContent = evt.target.alt;
}

// Обработчики кликов для открытия модальных окон
document.addEventListener("click", (evt) => {
  if (evt.target === editBtn) {
    profileNameInput.value = profileName.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    handleOpenPopup(popupEdit);
  } else if (evt.target === addBtn) {
    newPlaceForm.reset();
    handleOpenPopup(popupAdd);
  }
});

// обработчики событий для сабмитов форм
popupEdit.addEventListener("submit", handleEditProfileSubmit);
popupAdd.addEventListener("submit", handleNewPlaceSubmit);
