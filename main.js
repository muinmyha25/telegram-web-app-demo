
// Укажи URL своего сервера (ngrok, VPS, Render и т.д.)
const API_URL = "https://abcd1234.ngrok.io";  // замени на свой ngrok-URL

document.addEventListener("DOMContentLoaded", () => {
    let telegramId = null;

    // Проверяем, доступен ли Telegram WebApp API
    if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.ready(); // Обязательно вызываем ready()

        const user = webApp.initDataUnsafe?.user;
        if (user && user.id) {
            telegramId = user.id;
            console.log("Telegram ID успешно получен:", telegramId);
        } else {
            console.warn("Telegram ID не найден в initDataUnsafe");
            alert("Ошибка: не удалось получить Telegram ID");
        }
    } else {
        console.warn("Telegram WebApp API недоступен");
        alert("Приложение запущено не в Telegram");
    }

    // === Функция загрузки статистики ===
    async function loadStats() {
        if (!telegramId) return;

        try {
            const response = await fetch(`${API_URL}/api/stats?telegram_id=${telegramId}`);
            const data = await response.json();

            document.getElementById("totalEarnings").textContent = `${data.totalEarnings || 0} ₽`;
            document.getElementById("totalExpenses").textContent = `${data.totalExpenses || 0} ₽`;
        } catch (err) {
            console.error("Ошибка загрузки данных:", err);
            alert("Не удалось загрузить данные");
        }
    }

    // === Обработка формы добавления записи ===
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
            console.error("Ошибка отправки данных:", err);
            alert("Не удалось отправить данные");
        }
    });

    // === Генерация списка годов (пока не используется, но скоро пригодится) ===
    const yearPicker = document.getElementById("yearPicker");
    const currentYear = new Date().getFullYear();

    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearPicker.appendChild(option);
    }

    yearPicker.value = currentYear;

    // === Загрузка данных при старте ===
    if (telegramId) {
        loadStats();
    }
});
