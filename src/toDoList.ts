import { ToDo, ToDoStore } from "./store.js";

export const renderToDo = (todo: ToDo) => {
    const { completed, note, id } = todo;
    const li = document.createElement('li');

    if (completed) { li.classList.add('completed'); }

    li.innerHTML = `
        <li ${completed ? `class="completed"` : ``}>
            <div class="view">
                <input class="toggle" type="checkbox" ${completed ? `checked` : ``}>
                <label>${note}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="${id}">
        </li>
    `;

    return li.outerHTML;
}

export const renderToDos = (toDos: ToDo[]) => {
    return `
        <ul class="todo-list">
            ${toDos.map(renderToDo).reduce((prev, cur) => prev + cur)}
        </ul>
    `;
};