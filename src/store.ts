export type ToDo = {
    id: number,
    completed: boolean,
    note: string,
}

export type ToDoStore = [ToDo[], (newValue: ToDo[]) => void]

export const createStore = (render: (newValue: ToDo[]) => void): ToDoStore => {
    var store: ToDo[] = [];

    const setter = (newValue: ToDo[]) => {
        store = newValue
        render(newValue)
    };

    return [
        store,
        setter
    ]
}

export const destroyItem = (store: ToDoStore) => (id: number) => {
    const [toDos, setToDos] = store;
    setToDos(toDos.filter(toDo => toDo.id === id))
}
