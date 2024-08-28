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
  evt.target.closest(".places__item").remove();
}

// Функция лайка
function toggleLikeButton(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

export { createCard, deleteCard, toggleLikeButton };
