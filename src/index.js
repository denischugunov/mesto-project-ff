import {
  initialCards,
  createCard,
  deleteCard,
  addLikeForCard,
} from "./components/cards.js";
import { handleOpenModule } from "./components/modal.js";
import "./pages/index.css";

// глобальные переменные основной страницы
const profileName = document.querySelector(".profile__title");
const profileDescrpt = document.querySelector(".profile__description");
const placesList = document.querySelector(".places__list");
const editBtn = document.querySelector(".profile__edit-button");
const addBtn = document.querySelector(".profile__add-button");

// глобальные переменные модальных окон
const moduleEdit = document.querySelector(".popup_type_edit");
const moduleAdd = document.querySelector(".popup_type_new-card");
const moduleCard = document.querySelector(".popup_type_image");
const formElement = moduleEdit.querySelector('form[name="edit-profile"]');
const nameInput = formElement.querySelector('[name="name"]');
const jobInput = formElement.querySelector('[name="description"]');
const newCardForm = document.querySelector('form[name="new-place"]');
const nameCard = newCardForm.querySelector('[name="place-name"]');
const linkCard = newCardForm.querySelector('[name="link"]');

// Выражения, чтобы самая первая анимация открытия модальных окон по клику была плавной
moduleEdit.classList.add("popup_is-animated");
moduleAdd.classList.add("popup_is-animated");
moduleCard.classList.add("popup_is-animated");

// Функция инициализации карточек
initialCards.forEach((cardData) => {
  const cardElement = createCard(
    cardData,
    deleteCard,
    addLikeForCard,
    openImageFromCard
  );
  placesList.append(cardElement);
});

// функция изменения данных пользователя
function handleFormSubmit(evt) {
  evt.preventDefault();

  const nameData = nameInput.value;
  const jobData = jobInput.value;

  profileName.textContent = nameData;
  profileDescrpt.textContent = jobData;
}

// Функция добавления новой карточки с местом
function handleAddCard(evt) {
  evt.preventDefault();

  const cardData = {
    name: nameCard.value,
    link: linkCard.value,
  };

  const cardElement = createCard(
    cardData,
    deleteCard,
    addLikeForCard,
    openImageFromCard
  );
  placesList.prepend(cardElement);

  newCardForm.reset();
}

// функция открытия изображения в большом окне
function openImageFromCard(cardItem) {
  const cardImage = cardItem.querySelector(".card__image");
  cardImage.addEventListener("click", (evt) => {
    const moduleCard = document.querySelector(".popup_type_image");
    handleOpenModule(moduleCard);
    const linkImage = evt.target.src;
    const imageFrame = moduleCard.querySelector("img");
    imageFrame.src = linkImage;
  });
}

// Функция слушателя кликов для открытия модальных окон
document.addEventListener("click", (evt) => {
  if (evt.target === editBtn) {
    nameInput.value = profileName.textContent;
    jobInput.value = profileDescrpt.textContent;
    handleOpenModule(moduleEdit);
    formElement.addEventListener("submit", handleFormSubmit);
  } else if (evt.target === addBtn) {
    newCardForm.reset();
    handleOpenModule(moduleAdd);
    moduleAdd.addEventListener("submit", handleAddCard);
  }
});
