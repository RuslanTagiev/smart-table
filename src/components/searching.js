import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchFieldName) {
    // searchFieldName — это имя поля из формы (например, 'search')

    return (data, state) => {
        // 1. Извлекаем текст поиска из состояния формы
        const searchText = state?.[searchFieldName] || '';

        // 2. Настраиваем компаратор:
        // ПЕРВЫЙ аргумент searchMultipleFields — это имя ключа, который мы будем искать в объекте target.
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

        if (!data) return [];

        // 3. Создаем объект target. 
        // Библиотека переберет ключи этого объекта. Когда она найдет ключ, 
        // совпадающий с searchFieldName, сработает наше правило поиска.
        const target = {
            [searchFieldName]: searchText
        };

        // 4. Фильтруем данные
        return data.filter(item => {
            // item — исходный объект (строка таблицы), target — объект с поисковым запросом
            return compare(item, target);
        });
    };
}