import { createElement, addListener } from "./lib.js";
import { FilterType, ToDo } from "./types.js";

const renderToDo = (todo: ToDo, toggle: (todo: ToDo) => () => void) => {
    const { completed, note, id } = todo;

    const li = createElement(`
        <li ${completed ? `class="completed"` : ``}>
            <div class="view">
                <input class="toggle" type="checkbox" ${completed ? `checked` : ``} data-id="${id}">
                <label>${note}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="${id}">
        </li>
    `);

    addListener(li, `.toggle`, `click`, toggle(todo));

    return li;
}

export const renderToDos = (filter: FilterType, toDos: ToDo[], toDoToggle: (todo: ToDo) => () => void) => {

    const toDoFilter = (todo: ToDo) => {
        switch (filter) {
            case FilterType.All:
                return true;
            case FilterType.Active:
                return !todo.completed;
            case FilterType.Completed:
                return todo.completed;
            default:
                return false;
        }
    }

    const toDoElements = toDos.filter(toDoFilter).map(todo => {
        return renderToDo(todo, toDoToggle);
    });

    const ul = createElement(`
        <ul class="todo-list">
        </ul>
    `);

    toDoElements.forEach(li => ul.appendChild(li));

    return ul;
};