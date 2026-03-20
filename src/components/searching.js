import { rules, createComparison } from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compareFn = createComparison(
        ['skipEmptyTargetValues'], // стандартные правила
        [
            rules.searchMultipleFields(
                searchField,
                ['date', 'customer', 'seller'],
                false
            )
        ]
    );

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        const searched = data.filter(item => compareFn(item, state));

        return searched;
    };
}