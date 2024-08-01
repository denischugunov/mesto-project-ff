// @todo: Темплейт карточки

const template = document.querySelector("#card-template").content; // занес в переменную темплейт

// @todo: DOM узлы

const placesList = document.querySelector(".places__list"); // занес в переменную узел для добавления карточек

// @todo: Функция создания карточки

const createCard = (initialCards, deleteCard) => {
  initialCards.forEach((initialCard) => {
    // начинаю перебор массива
    const cardItem = template.querySelector(".places__item").cloneNode("true"); // клонировал содержимое темплейта в переменную для карточки
    cardItem.querySelector(".card__image").src = `${initialCard.link}`; // добавил ссылку на изображения для карточки
    cardItem.querySelector(".card__title").textContent = `${initialCard.name}`; // добавил название для карточки

    const buttonDelete = cardItem.querySelector(".card__delete-button"); // занес в переменную кнопку удаления карточки
    buttonDelete.addEventListener("click", () => deleteCard(buttonDelete)); // поставил слушатель событий на кнопку удаления карточки

    placesList.append(cardItem); // добавил карточку в узел html
  });
};

// @todo: Функция удаления карточки

const deleteCard = (buttonDelete) => {
  buttonDelete.closest(".places__item").remove(); // нахожу и удаляю ближайшую карточку внутри которой лежит кнопка
};

// @todo: Вывести карточки на страницу

createCard(initialCards, deleteCard); // вызываю функцию создания карточки
