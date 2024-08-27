const initialCards = [
  {
    name: "Архыз",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
  },
  {
    name: "Челябинская область",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
  },
  {
    name: "Иваново",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
  },
  {
    name: "Камчатка",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
  },
  {
    name: "Холмогорский район",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
  },
  {
    name: "Байкал",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
  },
];

// Функция создания карточки
const createCard = (
  cardData,
  deleteCard,
  addLikeForCard,
  openImageFromCard
) => {
  const template = document.querySelector("#card-template").content;
  const cardItem = template.querySelector(".places__item").cloneNode("true");
  cardItem.querySelector(".card__image").src = `${cardData.link}`;
  cardItem.querySelector(".card__title").textContent = `${cardData.name}`;

  const buttonDelete = cardItem.querySelector(".card__delete-button");
  buttonDelete.addEventListener("click", () => deleteCard(buttonDelete));
  addLikeForCard(cardItem);
  openImageFromCard(cardItem);

  return cardItem;
};

// Функция удаления карточки
function deleteCard(buttonDelete) {
  buttonDelete.closest(".places__item").remove();
}

// Функция лайка
function addLikeForCard(cardItem) {
  const likeBtn = cardItem.querySelector(".card__like-button");
  likeBtn.addEventListener("click", (evt) => {
    likeBtn.classList.toggle("card__like-button_is-active");
  });
}

export { initialCards, createCard, deleteCard, addLikeForCard };
