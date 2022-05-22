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

export enum ActionTypes {
    ToggleAll,
    ToggleCompleted,
    AddItem,
    DestroyItem,
    SetFilter,
}

export type Observer<T> = {
    next: (value: T) => void
}

export type Action<T> = {
    type: T,
    payload?: any,
}

export type Reducer<T, U> = (state: T, action: U) => T;
export type Dispatcher<T> = (action: T) => void;

export type Store<T, U> = {
    getState: () => T,
    subscribe: (observer: Observer<T>) => { unsubscribe: () => void }
    dispatch: Dispatcher<U>,
};

