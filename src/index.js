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
  if (!res.ok) return Promise.reject(new Error("Ошибка загрузки карточек"));
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
  if (!res.ok)
    return Promise.reject(new Error("Ошибка загрузки данных пользователя"));
  return res.json();
});

Promise.all([cardsResponse, userResponse])
  .then(([cardsResponse, userResponse]) => {
    initialProfileInfo(userResponse);

    const initialCards = cardsResponse;
    initialCards.forEach((cardData) => {
      const cardElement = createCard(
        cardData,
        confirmDelete,
        toggleLikeButton,
        openImagePopup
      );

      checkCardOwner(cardData, userResponse, cardElement);
      placesList.append(cardElement);
      initialLikes(cardElement, cardData);
    });
  })
  .catch((error) => {
    console.error(error);
  });

// Функция управления видимостью кнопки удаления карточки в зависимости от владельца карточки
function checkCardOwner(cardData, userResponse, cardElement) {
  if (cardData.owner._id !== userResponse._id) {
    const buttonDelete = cardElement.querySelector(".card__delete-button");
    buttonDelete.remove();
  }
}

// Функция инициализации счетчиков лайков
function initialLikes(cardElement, cardData) {
  const counterLikes = cardElement.querySelector(".card__like-counter");
  counterLikes.textContent = cardData.likes.length;
}

// Функция инициализации данных пользователя
function initialProfileInfo(userResponse) {
  profileName.textContent = userResponse.name;
  profileDescription.textContent = userResponse.about;
}

// !!!to-do!!! Функции выше работают с АПИ, стоит изучить и перепестить в api.js

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

  addCardToServer(placeNameInput.value, placeLinkInput.value)
    .then((result) => {
      const cardData = {
        name: result.name,
        link: result.link,
        _id: result._id
      };

      const cardElement = createCard(
        cardData,
        confirmDelete,
        toggleLikeButton,
        openImagePopup
      );
      // cardElement.setAttribute('id', `${result._id}`)
      placesList.prepend(cardElement);
    })
    .catch((error) => {
      console.error("Ошибка при добавлении карточки:", error);
    })
    .finally(() => newPlaceForm.reset());
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

// Функция добавления новой карточки на сервер

function addCardToServer(nameCard, linkCard) {
  return fetch("https://nomoreparties.co/v1/wff-cohort-23/cards", {
    method: "POST",
    headers: {
      authorization: "7bf212db-a84d-4fa1-abc8-ff61751045bf",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${nameCard}`,
      link: `${linkCard}`,
    }),
  }).then((res) => {
    if (!res.ok) {
      return Promise.reject(new Error(`Error: ${response.statusText}`));
    }
    return res.json();
  });
}

// !!!Функция подтверждения удаления карточки
function confirmDelete(evt) {
  const popupConfirm = document.querySelector(".popup_type_delete-card");
  const buttonConfirm = popupConfirm.querySelector(
    ".popup__button_type-delete"
  );
  const currentCard = evt.target.closest(".places__item");

  handleOpenPopup(popupConfirm)
  buttonConfirm.addEventListener("click", () => {
    deleteCard(currentCard, popupConfirm);
  });
}
