document.addEventListener("DOMContentLoaded", async () => {
    const yearPicker = document.getElementById("yearPicker");
    const totalEarnings = document.getElementById("totalEarnings");
    const totalExpenses = document.getElementById("totalExpenses");

    const response = await fetch('/api/stats');
    const data = await response.json();

    totalEarnings.textContent = `${data.totalEarnings} ₽`;
    totalExpenses.textContent = `${data.totalExpenses} ₽`;

    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearPicker.appendChild(option);
    }

    yearPicker.value = currentYear;
});
