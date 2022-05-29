import { reducer } from "./reducer";
import { ActionTypes, AppState, FilterType } from "./types";

test("ToggleAll", () => {
    const state: AppState = {
        toDos: [{ id: 1, note: "task 1", completed: true }, { id: 2, note: "task 2", completed: false }],
        filter: FilterType.All
    };

    const action = {
        type: ActionTypes.ToggleAll
    };

    const newState = reducer(state, action);

    expect(newState).toEqual({
        toDos: [{ id: 1, note: "task 1", completed: true }, { id: 2, note: "task 2", completed: true }],
        filter: FilterType.All
    });
});
