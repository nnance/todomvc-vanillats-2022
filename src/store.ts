import { Observer, Reducer, Store } from "./types.js";

export function createStorage<T,U>(reducer: Reducer<T, U>, localStorageKey: string, defaultState?: T): Store<T, U> {
    const subscribers: Observer<T>[] = [];
    
    const getState = (): T => {
        const state = localStorage.getItem(localStorageKey);
        return state ? JSON.parse(state) : defaultState;
    }

    const save = (newValue: T) => {
        localStorage.setItem(localStorageKey, JSON.stringify(newValue));
        return newValue
    }

    const notify = (newValue: T) => {
        subscribers.forEach(subscriber => subscriber.next(newValue));
    }

    const subscribe = (observer: Observer<T>) => {
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

    const dispatch = (action: U) => {
        notify(save(reducer(getState(), action)));
    }

    return { getState, subscribe, dispatch }
}
