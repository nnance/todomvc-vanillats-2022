import { Action, ActionTypes, AppState, Dispatcher, FilterType, ToDo } from "./types.js";

type DelegateHandler = (event?: Event, el?: HTMLElement) => void;
type EventDelegate = {
    event: string,
    selector: string,
    handler: DelegateHandler,
}

type Delegate = ReturnType<typeof createDelegate>;

const createElement = (html: string): HTMLElement => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild as HTMLElement;
}

export const createDelegate = () => {
    const delegates: EventDelegate[] = [];

    const addListener = (selector: string, event: string, handler: DelegateHandler) => {
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

    const removeListener = (selector: string, event: string) => {
        const index = delegates.findIndex(d => d.event === event && d.selector === selector);
        if (index > -1) {
            document.removeEventListener(event, delegates[index].handler);
            delegates.splice(index, 1);
        }
    }

    const removeAll = () => {
        delegates.forEach(d => {
            document.removeEventListener(d.event, d.handler);
        });
        delegates.splice(0, delegates.length);
    }

    return {
        addListener,
        removeListener,
        removeAll
    }
}

const renderToDo = (todo: ToDo, dispatch: Dispatcher<Action<ActionTypes>>, { addListener }: Delegate) => {
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

const renderToDos = (toDos: ToDo[], dispatch: Dispatcher<Action<ActionTypes>>, delegate: Delegate) => {
    const ul = `
        <ul class="todo-list">
            ${toDos.map(todo => renderToDo(todo, dispatch, delegate)).join('')}
        </ul>
    `;

    return ul;
};

const header = (dispatch: Dispatcher<Action<ActionTypes>>, { addListener }: Delegate) => () => {
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

const main = (dispatch: Dispatcher<Action<ActionTypes>>, delegate: Delegate) => (toDos: ToDo[]) => {
    const { addListener } = delegate;

    const main = `
        <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
            ${renderToDos(toDos, dispatch, delegate)}
        </section>
    `;

    addListener(`.toggle-all`, `click`, () => { dispatch({ type: ActionTypes.ToggleAll }); });

    return main;
}

const footer = (dispatch: Dispatcher<Action<ActionTypes>>, { addListener }: Delegate) => (filter: FilterType, toDos: ToDo[]) => {
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

export const containerView = (dispatch: Dispatcher<Action<ActionTypes>>) => {
    const delegate = createDelegate();
    const headerView = header(dispatch, delegate);
    const mainView = main(dispatch, delegate);
    const footerView = footer(dispatch, delegate);

    return ({filter, toDos}: AppState) => {
        const filterToDos = toDos.filter(toDoFilter(filter))

        return createElement(`
            <div>
                ${headerView()}
                ${mainView(filterToDos)}
                ${footerView(filter, filterToDos)}
            </div>
        `)
    }
}