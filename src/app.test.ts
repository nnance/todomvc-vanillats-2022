import { reducer } from "./reducer";
import { createStorage, Persistance } from "./store";
import { FilterType } from "./types";
import { containerView, createDelegate } from "./views";
import { getByText, queryAllByText, waitFor } from "@testing-library/dom";
import { renderApp } from "./app";

const storage = (): Persistance => {
    let state: string = JSON.stringify({
        toDos: [
            { id: 1, note: "task 1", completed: true },
            { id: 2, note: "task 2", completed: false },
            { id: 3, note: "task 3", completed: false }
        ],
        filter: FilterType.All
    });
    return {
        getItem: () => state,
        setItem: (s: string) => state = s
    }
}


describe("app smoke test", () => {
    const store = createStorage(reducer, storage());

    it("should render the app", () => {
        const container = containerView(store.dispatch)(store.getState());
        expect(container.querySelector('.header')).toBeInstanceOf(Element);    
        expect(container.querySelector('.footer')).toBeInstanceOf(Element);    
        expect(container.querySelector('.main')).toBeInstanceOf(Element);    
    });
});

describe("filter refresh", () => {
    const store = createStorage(reducer, storage());

    const elem = document.createElement("section");
    document.body.appendChild(elem);

    const renderer = renderApp(elem, store.dispatch);

    store.subscribe({
        next: (value) => renderer(value)
    });

    afterAll(() => {
        document.body.removeChild(elem);
    });

    it("should refresh the app when filter clicked", async () => {
        getByText(document.body, "Active").click();

        await waitFor(() => {
            expect(queryAllByText(elem, /task/).length).toBe(2);
        });
    });

    it("should refresh the app when filter clicked", async () => {
        getByText(document.body, "Completed").click();

        await waitFor(() => {
            expect(queryAllByText(elem, /task/).length).toBe(1);
        });
    });

    it("should refresh the app when filter clicked", async () => {
        getByText(document.body, "All").click();

        await waitFor(() => {
            expect(queryAllByText(elem, /task/).length).toBe(3);
        });
    });
});