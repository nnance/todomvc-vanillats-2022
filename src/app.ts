import { footer, header, main } from "./views.js";
import { createStorage } from "./store.js"
import { AppState, Action, ActionTypes, Dispatcher, FilterType } from "./types.js"

//TODO - add tests

const reducer = (state: AppState, action: Action<ActionTypes>): AppState => {
    switch (action.type) {
        case ActionTypes.ToggleAll:
            return { ...state, toDos: state.toDos.map(t => ({ ...t, completed: true })) }
        case ActionTypes.ToggleCompleted:
            return { ...state, toDos: state.toDos.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t) }
        case ActionTypes.AddItem:
            return { ...state, toDos: [...state.toDos, { id: Date.now(), completed: false, note: action.payload }] }
        case ActionTypes.DestroyItem:
            return { ...state, toDos: (state.toDos.filter(t => t.id !== action.payload)) }
        case ActionTypes.SetFilter:
            return { ...state, filter: action.payload }
        default:
            return state;
    }
}

const store = createStorage(reducer, 'todomvc-typescript-2002', { toDos: [], filter: FilterType.All });

const renderApp = (dispatch: Dispatcher<Action<ActionTypes>>, { filter, toDos }: AppState) => {
	// Your starting point. Enjoy the ride!
    const app = document.querySelector('.todoapp') as HTMLElement;

    if (app) {
        while (app.hasChildNodes()) {
            app.removeChild(app.lastChild!);
        }
        app.appendChild(header(dispatch)());
        app.appendChild(main(dispatch)(filter, toDos));
        app.appendChild(footer(dispatch)(filter, toDos));
    }
}

store.subscribe({
    next: (value: AppState) => renderApp(store.dispatch, value)
});
