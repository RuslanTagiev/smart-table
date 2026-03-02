import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    return (data, state) => {
        if (!Array.isArray(data)) return [];
        
        const searchText = state?.[searchField];

        // Если поиска нет — возвращаем данные как есть
        if (!searchText || String(searchText).trim() === "") {
            return data;
        }

        const compare = createComparison(
            ['skipEmptyTargetValues'], 
            [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
        );

        const target = { [searchField]: searchText };
        return data.filter(item => compare(item, target));
    };
}