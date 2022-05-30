import { reducer } from "./reducer";
import { ActionTypes, AppState, FilterType } from "./types";

describe("reducer", () => {
    const state: AppState = {
        toDos: [{ id: 1, note: "task 1", completed: true }, { id: 2, note: "task 2", completed: false }],
        filter: FilterType.All
    };

    test("ToggleAll", () => {
        const newState = reducer(state, {
            type: ActionTypes.ToggleAll
        });

        expect(newState).toEqual({
            ...state,
            toDos: [{ id: 1, note: "task 1", completed: true }, { id: 2, note: "task 2", completed: true }]
        });
    });

    test("SetFilter", () => {
        const newState = reducer(state, {
            type: ActionTypes.SetFilter,
            payload: FilterType.Active
        });

        expect(newState).toEqual({
            ...state,
            filter: FilterType.Active
        });
    });

    test("AddTodo", () => {
        const newState = reducer(state, {
            type: ActionTypes.AddItem,
            payload: "task 3"
        });

        expect(newState.toDos.length).toEqual(3);
    });

    test("DestroyTodo", () => {
        const newState = reducer(state, {
            type: ActionTypes.DestroyItem,
            payload: 1
        });

        expect(newState.toDos.length).toEqual(1);
    });

    test("ToggleTodo", () => {
        const newState = reducer(state, {
            type: ActionTypes.ToggleCompleted,
            payload: 1
        });

        expect(newState.toDos[0].completed).toBe(false);
    });
});