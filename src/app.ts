import { footer, header, main } from "./views.js";
import { createStorage, toggleAll, toggleCompleted, addItem, setFilter } from "./store.js"
import { Actions, Observer, AppStore, FilterType, AppState } from "./types.js"

//TODO - replace store observer with js proxy
//TODO - change toggle complete to toggle a single item
//TODO - add tests

const store = createStorage('todomvc-typescript-2002');

const createActions = (store: AppStore): Actions => {
    
    return {
        toggleAll: toggleAll(store),
        toggleCompleted: toggleCompleted(store),
        addItem: (event?: Event) => {
            const e = event as KeyboardEvent;
            if (e && e.key === "Enter" && e.target instanceof HTMLInputElement) {
                const input = e.target as HTMLInputElement;
                if (input.value.length > 0) {
                    addItem(store)(input.value)
                }
            }
        },
        selectFilter: (filter: FilterType) => () => setFilter(store)(filter),
    }
}

const renderApp = (actions: Actions) => ({ filter, toDos }: AppState) => {
	// Your starting point. Enjoy the ride!
    const app = document.querySelector('.todoapp') as HTMLElement;

    if (app) {
        while (app.hasChildNodes()) {
            app.removeChild(app.lastChild!);
        }
        app.appendChild(header(actions)(toDos));
        app.appendChild(main(actions)(filter, toDos));
        app.appendChild(footer(actions)(filter, toDos));
    }
}


const actions = createActions(store);
const renderer = renderApp(actions);

const storeObserver: Observer<AppState> = {
    next: (value: AppState) => renderer(value)
}

store.subscribe(storeObserver);

// initial state for the store
const toDos = store.getState().toDos;
renderer(store.getState());
