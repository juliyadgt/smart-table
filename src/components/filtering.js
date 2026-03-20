import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compareFn = createComparison([
    'skipNonExistentSourceFields',
    'skipEmptyTargetValues',
    'caseInsensitiveStringIncludes'
]);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
        .forEach((elementName) => {                           // Перебираем по именам
            elements[elementName].append(                       // в каждый элемент добавляем опции
                ...Object.values(indexes[elementName])          // формируем массив имён, значений опций
                    .map(name => {
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        return option;
                    })
            )
        })

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;                 // какое поле очищаем
            const parent = action.closest('[data-filter]');     // контейнер фильтра
            const input = parent.querySelector(`[name="${field}"]`);

            if (input) input.value = '';                        // очистить DOM
            state[field] = '';                                  // очистить state
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        const filtered = data.filter(item => compareFn(item, state));
        return filtered;
    }
}