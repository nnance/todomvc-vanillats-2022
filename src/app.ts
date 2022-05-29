import { containerView } from "./views.js";
import { createStorage } from "./store.js"
import { AppState, Action, ActionTypes, Dispatcher, FilterType, ToDo } from "./types.js"
import { reducer } from "./reducer.js";

//TODO - add tests

const renderApp = (dispatch: Dispatcher<Action<ActionTypes>>, state: AppState) => {
	// Your starting point. Enjoy the ride!
    const app = document.querySelector('.todoapp') as HTMLElement;

    const container = containerView(dispatch)(state);
    const existingContainer = app.querySelector(container.nodeName) as HTMLElement;

    if (existingContainer) {
        app.replaceChild(container, existingContainer);
    } else {
        app.appendChild(container);
    }
}

const store = createStorage(reducer, 'todomvc-typescript-2002', { toDos: [], filter: FilterType.All });

store.subscribe({
    next: (value: AppState) => renderApp(store.dispatch, value)
});
