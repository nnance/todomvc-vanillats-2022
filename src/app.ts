import { footer, header, main } from "./sections.js";
import { createStorage, toggleAll, toggleCompleted, addItem } from "./store.js"
import { Actions, Observer, ToDo, ToDoStore } from "./types"

//TODO - replace store observer with js proxy
//TODO - change toggle complete to toggle a single item
//TODO - add tests

const store = createStorage('todomvc-typescript-2002');

const createActions = (store: ToDoStore): Actions => {
    
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
        }
    }
}

const renderApp = (actions: Actions) => (toDos: ToDo[]) => {
	// Your starting point. Enjoy the ride!
    const app = document.querySelector('.todoapp') as HTMLElement;

    if (app) {
        while (app.hasChildNodes()) {
            app.removeChild(app.lastChild!);
        }
        app.appendChild(header(actions)(toDos));
        app.appendChild(main(actions)(toDos));
        app.appendChild(footer(actions)(toDos));
    }
}


const actions = createActions(store);
const renderer = renderApp(actions);

const storeObserver: Observer<ToDo[]> = {
    next: (value: ToDo[]) => {
        renderer(value)
    }
}

store.subscribe(storeObserver);

// initial state for the store
if (store.getAll().length === 0) {
    store.save([{
        id: Date.now(),
        completed: true,
        note: "Add TypeScript"
    }, {
        id: Date.now(),
        completed: false,
        note: "Make Modules Work"
    }, {
        id: Date.now(),
        completed: false,
        note: "Render on store change"
    }]);
} else {
    renderer(store.getAll());
}
