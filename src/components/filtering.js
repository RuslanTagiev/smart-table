import { rules, createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // #4.1 — Наполнение селекторов (Sellers)
    Object.keys(indexes).forEach((elementName) => {
        if (elements[elementName]) {
            elements[elementName].innerHTML = '<option value="">All</option>';
            const options = Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            });
            elements[elementName].append(...options);
        }
    });

    return (data, state, action) => {
        // #4.2 — Очистка полей (кнопка clear)
        if (action?.dataset?.name === 'clear') {
            const fieldName = action.dataset.field;
            const parent = action.parentElement;
            const input = parent.querySelector('input') || parent.querySelector('select');
            if (input) {
                input.value = '';
                state[fieldName] = '';
            }
        }

        // #4.3 — Настройка компаратора
        const compare = createComparison(defaultRules);

        if (!data) return [];

        // #4.5 — Применение фильтрации
        return data.filter(row => {
            // СОЗДАЕМ ТАРГЕТ, который понимает библиотека для числовых диапазонов
            // Правило arrayAsRange ищет ключ 'total' и ждет массив [min, max]
            const target = {
                ...state,
                total: [state.totalFrom, state.totalTo]
            };

            return compare(row, target);
        });
    };
}