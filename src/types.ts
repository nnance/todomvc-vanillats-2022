export type Observer<T> = {
    next: (value: T) => void
}

export type ToDo = {
    id: number,
    completed: boolean,
    note: string,
}

export enum FilterType {
    All,
    Completed,
    Active
}

export type AppState = {
    toDos: ToDo[],
    filter: FilterType,
}

export type AppStore = {
    getState: () => AppState,
    save: (newValue: AppState) => void, 
    subscribe: (observer: Observer<AppState>) => { unsubscribe: () => void }
};

export type Actions = {
    toggleAll: () => void,
    toggleCompleted: (todo: ToDo) => () => void,
    addItem: (event?: Event) => void,
    selectFilter: (filter: FilterType) => () => void,
}
