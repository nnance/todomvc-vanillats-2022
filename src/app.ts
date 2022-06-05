import { containerView } from "./views.js";
import { createStore } from "./store.js"
import { AppState, Action, ActionTypes, Dispatcher, FilterType, ToDo } from "./types.js"
import { reducer } from "./reducer.js";
import { applyPatches, diff } from "./lib.js";

export const renderApp = (app: HTMLElement, dispatch: Dispatcher<Action<ActionTypes>>) => {
    const renderer = containerView(dispatch);

    return (state: AppState) => {
        const container = renderer(state);
        applyPatches(diff(app, app.firstElementChild, container));
    }
}

const app = document.querySelector('.todoapp') as HTMLElement;

if (app) {
    const store = createStore(reducer);
    const renderer = renderApp(app, store.dispatch);

    store.subscribe({
        next: (value: AppState) => renderer(value)
    });
}