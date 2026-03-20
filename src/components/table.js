import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before, after } = settings;
    /**  привычная запись верхней строки, чтобы понимать переменные
        const tableTemplate = settings.tableTemplate;
        const rowTemplate   = settings.rowTemplate;
        const before        = settings.before;
        const after         = settings.after;
    */

    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    //создаем список искомых id 
    const BfrListId = ['search', 'header', 'filter'];
    const AftListId = ['pagination'];

    // Добавляем в массив рально существующие id по которым будем работать
    BfrListId.forEach(id => {
        const template = document.getElementById(id);
        if (template) {
            before.push(id);
        }
    });

    AftListId.forEach(id => {
        const template = document.getElementById(id);
        if (template) {
            after.push(id);
        }
    });

    // Клонируем нужные шаблоны
    before.reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });


    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', function () { onAction() });
    root.container.addEventListener('reset', function () { setTimeout(function () { onAction(); }); });
    root.container.addEventListener('submit', function (e) { e.preventDefault(); onAction(e.submitter); });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    row.elements[key].textContent = item[key];
                }
            })
            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    }

    return { ...root, render };
}