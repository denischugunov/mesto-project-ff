// Функция создания карточки
const createCard = (cardData, deleteCard, toggleLikeButton, openImagePopup) => {
  const template = document.querySelector("#card-template").content;
  const cardElement = template.querySelector(".places__item").cloneNode("true");
  const imageElement = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  imageElement.src = `${cardData.link}`;
  imageElement.alt = `${cardData.name}`;
  cardElement.querySelector(".card__title").textContent = `${cardData.name}`;

  imageElement.addEventListener("click", openImagePopup);
  deleteButton.addEventListener("click", deleteCard);
  likeButton.addEventListener("click", toggleLikeButton);

  return cardElement;
};

// Функция удаления карточки
function deleteCard(evt) {
  const currentCard = evt.target.closest(".places__item");
  removeCardFromServer(currentCard.id)
    .then(() => currentCard.remove())
    .catch((err) => console.error("Ошибка при удалении карточки:", err));
}

// !!!!! Функция удаления карточки с сервера
function removeCardFromServer(cardId) {
  return fetch(`https://nomoreparties.co/v1/wff-cohort-23/cards/${cardId}`, {
    method: "DELETE",
    headers: {
      authorization: "7bf212db-a84d-4fa1-abc8-ff61751045bf",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok)
      return Promise.reject(
        new Error(`Не удалось удалить карточку: ${res.statusText}`)
      );
  });
}

// Функция лайка
function toggleLikeButton(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

export { createCard, deleteCard, toggleLikeButton };
