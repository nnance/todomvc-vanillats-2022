import { Action, ActionTypes, Dispatcher, FilterType, ToDo } from "./types.js";

type DelegateHandler = (event?: Event, el?: HTMLElement) => void;

const createElement = (html: string): HTMLElement => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild as HTMLElement;
}

const createDelegate = () => {
    type EventDelegate = {
        event: string,
        selector: string,
        handler: DelegateHandler,
    }

    const delegates: EventDelegate[] = [];

    return (selector: string, event: string, handler: DelegateHandler) => {
        const delegate = delegates.find(d => d.event === event && d.selector === selector);

        if (!delegate) {
            delegates.push({ event, selector, handler });
            document.addEventListener(event, e => {
                if (e.target instanceof HTMLElement) {
                    delegates
                        .filter(d => d.event === event && (e.target as HTMLElement).matches(d.selector))
                        .forEach(({handler}) => handler(e, e.target as HTMLElement));
                }
            });
        }
    }
}

const addListener = createDelegate();

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

    return li;
}

const renderToDos = (toDos: ToDo[], dispatch: Dispatcher<Action<ActionTypes>>) => {
    const ul = createElement(`
        <ul class="todo-list">
        </ul>
    `);

    toDos.map(todo => renderToDo(todo, dispatch)).forEach(li => ul.appendChild(li));

    addListener(`.toggle`, `click`, (e, el) => {
        dispatch({ type: ActionTypes.ToggleCompleted, payload: parseInt(el!.dataset.id!) });
    });

    return ul;
};

export const header = (dispatch: Dispatcher<Action<ActionTypes>>) => () => {
    const header = createElement(`
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus>
        </header>
    `);

    addListener(`.new-todo`, `keyup`, (event?: Event) => {
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

export const main = (dispatch: Dispatcher<Action<ActionTypes>>) => (toDos: ToDo[]) => {
    const main = createElement(`
        <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
        </section>
    `);

    main.appendChild(renderToDos(toDos, dispatch));

    addListener(`.toggle-all`, `click`, () => { dispatch({ type: ActionTypes.ToggleAll }); });

    return main;
}

export const footer = (dispatch: Dispatcher<Action<ActionTypes>>) => (filter: FilterType, toDos: ToDo[]) => {
    const footer = createElement(`
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

    `);

    addListener(`#filter-all`, `click`, () => dispatch({ type: ActionTypes.SetFilter, payload: FilterType.All }));
    addListener(`#filter-active`, `click`, () => dispatch({ type: ActionTypes.SetFilter, payload: FilterType.Active }));
    addListener(`#filter-completed`, `click`, () => dispatch({ type: ActionTypes.SetFilter, payload: FilterType.Completed }));

    return footer;
}