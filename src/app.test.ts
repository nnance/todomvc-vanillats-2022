import { reducer } from "./reducer";
import { createStorage, Persistance } from "./store";
import { FilterType } from "./types";
import { containerView } from "./views";
import { getAllByRole, getByLabelText, getByRole, getByText, queryAllByAttribute, queryAllByText, waitFor } from "@testing-library/dom";
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
    const elem = document.createElement("section");

    beforeAll(() => {
        document.body.appendChild(elem);

        const store = createStorage(reducer, storage());
        const renderer = renderApp(elem, store.dispatch);
        store.subscribe({
            next: (value) => renderer(value)
        });
    });

    afterAll(() => {
        document.body.removeChild(elem);
    });

    it("should refresh the app when active filter clicked", async () => {
        getByText(document.body, "Active").click();

        await waitFor(() => {
            expect(queryAllByText(elem, /task/).length).toBe(2);
        });
    });

    it("should refresh the app when completed filter clicked", async () => {
        getByText(document.body, "Completed").click();

        await waitFor(() => {
            expect(queryAllByText(elem, /task/).length).toBe(1);
        });
    });

    it("should refresh the app when all filter clicked", async () => {
        getByText(document.body, "All").click();

        await waitFor(() => {
            expect(queryAllByText(elem, /task/).length).toBe(3);
        });
    });
});

describe("mark task completed", () => {
    const elem = document.createElement("section");

    beforeAll(() => {
        document.body.appendChild(elem);

        const store = createStorage(reducer, storage());
        const renderer = renderApp(elem, store.dispatch);
        store.subscribe({
            next: (value) => renderer(value)
        });
    });

    afterAll(() => {
        document.body.removeChild(elem);
    });

    it("should mark item completed with checkbox clicked", async () => {
        getAllByRole(document.body, "checkbox", { checked: false })[1].click();

        await waitFor(() => {
            expect(queryAllByAttribute("class", elem, "completed").length).toBe(2);
        });
    });

    it("should mark item active with checkbox clicked", async () => {
        getAllByRole(document.body, "checkbox", { checked: true })[0].click();

        await waitFor(() => {
            expect(queryAllByAttribute("class", elem, "completed").length).toBe(1);
        });
    });
});

describe("mark all completed", () => {
    const elem = document.createElement("section");

    beforeAll(() => {
        document.body.appendChild(elem);

        const store = createStorage(reducer, storage());
        const renderer = renderApp(elem, store.dispatch);
        store.subscribe({
            next: (value) => renderer(value)
        });

    });

    afterAll(() => {
        document.body.removeChild(elem);
    });

    it("should mark all items completed with clicked", async () => {
        getAllByRole(document.body, "checkbox", { checked: false })[0].click();

        await waitFor(() => {
            expect(queryAllByAttribute("class", elem, "completed").length).toBe(3);
        });
    });
});