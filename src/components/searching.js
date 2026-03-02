import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchFieldName) {
    // Возвращаем функцию фильтрации
    return (data, state) => {
        // Защита: если данных нет, возвращаем пустой массив
        if (!Array.isArray(data)) return [];

        // 1. Безопасно достаем текст поиска из state
        const searchText = state?.[searchFieldName];

        // 2. Если текста нет (пусто или undefined) — возвращаем ВСЕ данные
        // Это критично для тестов, чтобы они увидели первые 10 строк
        if (!searchText || String(searchText).trim() === "") {
            return data;
        }

        try {
            // 3. Создаем компаратор
            const compare = createComparison(
                ['skipEmptyTargetValues'], 
                [
                    rules.searchMultipleFields(
                        searchFieldName, 
                        ['date', 'customer', 'seller'], 
                        false
                    )
                ]
            );

            // 4. Формируем объект target для библиотеки
            const target = { [searchFieldName]: searchText };

            // 5. Фильтруем
            return data.filter(item => compare(item, target));
        } catch (e) {
            // Если библиотека выдала ошибку — не ломаем приложение, 
            // а просто отдаем нефильтрованные данные
            console.error("Search failed:", e);
            return data;
        }
    };
}