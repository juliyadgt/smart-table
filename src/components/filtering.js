import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compareFn = createComparison([
    'skipNonExistentSourceFields',
    'skipEmptyTargetValues',
    'arrayAsRange',
    'caseInsensitiveStringIncludes'
]);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)
        .forEach((elementName) => {
            elements[elementName].append(
                ...Object.values(indexes[elementName])
                    .map(name => {
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        return option;
                    })
            )
        });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const parent = action.closest('[data-filter]');
            const input = parent.querySelector(`[name="${field}"]`);

            if (input) input.value = '';
        }

        const min = state.totalFrom ? parseFloat(state.totalFrom) : 0;
        const max = state.totalTo ? parseFloat(state.totalTo) : Infinity;

        const filterState = {
            ...state,
            total: [min, max]
        };

        // @todo: #4.5 — отфильтровать данные используя компаратор
        const filtered = data.filter(item => compareFn(item, filterState));
        return filtered;
    };
}
