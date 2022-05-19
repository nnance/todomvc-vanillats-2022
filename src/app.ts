import { renderApp } from "./toDoList.js"
import { createStorage, toggleAll, toggleCompleted, addItem } from "./store.js"
import { Actions, Observer, ToDo, ToDoStore } from "./types.js"

//TODO - replace store observer with js proxy
//TODO - change toggle complete to toggle a single item
//TODO - add tests

const store = createStorage('todomvc-typescript-2002');

const createActions = (store: ToDoStore): Actions => {
    
    return {
        toggleAll: toggleAll(store),
        toggleCompleted: toggleCompleted(store),
        addItem: addItem(store),
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
