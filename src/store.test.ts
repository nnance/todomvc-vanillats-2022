import { createStorage, Persistance } from "./store";
import { jest } from '@jest/globals';

type State = {
    counter: number;
    history: number[];
}

type Action = {
    type: 'INCREMENT' | 'DECREMENT' | 'RESET';
}

describe('createStorage', ()  => {
    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'INCREMENT':
                return {
                    ...state,
                    counter: state.counter + 1,
                    history: [...state.history, state.counter + 1]
                };
            case 'DECREMENT':
                return {
                    ...state,
                    counter: state.counter - 1,
                    history: [...state.history, state.counter - 1]
                };
            case 'RESET':
                return {
                    ...state,
                    counter: 0,
                    history: [0]
                };
            default:
                return state;
        }
    };

    const storage = (): Persistance => {
        let state: string = ''
        return {
            getItem: () => state,
            setItem: (s: string) => state = s
        }
    }

    test('should call reducer when an action is dispatched', () => {
        const mock = jest.fn(reducer);
        const store = createStorage(mock, storage(), { counter: 0, history: [] });
        store.dispatch({ type: 'INCREMENT' });
        expect(mock).toHaveBeenCalled();
    });

    test('should return a store with getState', () => {
        const store = createStorage(reducer, storage(), { counter: 0, history: [] });
        expect(store.getState()).toEqual({ counter: 0, history: [] });
    });

    test('should return a store with subscribe', () => {
        const store = createStorage(reducer, storage(), { counter: 0, history: [] });
        const observer = {
            next: jest.fn()
        };
        store.subscribe(observer);
        store.dispatch({ type: 'INCREMENT' });
        expect(observer.next).toHaveBeenCalled();
    });

    test('should remove subscription on unsubscribe', () => {
        const store = createStorage(reducer, storage(), { counter: 0, history: [] });
        const observer = {
            next: jest.fn()
        };
        const subscription = store.subscribe(observer);
        store.dispatch({ type: 'INCREMENT' });
        subscription.unsubscribe();
        store.dispatch({ type: 'INCREMENT' });
        // observer is called on the subscribe so it will be called twice before unsubscribing
        expect(observer.next).toHaveBeenCalledTimes(2);
    });

    test('should return a store with dispatch', () => {
        const mock = jest.fn(reducer);
        const store = createStorage(mock, storage(), { counter: 0, history: [] });
        store.dispatch({ type: 'INCREMENT' });
        expect(store.getState()).toEqual({ counter: 1, history: [1] });
    });

    test('should save to storage on dispatch', () => {
        const mock = {
            getItem: () => '',
            setItem: jest.fn()
        }
        const store = createStorage(reducer, mock, { counter: 0, history: [] });
        store.dispatch({ type: 'INCREMENT' });
        expect(mock.setItem).toHaveBeenCalled();
    });
});
