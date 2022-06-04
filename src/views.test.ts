import { AppState, FilterType } from "./types";
import { containerView, createDelegate } from "./views";

describe('containerView', () => {
    const dispatch = () => { };

    const state: AppState = {
        toDos: [{ id: 1, note: "task 1", completed: true }, { id: 2, note: "task 2", completed: false }],
        filter: FilterType.All
    };

    const renderer = containerView(dispatch, createDelegate());
    const container = renderer(state);

    test("rendering header", () => {
        expect(container.querySelector('.header')).toBeInstanceOf(Element);
    });
    test("rendering main", () => {
        expect(container.querySelector('.main')).toBeInstanceOf(Element);
    });
    test("rendering footer", () => {
        expect(container.querySelector('.footer')).toBeInstanceOf(Element);
    });
});

describe('rendering main with filters', () => {
    const dispatch = () => { };
    
    const state: AppState = {
        toDos: [
            { id: 1, note: "task 1", completed: true },
            { id: 2, note: "task 2", completed: false },
            { id: 3, note: "task 3", completed: false }
        ],
        filter: FilterType.All
    };

    const renderer = containerView(dispatch, createDelegate());

    test("all filter should render two to dos", () => {
        expect(renderer(state).querySelectorAll(".todo-list li").length).toBe(3);
    });
    test("completed filter should one all to dos", () => {
        expect(renderer({...state, filter: FilterType.Completed}).querySelectorAll(".todo-list li").length).toBe(1);
    });
    test("active filter should two all to dos", () => {
        expect(renderer({...state, filter: FilterType.Active}).querySelectorAll(".todo-list li").length).toBe(2);
    });
});