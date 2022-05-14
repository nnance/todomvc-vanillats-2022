export type ToDo = {
    id: number,
    completed: boolean,
    note: string,
}

export type ToDoStore = [() => ToDo[], (newValue: ToDo[]) => void]

export const createStore = (render: (newValue: ToDo[]) => void): ToDoStore => {
    var store: ToDo[] = [];

    const getter = () => store;

    const setter = (newValue: ToDo[]) => {
        store = newValue
        render(newValue)
    };

    return [
        getter,
        setter
    ]
}

export const destroyItem = (store: ToDoStore) => (id: number) => {
    const [getToDos, setToDos] = store;
    setToDos(getToDos().filter(toDo => toDo.id === id))
}
