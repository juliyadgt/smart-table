// import { sortMap } from "../lib/sort.js"; - не нужен

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        // обработка клика по сортировке
        if (action && action.name === 'sort') {
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;

            // сбрасываю сортировку у остальных колонок
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        }

        // применяю сортировку, если она уже выбрана
        columns.forEach(column => {
            if (column.dataset.value !== 'none') {
                field = column.dataset.field;
                order = column.dataset.value;
            }
        });

        // формирую параметр сортировки
        const sort = (field && order !== 'none') // сохраним в переменную параметр сортировки в виде field:direction
            ? `${field}:${order}`
            : null;     

        // если сортировка есть, добавляю в query
        return sort
            ? Object.assign({}, query, { sort })
            : query;  
    };
}

//тут я переделала логику сортировки, убрав компаратор, теперь все с сервера

