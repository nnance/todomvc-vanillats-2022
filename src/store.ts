import { createStorage, Persistance } from "./lib";
import { Action, ActionTypes, AppState, FilterType, Reducer } from "./types";

const storageKey = 'todomvc-typescript-2002';

const localPersistance: Persistance = {
    getItem: () => localStorage.getItem(storageKey),
    setItem: (value: string) => localStorage.setItem(storageKey, value)
}

export const createStore = (reducer: Reducer<AppState, Action<ActionTypes>>, storage: Persistance = localPersistance) => {
    return createStorage(reducer, storage, { toDos: [], filter: FilterType.All });
}
