import { Observer, ToDo, ToDoStore } from "./types";

export const createStore = (localStorageKey: string): ToDoStore => {
    var store: ToDo[] = JSON.parse(window.localStorage.getItem(localStorageKey) || '[]');
    const subscribers: Observer<ToDo[]>[] = [];

    const getAll = () => store;

    const save = (newValue: ToDo[]) => {
        store = newValue
        window.localStorage.setItem(localStorageKey, JSON.stringify(store));
        subscribers.forEach(subscriber => subscriber.next(store))
    };

    const subscribe = (observer: Observer<ToDo[]>) => {
        subscribers.push(observer);
        observer.next(store);
        
        return {
            unsubscribe: () => {
                const index = subscribers.indexOf(observer);
                if (index > -1) {
                    subscribers.splice(index, 1);
                }
            }
        }
    }

    return {
        getAll,
        save,
        subscribe
    }
}

export const addItem = (store: ToDoStore) => (toDo: ToDo) => {
    const newState = [...store.getAll(), toDo];
    store.save(newState);
}

export const destroyItem = ({getAll, save}: ToDoStore) => (id: number) => {
    save(getAll().filter(toDo => toDo.id === id))
}
