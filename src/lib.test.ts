import { diff, applyPatches, createStorage, Persistance } from "./lib";
import { jest } from "@jest/globals";

describe("diff", () => {
    it("should return an empty array when the same node is passed", () => {
        const root = document.createElement("div");
        const oldTree = document.createElement("div");
        const newTree = document.createElement("div");
        expect(diff(root, oldTree, newTree)).toEqual([]);
    });
    it("should return an array with a replace patch when the node is different", () => {
        const root = document.createElement("div");
        const oldTree = document.createElement("div");
        const newTree = document.createElement("section");
        expect(diff(root, oldTree, newTree).filter(p => p.type === 'replace')).toHaveLength(1);
    });
    it("should return an array with a remove patch when the node is null", () => {
        const root = document.createElement("div");
        const oldTree = document.createElement("div");
        const newTree = null;
        expect(diff(root, oldTree, newTree).filter(p => p.type === 'remove')).toHaveLength(1);
    });
    it("should return an array with an append patch when the node is null", () => {
        const root = document.createElement("div");
        const newTree = document.createElement("div");
        const oldTree = null;
        expect(diff(root, oldTree, newTree).filter(p => p.type === 'append')).toHaveLength(1);
    });
    it("should return an array with an attribute patch when the class changes", () => {
        const root = document.createElement("div");
        const newTree = document.createElement("div");
        newTree.className = "foo";
        const oldTree = document.createElement("div");
        oldTree.className = "bar";
        root.appendChild(oldTree);
        expect(diff(root, oldTree, newTree).filter(p => p.type === 'attribute')).toHaveLength(1);
    });
    it("should return an array with a remove patch when child count is different", () => {
        const root = document.createElement("div");
        const oldTree = document.createElement("div");
        oldTree.innerHTML = `
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>`

        const newTree = document.createElement("div");
        newTree.innerHTML = `
        <ul>
            <li>1</li>
            <li>2</li>
        </ul>`
        expect(diff(root, oldTree, newTree).filter(p => p.type === 'remove')).toHaveLength(1);
    });
    it("should return multiple changes", () => {
        const root = document.createElement("div");
        const oldTree = document.createElement("div");
        oldTree.innerHTML = `
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>
        <div>
            <p>Hello</p>
        </div>`

        const newTree = document.createElement("div");
        newTree.innerHTML = `
        <ul>
            <li>1</li>
            <li>2</li>
        </ul>`
        expect(diff(root, oldTree, newTree).filter(p => p.type === 'remove')).toHaveLength(2);
    });
});

describe("applyPatches", () => {
    it("should append new node when missing child", () => {
        const newNode = document.createElement("section");
        const parentNode = document.createElement("div");
        applyPatches([{ type: 'append', parentNode, newNode }]);
        expect(parentNode.firstElementChild).toBe(newNode);
    });
    it("should replace the old node with the new node", () => {
        const oldNode = document.createElement("div");
        const newNode = document.createElement("section");
        const parentNode = document.createElement("div");
        parentNode.appendChild(oldNode);
        applyPatches([{ type: 'replace', parentNode, newNode, oldNode }]);
        expect(parentNode.firstElementChild).toBe(newNode);
    });
});

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
