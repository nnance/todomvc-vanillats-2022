import { reducer } from "./reducer";
import { createStorage, Persistance } from "./store";
import { FilterType } from "./types";
import { containerView } from "./views";
import { findByText, getByText, queryAllByText, waitFor } from "@testing-library/dom";
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


describe("renderApp", () => {
    const store = createStorage(reducer, storage());

    const elem = document.createElement("section");
    elem.classList.add("todoapp");
    document.body.appendChild(elem);

    const renderer = renderApp(elem, store.dispatch);

    it("should render the app", () => {
        const container = containerView(store.dispatch)(store.getState());
        expect(container.querySelector('.header')).toBeInstanceOf(Element);    
    });
    
    it("should refresh the app when filter clicked", async () => {
        const subscription = store.subscribe({
            next: (value) => renderer(value)
        });

        getByText(document.body, "Active").click();

        await waitFor(() => {
            expect(queryAllByText(document.body, /task/).length).toBe(2);
        });
    });
});