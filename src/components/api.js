// Базовая конфигурация для отправки запросов на сервер
const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-23",
  headers: {
    authorization: "7bf212db-a84d-4fa1-abc8-ff61751045bf",
    "Content-Type": "application/json",
  },
};

// Функция для обработки ответа
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error("Ошибка загрузки данных");
  }
  return response.json();
};

// Функция получения данных карточек с сервера
const fetchInitialCards = async () => {
  const res = await fetch(`${config.baseUrl}/cards`, {
    method: "GET",
    headers: config.headers,
  });
  return handleResponse(res);
};

// Функция получения данных пользователя с сервера
const fetchUserData = async () => {
  const res = await fetch(`${config.baseUrl}/users/me`, {
    method: "GET",
    headers: config.headers,
  });
  return handleResponse(res);
};

// Функция отправки новых данных о пользователе на сервер
const updateUserData = async (userData) => {
  const res = await fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
};

// Функция отправки данных о новой карточке на сервер
const createCardData = async (cardData) => {
  const res = await fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify(cardData),
  });
  return handleResponse(res);
};

//Функция отправки данных о новом аватаре пользователя на сервер
const updateUserAvatar = async (avatarData) => {
  const res = await fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify(avatarData),
  });
  return handleResponse(res);
};

const checkImageHeadRequest = async (linkImage) => {
  const res = await fetch(linkImage, {
    method: "HEAD",
  });

  if (!res.ok) {
    return false;
  }

  const contentType = res.headers.get("Content-Type");
  return (
    contentType === "image/jpeg" ||
    contentType === "image/jpg" ||
    contentType === "image/png" ||
    contentType === "image/gif" ||
    contentType === "image/svg+xml" ||
    contentType === "image/webp"
  );
};

// Функция отправки данных об удалении карточки на сервер
const sendDeleteCardRequest = async (cardId) => {
  const res = await fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  });
  return handleResponse(res);
};

// Функция отправки данных об удалении лайка
const sendLikeDeletionData = async (cardId) => {
  const res = await fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  });
  return handleResponse(res);
};

// Функция отправки данных о добавлении лайка
const sendLikePutData = async (cardId) => {
  const res = await fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  });
  return handleResponse(res);
};

export {
  fetchInitialCards,
  fetchUserData,
  updateUserData,
  createCardData,
  updateUserAvatar,
  checkImageHeadRequest,
  sendDeleteCardRequest,
  sendLikeDeletionData,
  sendLikePutData,
};
