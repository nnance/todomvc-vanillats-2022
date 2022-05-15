import { Observer, ToDo, ToDoStore } from "./types";

export const createStore = (): ToDoStore => {
    var store: ToDo[] = [];
    const subscribers: Observer<ToDo[]>[] = [];

    const getter = () => store;

    const setter = (newValue: ToDo[]) => {
        store = newValue
        subscribers.forEach(subscriber => subscriber.next(store))
    };

    const subscribe = (observer: Observer<ToDo[]>) => {
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
