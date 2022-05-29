import { Action, ActionTypes, AppState, Dispatcher, FilterType, ToDo } from "./types.js";

type DelegateHandler = (event?: Event, el?: HTMLElement) => void;
type EventDelegate = {
    event: string,
    selector: string,
    handler: DelegateHandler,
}

const createElement = (html: string): HTMLElement => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild as HTMLElement;
}

const createDelegate = () => {
    const delegates: EventDelegate[] = [];

    return (selector: string, event: string, handler: DelegateHandler) => {
        // add listener for first event delegate
        if (!delegates.find(d => d.event === event)) {
            document.addEventListener(event, e => {
                delegates
                    .filter(d => (e.target as HTMLElement).matches(d.selector))
                    .forEach(d => d.handler(e, e.target as HTMLElement));
            });
        } 
        // add delegate for selector
        if (!delegates.find(d => d.event === event && d.selector === selector)) {
            delegates.push({ event, selector, handler });
        }
    }
}

const addListener = createDelegate();

const renderToDo = (todo: ToDo, dispatch: Dispatcher<Action<ActionTypes>>) => {
    const { completed, note, id } = todo;

    const li = `
        <li ${completed ? `class="completed"` : ``}>
            <div class="view">
                <input class="toggle" type="checkbox" ${completed ? `checked` : ``} data-id="${id}">
                <label>${note}</label>
                <button class="destroy" data-id="${id}"></button>
            </div>
            <input class="edit" value="${id}">
        </li>
    `;

    addListener(`.toggle`, `click`, (e, el) => dispatch({
        type: ActionTypes.ToggleCompleted,
        payload: parseInt(el!.dataset.id!)
    }));

    addListener('.destroy', 'click', (e, el) => dispatch({
        type: ActionTypes.DestroyItem,
        payload: parseInt(el!.dataset.id!)
    }));

    return li;
}

const renderToDos = (toDos: ToDo[], dispatch: Dispatcher<Action<ActionTypes>>) => {
    const ul = `
        <ul class="todo-list">
            ${toDos.map(todo => renderToDo(todo, dispatch)).join('')}
        </ul>
    `;

    return ul;
};

const header = (dispatch: Dispatcher<Action<ActionTypes>>) => () => {
    const header = `
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus>
        </header>
    `;

    addListener(`.new-todo`, `keyup`, (event, el) => {
        const e = event as KeyboardEvent;
        if (e && e.key === "Enter" && el instanceof HTMLInputElement) {
            const input = el as HTMLInputElement;
            if (input.value.length > 0) {
                dispatch({ type: ActionTypes.AddItem, payload: input.value });
            }
        }
    });

    return header;
}

const main = (dispatch: Dispatcher<Action<ActionTypes>>) => (toDos: ToDo[]) => {
    const main = `
        <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
            ${renderToDos(toDos, dispatch)}
        </section>
    `;

    // main.appendChild(renderToDos(toDos, dispatch));

    addListener(`.toggle-all`, `click`, () => { dispatch({ type: ActionTypes.ToggleAll }); });

    return main;
}

const footer = (dispatch: Dispatcher<Action<ActionTypes>>) => (filter: FilterType, toDos: ToDo[]) => {
    const footer = `
    <footer class="footer">
        <span class="todo-count"><strong>${toDos.length}</strong> item left</span>
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
    `;

    addListener(`#filter-all`, `click`, () => dispatch({ type: ActionTypes.SetFilter, payload: FilterType.All }));
    addListener(`#filter-active`, `click`, () => dispatch({ type: ActionTypes.SetFilter, payload: FilterType.Active }));
    addListener(`#filter-completed`, `click`, () => dispatch({ type: ActionTypes.SetFilter, payload: FilterType.Completed }));

    return footer;
}

const toDoFilter = (filter: FilterType) => (todo: ToDo) => {
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

export const containerView = (dispatch: Dispatcher<Action<ActionTypes>>) => ({filter, toDos}: AppState) => {
    const filterToDos = toDos.filter(toDoFilter(filter))

    return createElement(`
        <div>
            ${header(dispatch)()}
            ${main(dispatch)(filterToDos)}
            ${footer(dispatch)(filter, filterToDos)}
        </div>
    `)
}