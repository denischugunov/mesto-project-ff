import { createCard, deleteCard, toggleLikeButton } from "./components/card.js";
import { handleOpenPopup, closePopup } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  fetchInitialCards,
  fetchUserData,
  updateUserData,
  createCardData,
  updateUserAvatar,
} from "./components/api.js";

import "./pages/index.css";

// глобальные переменные основной страницы
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const placesList = document.querySelector(".places__list");
const editBtn = document.querySelector(".profile__edit-button");
const addBtn = document.querySelector(".profile__add-button");
const avatarProfile = document.querySelector(".profile__image");

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
const popupEditAvatar = document.querySelector(".popup_type_edit-avatar");
const newAvatarForm = document.querySelector('form[name="new-avatar"]');
const linkAvatarInput = document.querySelector('[name="link-avatar"]');
const popupConfirm = document.querySelector(".popup_type_delete-card");
const buttonConfirm = popupConfirm.querySelector(".popup__button_type-delete");

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
popupConfirm.classList.add("popup_is-animated");
popupEditAvatar.classList.add("popup_is-animated");

// ******** -----Функции для правильной инициализации страницы----- ********

// Функция инициализации данных при загрузке страницы
const initializeData = async () => {
  try {
    const [cardsResponse, userResponse] = await Promise.all([
      fetchInitialCards(),
      fetchUserData(),
    ]);

    initialProfileInfo(userResponse);

    cardsResponse.forEach((cardData) => {
      const cardElement = createCard(
        cardData,
        confirmDelete,
        toggleLikeButton,
        openImagePopup
      );

      checkCardOwner(cardData, userResponse, cardElement);
      placesList.append(cardElement);
      initialLikes(cardElement, cardData);
      initialLikesButtonState(cardElement, cardData, userResponse);
    });
  } catch (error) {
    console.error(error);
  }
};

// Вызов функции инициализации данных при загрузке страницы
initializeData();

// Функция для управления видимостью кнопки удаления карточки в зависимости от того,
// является ли текущий пользователь владельцем карточки при инициализации
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

// Функция инициализации состояния кнопок лайков
function initialLikesButtonState(cardElement, cardData, userResponse) {
  const likeButton = cardElement.querySelector(".card__like-button");
  const userLiked = cardData.likes.some(
    (users) => users.name === userResponse.name
  );

  if (userLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }
}

// Функция инициализации данных пользователя
function initialProfileInfo(userResponse) {
  profileName.textContent = userResponse.name;
  profileDescription.textContent = userResponse.about;
  avatarProfile.style.backgroundImage = `url("${userResponse.avatar}")`;
}

// Вызов функции инициализации валидации форм
enableValidation(validationConfig);

// ******** ------------------------------------------------------- ********

// функция открытия изображения в большом окне
function openImagePopup(evt) {
  handleOpenPopup(popupCard);

  const popupImage = popupCard.querySelector("img");
  popupImage.src = evt.target.src;
  popupImage.alt = evt.target.alt;

  const popupCaption = popupCard.querySelector(".popup__caption");
  popupCaption.textContent = evt.target.alt;
}

// Функция обработчика кликов для открытия модальных окон
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
  } else if (evt.target === avatarProfile) {
    newAvatarForm.reset();
    handleOpenPopup(popupEditAvatar);
    clearValidation(newAvatarForm, validationConfig);
  }
});

// Функция обработчика клика по аватарке
avatarProfile.addEventListener("click", () => {
  handleOpenPopup(popupEditAvatar);
});

// Функции обработчиков событий для сабмитов форм
popupEdit.addEventListener("submit", handleEditProfileSubmit);
popupAdd.addEventListener("submit", handleNewPlaceSubmit);
popupEditAvatar.addEventListener("submit", handleNewAvatarSubmit);

// ******** ------ функции, требующие обработки данных на сервере ------ ********

// Функция обработки отправки формы: показывает индикатор загрузки,
// вызывает callback для работы с сервером и обрабатывает ошибки.
async function handleSubmit(evt, callback) {
  evt.preventDefault();
  const activeButton = evt.target.querySelector(".popup__button");
  const oldText = activeButton.textContent;
  renderLoading(true, activeButton, oldText);

  try {
    await callback();
  } catch (error) {
    console.error("Ошибка:", error.message);
  } finally {
    renderLoading(false, activeButton, oldText);
  }
}

// Функция рендеринга загрузки
function renderLoading(isLoading, button, oldText) {
  button.textContent = isLoading ? "Сохранение..." : oldText;
}

// Функция добавления новой карточки с местом на странице
async function handleNewPlaceSubmit(evt) {
  await handleSubmit(evt, async () => {
    const data = await addCardToServer(
      placeNameInput.value,
      placeLinkInput.value
    );

    const cardData = {
      name: data.name,
      link: data.link,
      _id: data._id,
    };

    const cardElement = createCard(
      cardData,
      confirmDelete,
      toggleLikeButton,
      openImagePopup
    );

    placesList.prepend(cardElement);
    newPlaceForm.reset();
    closePopup(popupAdd);
  });
}

// Функция добавления новой карточки на сервер
async function addCardToServer(nameCard, linkCard) {
  const cardData = {
    name: nameCard,
    link: linkCard,
  };
  try {
    const data = await createCardData(cardData);
    return data;
  } catch (error) {
    console.error("Ошибка добавления карточки:", error.message);
  }
}

// Функция обновления аватарки пользователя на странице
async function handleNewAvatarSubmit(evt) {
  await handleSubmit(evt, async () => {
    const linkAvatar = linkAvatarInput.value;
    const result = await addAvatarToServer(linkAvatar);
    avatarProfile.style.backgroundImage = `url("${result.avatar}")`;
    closePopup(popupEditAvatar);
    linkAvatarInput.value = "";
  });
}

// Функция добавления новой аватарки на сервер
async function addAvatarToServer(linkAvatar) {
  const avatarData = {
    avatar: linkAvatar,
  };
  try {
    const data = await updateUserAvatar(avatarData);
    return data;
  } catch (error) {
    console.error("Ошибка обновления аватара:", error.message);
  }
}

// Функция обновления информации профиля (рендер)
function updateProfileInfo(data) {
  profileName.textContent = data.name;
  profileDescription.textContent = data.about;
}

// функция изменения данных пользователя на странице
async function handleEditProfileSubmit(evt) {
  await handleSubmit(evt, async () => {
    const userData = getUserDataFromInputs();
    const data = await updateUserData(userData);
    updateProfileInfo(data);
    closePopup(popupEdit);
  });
}

// Функция для извлечения данных о пользователе из полей ввода
function getUserDataFromInputs() {
  return {
    name: profileNameInput.value,
    about: profileDescriptionInput.value,
  };
}

// Глобальная переменная с активной карточкой, которую нужно удалить
let currentCard;

// Функция открытия попапа для подтверждения удаления карточки (выносит в глобальную переменную активную карточку)
function confirmDelete(evt) {
  currentCard = evt.target.closest(".places__item");

  handleOpenPopup(popupConfirm);

  buttonConfirm.removeEventListener("click", handleClick);
  buttonConfirm.addEventListener("click", handleClick);
}

// Функция удаления карточки по клику на кнопку подтверждения удаления
const handleClick = async (e) => {
  const activeButton = e.target;
  const oldText = activeButton.textContent;
  renderLoading(true, activeButton, oldText);

  try {
    await deleteCard(currentCard);
    closePopup(popupConfirm);
  } catch (error) {
    console.error("Ошибка при удалении карточки:", error);
  } finally {
    renderLoading(false, activeButton, oldText);
    closePopup(popupConfirm);
  }
};

// ******** ------------------------------------------------------- ********