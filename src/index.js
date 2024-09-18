import { createCard, deleteCard, toggleLikeButton } from "./components/card.js";
import { handleOpenPopup } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
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

// глобальная константа с конфигом для валидации форм
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Выражения, чтобы самая первая анимация открытия модальных окон по клику была плавной
popupEdit.classList.add("popup_is-animated");
popupAdd.classList.add("popup_is-animated");
popupCard.classList.add("popup_is-animated");

// Функции инициализации карточек и данных пользователя с запросом с сервера (асинхр)
const cardsResponse = fetch("https://nomoreparties.co/v1/wff-cohort-23/cards", {
  headers: {
    authorization: "7bf212db-a84d-4fa1-abc8-ff61751045bf",
  },
}).then((res) => {
  if (!res.ok) throw new Error("Ошибка загрузки карточек");
  return res.json();
});

const userResponse = fetch(
  "https://nomoreparties.co/v1/wff-cohort-23/users/me",
  {
    headers: {
      authorization: "7bf212db-a84d-4fa1-abc8-ff61751045bf",
    },
  }
).then((res) => {
  if (!res.ok) throw new Error("Ошибка загрузки карточек");
  return res.json();
});

Promise.all([cardsResponse, userResponse])
  .then(([cardsResponse, userResponse]) => {
    initialProfileInfo(userResponse);

    const initialCards = cardsResponse;
    initialCards.forEach((cardData) => {
      const cardElement = createCard(
        cardData,
        deleteCard,
        toggleLikeButton,
        openImagePopup
      );
      placesList.append(cardElement);
    });
  })
  .catch((error) => {
    console.error(error);
  });

// Функция инициализации данных пользователя
function initialProfileInfo(userResponse) {
  profileName.textContent = userResponse.name;
  profileDescription.textContent = userResponse.about;
}

// функция изменения данных пользователя
function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  profileName.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;

  fetch("https://nomoreparties.co/v1/wff-cohort-23/users/me", {
    method: "PATCH",
    headers: {
      authorization: "7bf212db-a84d-4fa1-abc8-ff61751045bf",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${profileNameInput.value}`,
      about: `${profileDescriptionInput.value}`,
    }),
  });
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
    clearValidation(editProfileForm, validationConfig);
  } else if (evt.target === addBtn) {
    newPlaceForm.reset();
    handleOpenPopup(popupAdd);
    clearValidation(newPlaceForm, validationConfig);
  }
});

// обработчики событий для сабмитов форм
popupEdit.addEventListener("submit", handleEditProfileSubmit);
popupAdd.addEventListener("submit", handleNewPlaceSubmit);

// Инициализация валидации форм
enableValidation({
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
});

// fetch("https://nomoreparties.co/v1/wff-cohort-23/users/me", {
//   headers: {
//     authorization: "7bf212db-a84d-4fa1-abc8-ff61751045bf",
//   },
// })
// .then(res => res.json())
//   .then((result) => {
//     console.log(result);
//   });

// fetch("https://nomoreparties.co/v1/wff-cohort-23/cards", {
//   headers: {
//     authorization: "7bf212db-a84d-4fa1-abc8-ff61751045bf",
//   },
// })
//   .then((res) => res.json())
//   .then((initialCards) => {
//     initialCards.forEach((cardData) => {
//       const cardElement = createCard(
//         cardData,
//         deleteCard,
//         toggleLikeButton,
//         openImagePopup
//       );
//       placesList.append(cardElement);
//     });
//   });

// fetch('https://nomoreparties.co/v1/wff-cohort-23/users/me', {
//   method: 'PATCH',
//   headers: {
//     authorization: '7bf212db-a84d-4fa1-abc8-ff61751045bf',
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     name: 'Marie Skłodowska Curie',
//     about: 'Physicist and Chemist'
//   })
// });
