import { rules, createComparison } from "../lib/compare.js";

export function initFiltering(elements, filters) {
    return (data, state) => {
        // 1. Формируем объект target для сравнения.
        // ВАЖНО: В твоих данных (source) поле называется 'total'.
        // Поэтому в target мы тоже создаем ключ 'total', объединяя 
        // значения из двух инпутов 'totalFrom' и 'totalTo' в массив.
        const target = {
            date: state.searchByDate,
            customer: state.searchByCustomer,
            seller: state.searchBySeller,
            // Массив [от, до] для работы правила arrayAsRange
            total: [state.totalFrom, state.totalTo] 
        };

        // 2. Настраиваем компаратор.
        // Добавляем 'arrayAsRange' в список имен правил.
        const compare = createComparison(
            ['skipEmptyTargetValues', 'arrayAsRange', 'stringIncludes'], 
            []
        );

        if (!data) return [];

        // 3. Фильтруем данные
        return data.filter(item => compare(item, target));
    };
}