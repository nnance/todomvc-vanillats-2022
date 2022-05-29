import { AppState, FilterType } from "./types";
import { containerView } from "./views";

test("TODO", () => {
    const dispatch = () => { };
    const state: AppState = {
        toDos: [{ id: 1, note: "task 1", completed: true }, { id: 2, note: "task 2", completed: false }],
        filter: FilterType.All
    };

    const container = containerView(dispatch)(state.filter, state.toDos);

    expect(container.hasChildNodes()).toBe(true);
});
