export function initFiltering(elements) {

    // Заполняю список полями с сервера
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map(name => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    return el;
                })
            );
        });
    };

    // Формирую фильтрацию для запроса на сервер
    const applyFiltering = (query, state, action) => {

        // обработка очистки поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const parent = action.closest('[data-name="filter"]');
            const input = parent.querySelector(`[name="${field}"]`);
            if (input) input.value = '';
        }

        // формирую объект из элементов фильтра
        const filter = {};

        Object.keys(elements).forEach(key => {
            const el = elements[key];

            if (!el) return;

            // ищу поле с непустым значением
            if (['INPUT', 'SELECT'].includes(el.tagName) && el.value) {
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        // обработка, если фильтр пуст
        if (!Object.keys(filter).length) {
            return query;
        }

        // добавляю параметры фильтрации
        return Object.assign({}, query, filter);
    };

    return {
        updateIndexes,
        applyFiltering
    };
}


