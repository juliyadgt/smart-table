import './fonts/ys-display/fonts.css'
import './style.css'
// import { data as sourceData } from "./data/dataset_1.js"; - больше не нужен
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initTable } from "./components/table.js";

import { initSearching } from "./components/searching.js";
import { initFiltering } from "./components/filtering.js";
import { initSorting } from "./components/sorting.js";
import { initPagination } from "./components/pagination.js";

// заменяю логику получения данных
const api = initData(sourceData);

// собираю состояние формы
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

// меняю логику работы с данными
async function render(action) {
    const state = collectState(); // состояние полей из таблицы
    let query = {}; // здесь будут формироваться параметры запроса

    // меняю старую логику запроса
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    // получаю данные с сервера
    const { total, items } = await api.getRecords(query);

    // обновляею пагинацию
    updatePagination(total, query);

    // рендерю таблицу
    sampleTable.render(items);
}

// инициализация таблицы
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: [],
    after: []
}, render);

// подключение компонентов
const applySearching = initSearching('search'); //поиск

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements); //фильтрация (2 функции)

const applySorting = initSorting([  //сортировка
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const { applyPagination, updatePagination } = initPagination(   //пагинация
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

// добавляю таблицу в DOM
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// работа приложения
async function init() {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

init().then(render);


