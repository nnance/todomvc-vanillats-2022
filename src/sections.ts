import { addListener, createElement, toDoFilter } from "./lib.js";
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

export const main = (actions: Actions) => (filter: FilterType, toDos: ToDo[]) => {
    const main = createElement(`
        <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
        </section>
    `);

    main.appendChild(renderToDos(filter, toDos, actions.toggleCompleted));

    addListener(main, `.toggle-all`, `click`, actions.toggleAll);

    return main;
}

export const footer = (actions: Actions) => (filter: FilterType, toDos: ToDo[]) => {
    const footer = createElement(`
    <footer class="footer">
        <span class="todo-count"><strong>${toDos.filter(toDoFilter(filter)).length}</strong> item left</span>
        <ul class="filters">
            <li>
            <a class="${filter === FilterType.All ? 'selected' : ''}" id="filter-all">All</a>
            </li>
            <li>
                <a class="${filter === FilterType.Active ? 'selected' : ''}" id="filter-active">Active</a>
            </li>
            <li>
            <a class="${filter === FilterType.Completed ? 'selected' : ''}" id="filter-completed">Completed</a>
            </li>
        </ul>
        <button class="clear-completed">Clear completed</button>
    </footer>

    `);

    addListener(footer, `#filter-all`, `click`, actions.selectFilter(FilterType.All));
    addListener(footer, `#filter-active`, `click`, actions.selectFilter(FilterType.Active));
    addListener(footer, `#filter-completed`, `click`, actions.selectFilter(FilterType.Completed));

    return footer;
}