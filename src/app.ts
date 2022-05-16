import { renderApp } from "./toDoList.js"
import { createStore } from "./store.js"
import { Actions, Observer, ToDo, ToDoStore } from "./types.js"

//TODO - replace store observer with js proxy
//TODO - change toggle complete to toggle a single item
//TODO - add tests

const { getAll, save, subscribe } = createStore('todomvc-typescript-2002');

const createActions = (store: ToDoStore): Actions => {
    const { getAll, save } = store;

    return {
        toggleAll: () => {
            const newState = getAll().map(t => ({ ...t, completed: true }))
            save(newState)
        },
        toggleCompleted: (todo: ToDo) => {
            const newState = getAll().map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
            save(newState)
        },
    }
}

const actions = createActions({getAll, save, subscribe});

const storeObserver: Observer<ToDo[]> = {
    next: (value: ToDo[]) => {
        renderApp(actions)(value)
    },
    error: (error: Error) => {
        console.log(error)
    },
    complete: () => {
        console.log("complete")
    }
}

subscribe(storeObserver);

// initial state for the store
if (getAll().length === 0) {
    save([{
        id: 1,
        completed: true,
        note: "Add TypeScript"
    }, {
        id: 2,
        completed: false,
        note: "Make Modules Work"
    }, {
        id: 3,
        completed: false,
        note: "Render on store change"
    }]);
}
