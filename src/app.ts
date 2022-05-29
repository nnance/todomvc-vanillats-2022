import { containerView } from "./views.js";
import { createStorage, Persistance } from "./store.js"
import { AppState, Action, ActionTypes, Dispatcher, FilterType, ToDo } from "./types.js"
import { reducer } from "./reducer.js";

//TODO - add tests

const storageKey = 'todomvc-typescript-2002';

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

const storage: Persistance = {
    getItem: () => localStorage.getItem(storageKey),
    setItem: (value: string) => localStorage.setItem(storageKey, value)
}
const store = createStorage(reducer, storage, { toDos: [], filter: FilterType.All });

store.subscribe({
    next: (value: AppState) => renderApp(store.dispatch, value)
});
