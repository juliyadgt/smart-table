const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

//больше не использую локальные данные, а беру их из ссылки

export function initData(sourceData) {
    // кеширую данные
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    // преобразование строк после запроса в нужный вид
    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    // получаю индексы, тут промис
    const getIndexes = async () => {
        if (!sellers || !customers) { // условие
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),   // запрашиваю продавцов
                fetch(`${BASE_URL}/customers`).then(res => res.json()), // запрашиваю покупателей
            ]);
        }

        return { sellers, customers };
    };

    // получаю данные о продажах с сервера
    const getRecords = async (query, isUpdated = false) => {
        const qs = new URLSearchParams(query); // преобразуем объект параметров в SearchParams объект, представляющий query часть url
        const nextQuery = qs.toString();       // привожу к строке

        if (lastQuery === nextQuery && !isUpdated) { // isUpdated параметр нужен, чтобы иметь возможность делать запрос без кеша
            return lastResult;  // если параметры запроса не поменялись, то отдаём сохранённые ранее данные
        }

        // если прошлый квери не был ранее установлен или поменялись параметры, то запрашиваем данные с сервера
        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        lastQuery = nextQuery;  // сохраняем для следующих запросов
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords
    };
}