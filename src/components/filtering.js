import { rules, createComparison } from "../lib/compare.js";

export function initFiltering(elements, filters) {
    // 1. Наполняем выпадающий список продавцов
    // Тесты ищут элементы внутри select[name="seller"]
    if (elements.searchBySeller && filters?.searchBySeller) {
        // Очищаем и добавляем дефолтный вариант
        elements.searchBySeller.innerHTML = '<option value="">All Sellers</option>';
        
        filters.searchBySeller.forEach(seller => {
            const option = document.createElement('option');
            option.value = seller;
            option.textContent = seller;
            elements.searchBySeller.appendChild(option);
        });
    }

    return (data, state) => {
        if (!data) return [];

        // 2. Формируем объект target. 
        // Ключи ДОЛЖНЫ совпадать с ключами в объектах данных: date, customer, seller, total.
        // Значения берем из state (они приходят из атрибутов name инпутов).
        const target = {
            date: state.searchByDate,
            customer: state.searchByCustomer,
            seller: state.searchBySeller,
            // Массив [от, до] для правила arrayAsRange
            total: [state.totalFrom, state.totalTo]
        };

        // 3. Настраиваем компаратор.
        // Добавляем 'caseInsensitiveStringIncludes' для поиска подстроки (например, "Иван" в "Иван Иванов")
        const compare = createComparison(
            ['skipEmptyTargetValues', 'arrayAsRange', 'caseInsensitiveStringIncludes'], 
            []
        );

        // 4. Применяем фильтрацию
        return data.filter(item => compare(item, target));
    };
}