// @todo: Темплейт карточки

const template = document.querySelector("#card-template").content; // занес в переменную темплейт

// @todo: DOM узлы

const placesList = document.querySelector(".places__list"); // занес в переменную узел для добавления карточек

// @todo: Функция создания карточки

const createCard = (cardData, deleteCard) => {
  const cardItem = template.querySelector(".places__item").cloneNode("true"); // клонировал содержимое темплейта в переменную для карточки
  cardItem.querySelector(".card__image").src = `${cardData.link}`; // добавил ссылку на изображения для карточки
  cardItem.querySelector(".card__title").textContent = `${cardData.name}`; // добавил название для карточки

  const buttonDelete = cardItem.querySelector(".card__delete-button"); // занес в переменную кнопку удаления карточки
  buttonDelete.addEventListener("click", () => deleteCard(buttonDelete)); // поставил слушатель событий на кнопку удаления карточки

  return cardItem; // возвращаю заполненную карточку
};

// @todo: Функция удаления карточки

const deleteCard = (buttonDelete) => {
  buttonDelete.closest(".places__item").remove(); // нахожу и удаляю ближайшую карточку внутри которой лежит кнопка
};

// @todo: Вывести карточки на страницу

initialCards.forEach((cardData) => {
  // вызываю метод перебора массива для создания множества карточек
  const cardElement = createCard(cardData, deleteCard);
  placesList.append(cardElement); // добавил карточку в узел html
});
