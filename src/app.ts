import { footer, header, main } from "./views.js";
import { createStorage } from "./store.js"
import { AppState, Action, ActionTypes, Dispatcher, FilterType, ToDo } from "./types.js"
import { reducer } from "./reducer.js";

//TODO - add tests

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

const renderApp = (dispatch: Dispatcher<Action<ActionTypes>>, { filter, toDos }: AppState) => {
    const filterToDos = toDos.filter(toDoFilter(filter))

	// Your starting point. Enjoy the ride!
    const app = document.querySelector('.todoapp') as HTMLElement;

    if (app) {
        while (app.hasChildNodes()) {
            app.removeChild(app.lastChild!);
        }
        app.appendChild(header(dispatch)());
        app.appendChild(main(dispatch)(filterToDos));
        app.appendChild(footer(dispatch)(filter, filterToDos));
    }
}

const store = createStorage(reducer, 'todomvc-typescript-2002', { toDos: [], filter: FilterType.All });

store.subscribe({
    next: (value: AppState) => renderApp(store.dispatch, value)
});
