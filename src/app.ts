import { renderApp } from "./toDoList.js"
import { createStore } from "./store.js"
import { Actions, Observer, ToDo, ToDoStore } from "./types.js"

//TODO - replace store observer with js proxy
//TODO - change toggle complete to toggle a single item
//TODO - add tests

const [getToDos, setToDos, subscribe] = createStore();

const createActions = (store: ToDoStore): Actions => {
    const [getToDos, setToDos] = store;

    return {
        toggleAll: () => {
            const newState = getToDos().map(t => ({ ...t, completed: true }))
            setToDos(newState)
        },
        toggleCompleted: (todo: ToDo) => {
            const newState = getToDos().map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
            setToDos(newState)
        },
    }
}

const actions = createActions([getToDos, setToDos, subscribe]);

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
setToDos([{
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
}])
