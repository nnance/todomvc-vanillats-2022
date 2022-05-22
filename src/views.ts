import { addListener, createElement, toDoFilter } from "./lib.js";
import { Action, ActionTypes, Dispatcher, FilterType, ToDo } from "./types.js";

const renderToDo = (todo: ToDo, dispatch: Dispatcher<Action<ActionTypes>>) => {
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

    addListener(li, `.toggle`, `click`, () => dispatch({ type: ActionTypes.ToggleCompleted, payload: id }));

    return li;
}

const renderToDos = (filter: FilterType, toDos: ToDo[], dispatch: Dispatcher<Action<ActionTypes>>) => {
    const toDoElements = toDos.filter(toDoFilter(filter)).map(todo => {
        return renderToDo(todo, dispatch);
    });

    const ul = createElement(`
        <ul class="todo-list">
        </ul>
    `);

    toDoElements.forEach(li => ul.appendChild(li));

    return ul;
};

export const header = (dispatch: Dispatcher<Action<ActionTypes>>) => () => {
    const header = createElement(`
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus>
        </header>
    `);

    addListener(header, `.new-todo`, `keyup`, (event?: Event) => {
        const e = event as KeyboardEvent;
        if (e && e.key === "Enter" && e.target instanceof HTMLInputElement) {
            const input = e.target as HTMLInputElement;
            if (input.value.length > 0) {
                dispatch({ type: ActionTypes.AddItem, payload: input.value });
            }
        }
    });

    return header;
}

export const main = (dispatch: Dispatcher<Action<ActionTypes>>) => (filter: FilterType, toDos: ToDo[]) => {
    const main = createElement(`
        <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
        </section>
    `);

    main.appendChild(renderToDos(filter, toDos, dispatch));

    addListener(main, `.toggle-all`, `click`, () => { dispatch({ type: ActionTypes.ToggleAll }); });

    return main;
}

export const footer = (dispatch: Dispatcher<Action<ActionTypes>>) => (filter: FilterType, toDos: ToDo[]) => {
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

    addListener(footer, `#filter-all`, `click`, () => dispatch({ type: ActionTypes.SetFilter, payload: FilterType.All }));
    addListener(footer, `#filter-active`, `click`, () => dispatch({ type: ActionTypes.SetFilter, payload: FilterType.Active }));
    addListener(footer, `#filter-completed`, `click`, () => dispatch({ type: ActionTypes.SetFilter, payload: FilterType.Completed }));

    return footer;
}