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

export enum ActionTypes {
    ToggleAll,
    ToggleCompleted,
    AddItem,
    DestroyItem,
    SetFilter,
}

export type Action = {
    type: ActionTypes,
    payload?: any,
}

export type Reducer = (state: AppState, action: Action) => AppState;
export type Dispatcher = (action: Action) => void;

export type AppStore = {
    getState: () => AppState,
    subscribe: (observer: Observer<AppState>) => { unsubscribe: () => void }
    dispatch: Dispatcher,
};

