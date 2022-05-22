import { addListener, createElement } from "./lib.js";
import { renderToDos } from "./toDoList.js";
import { Actions, FilterType, ToDo } from "./types.js";

export const header = (actions: Actions) => (toDos: ToDo[]) => {
    const header = createElement(`
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus>
        </header>
    `);

    addListener(header, `.new-todo`, `keyup`, actions.addItem);

    return header;
}

export const main = (actions: Actions) => (toDos: ToDo[]) => {
    const main = createElement(`
        <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
        </section>
    `);

    main.appendChild(renderToDos(toDos, actions.toggleCompleted));

    addListener(main, `.toggle-all`, `click`, actions.toggleAll);

    return main;
}

export const footer = (actions: Actions) => (filter: FilterType, toDos: ToDo[]) => {
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

    const footer = createElement(`
    <footer class="footer">
        <span class="todo-count"><strong>${toDos.filter(toDoFilter).length}</strong> item left</span>
        <ul class="filters">
            <li>
                <a class="selected" href="#/">All</a>
            </li>
            <li>
                <a href="#/active">Active</a>
            </li>
            <li>
                <a href="#/completed">Completed</a>
            </li>
        </ul>
        <button class="clear-completed">Clear completed</button>
    </footer>

    `);

    return footer;
}