import { rules, createComparison } from "../lib/compare.js";

export function initFiltering(elements, filters) {
    // Безопасное наполнение селектора продавцов
    // Используем опциональную цепочку ?. чтобы не упасть, если элементов еще нет
    if (elements?.searchBySeller && filters?.searchBySeller) {
        elements.searchBySeller.innerHTML = '<option value="">All Sellers</option>';
        filters.searchBySeller.forEach(seller => {
            const option = document.createElement('option');
            option.value = seller;
            option.textContent = seller;
            elements.searchBySeller.appendChild(option);
        });
    }

    return (data, state) => {
        // Если данных нет — возвращаем пустой массив
        if (!Array.isArray(data)) return [];
        // Если фильтры не заданы (первая загрузка) — возвращаем данные без изменений
        if (!state) return data;

        // Сопоставляем ключи из формы (state) с ключами в объектах данных (data)
        const target = {
            date: state.searchByDate,
            customer: state.searchByCustomer,
            seller: state.searchBySeller,
            total: [state.totalFrom, state.totalTo]
        };

        const compare = createComparison(
            ['skipEmptyTargetValues', 'arrayAsRange', 'caseInsensitiveStringIncludes'], 
            []
        );

        return data.filter(item => compare(item, target));
    };
}