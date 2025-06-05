
const API_URL = "https://muinmyha25.github.io/telegram-web-app-demo";  // заменить на свой URL

document.addEventListener("DOMContentLoaded", async () => {
  const yearPicker = document.getElementById("yearPicker");
  const totalEarnings = document.getElementById("totalEarnings");
  const totalExpenses = document.getElementById("totalExpenses");

  let telegramId = null;

  // Проверяем, доступен ли Telegram WebApp API
  if (window.Telegram && window.Telegram.WebApp) {
    const webApp = window.Telegram.WebApp;
    webApp.ready();

    const user = webApp.initDataUnsafe?.user;
    if (user && user.id) {
      telegramId = user.id;
      console.log("Telegram ID:", telegramId);
    } else {
      alert("Ошибка: не удалось получить Telegram ID");
    }
  } else {
    alert("Веб-приложение запущено не в Telegram");
  }

  // Загрузка данных
  async function loadStats() {
    try {
      const response = await fetch(`${API_URL}/api/stats?telegram_id=${telegramId}`);
      const data = await response.json();
      totalEarnings.textContent = `${data.totalEarnings} ₽`;
      totalExpenses.textContent = `${data.totalExpenses} ₽`;
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
      totalEarnings.textContent = "Ошибка";
      totalExpenses.textContent = "Ошибка";
    }
  }

  // Отправка формы
  document.getElementById("recordForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const income = document.querySelector("[name=income]").value || 0;
    const expense = document.querySelector("[name=expense]").value || 0;
    const note = document.querySelector("[name=note]").value;

    try {
      const response = await fetch(`${API_URL}/api/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ income, expense, note, telegram_id: telegramId })
      });

      if (response.ok) {
        alert("Запись успешно сохранена!");
        loadStats(); // Обновляем статистику
        document.getElementById("recordForm").reset();
      } else {
        alert("Ошибка сохранения");
      }
    } catch (err) {
      console.error("Ошибка отправки:", err);
      alert("Не удалось отправить данные");
    }
  });

  // Генерация списка годов
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    yearPicker.appendChild(option);
  }

  yearPicker.value = currentYear;

  // Загружаем статистику при запуске
  await loadStats();
});
