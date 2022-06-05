import { Observer, Reducer, Store } from "./types.js";

type DelegateHandler = (event?: Event, el?: HTMLElement) => void;
type EventDelegate = {
    event: string,
    selector: string,
    handler: DelegateHandler,
}

export type Delegate = ReturnType<typeof createDelegate>;

export type Persistance = {
    getItem: () => string | null,
    setItem: (value: string) => void
}

export const createElement = (html: string): HTMLElement => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild as HTMLElement;
}

export const createDelegate = () => {
    const delegates: EventDelegate[] = [];

    const addListener = (selector: string, event: string, handler: DelegateHandler) => {
        // add listener for first event delegate
        if (!delegates.find(d => d.event === event)) {
            document.addEventListener(event, e => {
                delegates
                    .filter(d => (e.target as HTMLElement).matches(d.selector))
                    .forEach(d => d.handler(e, e.target as HTMLElement));
            });
        } 
        // add delegate for selector
        if (!delegates.find(d => d.event === event && d.selector === selector)) {
            delegates.push({ event, selector, handler });
        }
    }

    const removeListener = (selector: string, event: string) => {
        const index = delegates.findIndex(d => d.event === event && d.selector === selector);
        if (index > -1) {
            document.removeEventListener(event, delegates[index].handler);
            delegates.splice(index, 1);
        }
    }

    const removeAll = () => {
        delegates.forEach(d => {
            document.removeEventListener(d.event, d.handler);
        });
        delegates.splice(0, delegates.length);
    }

    return {
        addListener,
        removeListener,
        removeAll
    }
}

// TODO: needs to address lists of elements with a key attribute like react
export const diff = (parentNode: Element, oldTree: Element | null, newTree: Element | null) => {

    const walkAttributes = (oldNode: Element, newNode: Element) => {
        const oldAttrs = oldNode ? Array.from(oldNode.attributes) : [];
        const newAttrs = newNode ? Array.from(newNode.attributes) : [];

        const oldAttrMap = oldAttrs.reduce((map, attr) => {
            map[attr.name] = attr.value;
            return map;
        }, {} as { [key: string]: string });
        const newAttrMap = newAttrs.reduce((map, attr) => {
            map[attr.name] = attr.value;
            return map;
        }, {} as { [key: string]: string });

        const attrPatches: Patch[] = [];
        for (const key in oldAttrMap) {
            if (newAttrMap[key] !== oldAttrMap[key]) {
                attrPatches.push({
                    type: 'attribute',
                    parentNode: oldNode,
                    name: key,
                    value: newAttrMap[key]
                });
            }
        }
        for (const key in newAttrMap) {
            if (!oldAttrMap[key]) {
                attrPatches.push({
                    type: 'attribute',
                    parentNode: oldNode,
                    name: key,
                    value: newAttrMap[key]
                });
            }
        }
        return attrPatches;
    }

    const walkChildren = (oldNode: Element, newNode: Element) => {
        const oldChildren = Array.from(oldNode.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);
        const newChildren = Array.from(newNode.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);

        const children = oldChildren.length > newChildren.length ? oldChildren : newChildren;
        return children.reduce((patches, child, i) => {
            const oldChild = oldChildren.length > i ? oldChildren[i] as HTMLElement : null;
            const newChild = newChildren.length > i ? newChildren[i] as HTMLElement : null;
            return [...walk(oldNode, oldChild, newChild, patches)];
        }, [] as Patch[]);
    }
    
    const walk = (parentNode: Element, oldNode: Element | null, newNode: Element | null, patches: Patch[] = []): Patch[] => {
        if (oldNode === null && newNode !== null) {
            return [...patches, { type: 'append', parentNode, newNode }];
        }
        if (newNode === null && oldNode !== null) {
            return [...patches, { type: 'remove', oldNode, parentNode }];
        }
        if (oldNode && newNode) {
            if (oldNode.tagName !== newNode.tagName) {
                return [...patches, { type: 'replace', parentNode, oldNode, newNode }];
            }
            if (oldNode.nodeType === Node.ELEMENT_NODE) {
                return [...patches, ...walkChildren(oldNode, newNode), ...walkAttributes(oldNode, newNode)];
            }
            if (oldNode.nodeType === Node.ATTRIBUTE_NODE) {
                if (oldNode.nodeValue !== newNode.nodeValue) {
                    return [...patches, { type: 'replace', parentNode, oldNode, newNode }];
                }
            }
            if (oldNode.nodeType === Node.TEXT_NODE) {
                if (oldNode.nodeValue !== newNode.nodeValue) {
                    return [...patches, { type: 'replace', parentNode, oldNode, newNode }];
                }
            }
        }
        return patches;
    }
    
    return walk(parentNode, oldTree, newTree);
}

// TODO: Add conditional types based on the type of the element
export type Patch = {
    type: 'replace' | 'remove' | 'append' | 'attribute',
    parentNode: ParentNode,
    newNode?: Element,
    oldNode?: Element,
    name?: string,
    value?: string
}

export const applyPatches = (patches: Patch[]) => {
    patches.forEach(patch => {
        const { type, newNode, oldNode, parentNode } = patch;

        if (type === 'replace' && newNode && oldNode && parentNode) {
            parentNode.replaceChild(newNode, oldNode);
        } else if (type === 'remove' && oldNode && parentNode) {
            parentNode.removeChild(oldNode);
        } else if (type === 'append' && newNode && parentNode) {
            parentNode.appendChild(newNode);
        } else if (type === 'attribute' && parentNode) {
            (parentNode as HTMLElement).setAttribute(patch.name!, patch.value!);
        }
    });
}

export function createStorage<T,U>(reducer: Reducer<T, U>, storage: Persistance, defaultState?: T): Store<T, U> {
    const subscribers: Observer<T>[] = [];
    
    const getState = (): T => {
        const state = storage.getItem();
        return state ? JSON.parse(state) : defaultState;
    }

    const save = (newValue: T) => {
        storage.setItem(JSON.stringify(newValue));
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