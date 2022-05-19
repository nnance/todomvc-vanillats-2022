import { Observer, ToDo, ToDoStore } from "./types";

export const createStorage = (localStorageKey: string): ToDoStore => {
    const subscribers: Observer<ToDo[]>[] = [];

    return {
        getAll: () => JSON.parse(window.localStorage.getItem(localStorageKey) || '[]'),
        save: (newValue: ToDo[]) => {
            window.localStorage.setItem(localStorageKey, JSON.stringify(newValue));
            subscribers.forEach(subscriber => subscriber.next(newValue));
        },
        subscribe: (observer: Observer<ToDo[]>) => {
            subscribers.push(observer);
            
            return {
                unsubscribe: () => {
                    const index = subscribers.indexOf(observer);
                    if (index > -1) {
                        subscribers.splice(index, 1);
                    }
                }
            }
        }
    }
}

export const toggleAll = (store: ToDoStore) => () => {
    const newState = store.getAll().map(t => ({ ...t, completed: true }))
    store.save(newState)
}

export const toggleCompleted = (store: ToDoStore) => (todo: ToDo) => () => {
    const newState = store.getAll().map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
    store.save(newState)
}

export const addItem = (store: ToDoStore) => (note: string) => {
    const newState = [...store.getAll(), { id: Date.now(), completed: false, note }];
    store.save(newState);
}

export const destroyItem = ({getAll, save}: ToDoStore) => (id: number) => {
    save(getAll().filter(toDo => toDo.id === id))
}
