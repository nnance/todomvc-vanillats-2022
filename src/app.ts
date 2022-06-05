import { containerView } from "./views.js";
import { createStorage, Persistance } from "./store.js"
import { AppState, Action, ActionTypes, Dispatcher, FilterType, ToDo } from "./types.js"
import { reducer } from "./reducer.js";
import { applyPatches, diff } from "./lib.js";

// TODO - create diff between changes and use a patch method to change the dom
// TODO - move all library code to a separate file

const storageKey = 'todomvc-typescript-2002';

export const renderApp = (app: HTMLElement, dispatch: Dispatcher<Action<ActionTypes>>) => {
    const renderer = containerView(dispatch);

    return (state: AppState) => {
        const container = renderer(state);
        applyPatches(diff(app, app.firstElementChild, container));
    }
}

const storage: Persistance = {
    getItem: () => localStorage.getItem(storageKey),
    setItem: (value: string) => localStorage.setItem(storageKey, value)
}

const app = document.querySelector('.todoapp') as HTMLElement;

if (app) {
    const store = createStorage(reducer, storage, { toDos: [], filter: FilterType.All });
    const renderer = renderApp(app, store.dispatch);

    store.subscribe({
        next: (value: AppState) => renderer(value)
    });
}