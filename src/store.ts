import { Observer, ToDo, AppStore, AppState } from "./types";

export const createStorage = (localStorageKey: string): AppStore => {
    const subscribers: Observer<AppState>[] = [];

    return {
        getState: () => JSON.parse(window.localStorage.getItem(localStorageKey) || '[]'),
        save: (newValue: AppState) => {
            window.localStorage.setItem(localStorageKey, JSON.stringify(newValue));
            subscribers.forEach(subscriber => subscriber.next(newValue));
        },
        subscribe: (observer: Observer<AppState>) => {
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
    }
}

export const toggleAll = (store: AppStore) => () => {
    const state = store.getState()
    const newState = { ...state, toDos: state.toDos.map(t => ({ ...t, completed: true })) }
    store.save(newState)
}

export const toggleCompleted = (store: AppStore) => (todo: ToDo) => () => {
    const state = store.getState()
    const newState = { ...state, toDos: state.toDos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t) }
    store.save(newState)
}

export const addItem = (store: AppStore) => (note: string) => {
    const state = store.getState()
    const newState = { ...state, toDos: [...state.toDos, { id: Date.now(), completed: false, note }]};
    store.save(newState);
}

export const destroyItem = (store: AppStore) => (id: number) => {
    const state = store.getState()
    const newState = { ...state, toDos: (state.toDos.filter(toDo => toDo.id === id)) }
    store.save(newState);
}

export const filterCompleted = ({getState}: AppStore) => (completed: boolean) => {
    return getState().toDos.filter(toDo => toDo.completed === completed)
}