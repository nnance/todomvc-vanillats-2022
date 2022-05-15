import { renderApp } from "./toDoList.js"
import { createStore } from "./store.js"
import { Actions, Observer, ToDo } from "./types.js"

const [getToDos, setToDos, subscribe] = createStore();

const actions: Actions = {
    toggleAll: () => {
        const newState = getToDos().map(t => ({ ...t, completed: true }))
        setToDos(newState)
    },
    toggleCompleted: (todo: ToDo) => {
        const newState = getToDos().map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
        setToDos(newState)
    },
}

const renderMain = renderApp(actions);

const storeObserver: Observer<ToDo[]> = {
    next: (value: ToDo[]) => {
        renderMain(value)
    },
    error: (error: Error) => {
        console.log(error)
    },
    complete: () => {
        console.log("complete")
    }
}

const subscription = subscribe(storeObserver);

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
