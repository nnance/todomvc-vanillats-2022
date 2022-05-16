export type Observer<T> = {
    next: (value: T) => void
    error: (error: Error) => void
    complete: () => void
}

export type ToDo = {
    id: number,
    completed: boolean,
    note: string,
}

export type ToDoStore = {
    getAll: () => ToDo[],
    save: (newValue: ToDo[]) => void, 
    subscribe: (observer: Observer<ToDo[]>) => { unsubscribe: () => void }
};

export type Actions = {
    toggleAll: () => void,
    toggleCompleted: (todo: ToDo) => void,
}
