import { renderToDos } from "./toDoList.js"
import { createStore, ToDo } from "./store.js"

const toDoToggle = (todo: ToDo) => {
    const newState = store().map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
    setState(newState)
}

const toggleAll = () => {
    const newState = store().map(t => ({ ...t, completed: true }))
    setState(newState)
}

const renderApp = (store: ToDo[]) => {
	// Your starting point. Enjoy the ride!
    const main = window.document.querySelector('.main')

    const html = `
        <input id="toggle-all" class="toggle-all" type="checkbox">
        <label for="toggle-all">Mark all as complete</label>
    `

    if (main) {    
        main.innerHTML = html;
        main.appendChild(renderToDos(store, toDoToggle).firstElementChild as HTMLElement);

        main.querySelector('.toggle-all')?.addEventListener('click', toggleAll);
    }
}

const state = [{
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
}]

const [store, setState] = createStore(renderApp);
setState(state)

type Observer<T> = {
    next: (value: T) => void
    error: (error: Error) => void
    complete: () => void
}

const storeObserver: Observer<ToDo[]> = {
    next: (value: ToDo[]) => {
        renderApp(value)
    },
    error: (error: Error) => {
        console.log(error)
    },
    complete: () => {
        console.log("complete")
    }
}

const completed = (li: HTMLLIElement) => {
    return {
        subscribe: (observer: Observer<ToDo>) => {
            const handle = setInterval(() => {
                const todo = store().find(todo => todo.id === Number(li.dataset.id));
                if (todo) {
                    observer.next(todo)
                }
            }, 1000)
            return {
                unsubscribe: () => clearInterval(handle)
            }
        }
    }
}

const checkAll = (el: string) => {
    return {
        subscribe: (observer: Observer<boolean>) => {
            const checkbox = document.querySelector(el) as HTMLInputElement
            if (checkbox) {
                console.log("selector found")
                const handler = () => observer.next(checkbox.checked)
                checkbox.addEventListener('click', handler)
                return {
                    unsubscribe: () => checkbox.removeEventListener('click', handler)
                }
            }
        }
    }
}

const checkAllObserver = (): Observer<boolean> => {
    return {
        next: (value: boolean) => {
            console.log(value)
            document.querySelectorAll('li').forEach(li => {
                const checkbox = li.querySelector('.toggle') as HTMLInputElement
                if (checkbox) {
                    checkbox.checked = value
                }
            });
        },
        error: (error: Error) => {
            console.log(error)
        },
        complete: () => {
            console.log("complete")
        }
    }
}

// const checkAllUnsubscribe = checkAll('#toggle-all').subscribe(checkAllObserver())

// const store = <T>(state: ToDo[][]) => {
//     return {
//         subscribe: (observer: Observer<T>) => {
//             observer.next()
//             return {
//                 unsubscribe: () => {},
//                 setState: (state: ToDo[])
//             }
//         }
//     }
