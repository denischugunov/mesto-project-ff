import {
  sendDeleteCardRequest,
  sendLikeDeletionData,
  sendLikePutData,
} from "./api.js";

// Функция создания карточки
const createCard = (
  cardData,
  confirmDelete,
  toggleLikeButton,
  openImagePopup
) => {
  const template = document.querySelector("#card-template").content;
  const cardElement = template.querySelector(".places__item").cloneNode("true");
  const imageElement = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  imageElement.src = `${cardData.link}`;
  imageElement.alt = `${cardData.name}`;

  cardElement.setAttribute("id", `${cardData._id}`);
  cardElement.querySelector(".card__title").textContent = `${cardData.name}`;

  imageElement.addEventListener("click", openImagePopup);
  deleteButton.addEventListener("click", confirmDelete);
  likeButton.addEventListener("click", toggleLikeButton);

  return cardElement;
};

// Функция удаления карточки
async function deleteCard(currentCard) {
  try {
    await sendDeleteCardRequest(currentCard.id);
    currentCard.remove();
    return true;
  } catch (err) {
    console.error("Ошибка при удалении карточки:", err);
    throw new Error("Ошибка при удалении карточки: " + err.message);
  }
}

// Функция лайка (рендер иконки лайка + вызов функции отправки на сервер)
async function toggleLikeButton(evt) {
  const currentLikeButton = evt.target;
  const checkSuccess = await sendLikeStatus(currentLikeButton);
  if (checkSuccess) {
    currentLikeButton.classList.toggle("card__like-button_is-active");
  }
}

// Функция отправки данных о лайке на сервер
async function sendLikeStatus(currentLikeButton) {
  const currentCard = currentLikeButton.closest(".card");
  try {
    if (currentLikeButton.classList.contains("card__like-button_is-active")) {
      const cardData = await sendLikeDeletionData(currentCard.id);
      renderLikeCounter(cardData, currentCard);
      return true;
    } else {
      const cardData = await sendLikePutData(currentCard.id);
      renderLikeCounter(cardData, currentCard);
      return true;
    }
  } catch (error) {
    return false;
    console.error("Ошибка при обновлении статуса лайка:", error);
  }
}

// Функция рендера счетчика лайков
function renderLikeCounter(cardData, currentCard) {
  const likeCount = cardData.likes.length;
  const counterLikes = currentCard.querySelector(".card__like-counter");
  counterLikes.textContent = likeCount;
}

export { createCard, deleteCard, toggleLikeButton };
