import { Observer, ToDo, ToDoStore } from "./types";

export const createStore = (localStorageKey: string): ToDoStore => {
    var store: ToDo[] = JSON.parse(window.localStorage.getItem(localStorageKey) || '[]');
    const subscribers: Observer<ToDo[]>[] = [];

    const getter = () => store;

    const setter = (newValue: ToDo[]) => {
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

    return [
        getter,
        setter,
        subscribe
    ]
}

export const destroyItem = (store: ToDoStore) => (id: number) => {
    const [getToDos, setToDos] = store;
    setToDos(getToDos().filter(toDo => toDo.id === id))
}
