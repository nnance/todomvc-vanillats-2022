import { Observer, AppStore, AppState, FilterType, Reducer, Action } from "./types.js";

export const createStorage = (reducer: Reducer, localStorageKey: string): AppStore => {
    const subscribers: Observer<AppState>[] = [];
    
    const getState = (): AppState => {
        const state = localStorage.getItem(localStorageKey);
        return state ? JSON.parse(state) : { toDos: [], filter: FilterType.All };
    }

    const save = (newValue: AppState) => {
        localStorage.setItem(localStorageKey, JSON.stringify(newValue));
        return newValue
    }

    const notify = (newValue: AppState) => {
        subscribers.forEach(subscriber => subscriber.next(newValue));
    }

    const subscribe = (observer: Observer<AppState>) => {
        subscribers.push(observer);
        notify(getState());

        return {
            unsubscribe: () => {
                const index = subscribers.indexOf(observer);
                if (index > -1) {
                    subscribers.splice(index, 1);
                }
            }
        }
    }

    const dispatch = (action: Action) => {
        const newState = reducer(getState(), action);
        save(newState);
        notify(newState);
    }

    return { getState, subscribe, dispatch }
}
