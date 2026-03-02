import { rules, createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — Заполнение выпадающих списков (Sellers)
    Object.keys(indexes).forEach((elementName) => {
        if (elements[elementName]) {
            // Очищаем список перед заполнением (оставляем только первый пустой option)
            elements[elementName].innerHTML = '<option value="">All</option>';
            
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option;
                })
            );
        }
    });

    return (data, state, action) => {
        // @todo: #4.2 — Очистка полей (кнопка clear)
        if (action?.dataset?.name === 'clear') {
            const fieldName = action.dataset.field; // например, 'searchByDate'
            const parent = action.parentElement;
            const input = parent.querySelector('input') || parent.querySelector('select');
            
            if (input) {
                input.value = ''; // сброс визуально
                state[fieldName] = ''; // сброс в стейте
            }
        }

        // @todo: #4.3 — Настройка компаратора
        // Используем стандартный набор правил, как сказано в задании
        const compare = createComparison(defaultRules);

        if (!data) return [];

        // @todo: #4.5 — Применение фильтрации
        // Сравниваем строку (row) с объектом фильтров (state)
        return data.filter(row => compare(row, state));
    };
}