document.addEventListener("DOMContentLoaded", async () => {
  const yearPicker = document.getElementById("yearPicker");
  const totalEarnings = document.getElementById("totalEarnings");
  const totalExpenses = document.getElementById("totalExpenses");

  // Получаем API URL из localStorage или передайте его через window.Telegram.WebApp.initData
  const API_URL = "http://127.0.0.1:5000"; // или получите из env или WebApp

  try {
    const response = await fetch(`${API_URL}/api/stats`);
    const data = await response.json();
    totalEarnings.textContent = `${data.totalEarnings} ₽`;
    totalExpenses.textContent = `${data.totalExpenses} ₽`;
  } catch (err) {
    console.error("Ошибка загрузки статистики:", err);
    totalEarnings.textContent = "Ошибка";
    totalExpenses.textContent = "Ошибка";
  }

  // Генерация списка годов
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    yearPicker.appendChild(option);
  }

  yearPicker.value = currentYear;
});
