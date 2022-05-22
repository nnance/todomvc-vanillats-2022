import { Action, ActionTypes, AppState } from "./types.js"

export const reducer = (state: AppState, action: Action<ActionTypes>): AppState => {
    switch (action.type) {
        case ActionTypes.ToggleAll:
            return { ...state, toDos: state.toDos.map(t => ({ ...t, completed: true })) }
        case ActionTypes.ToggleCompleted:
            return { ...state, toDos: state.toDos.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t) }
        case ActionTypes.AddItem:
            return { ...state, toDos: [...state.toDos, { id: Date.now(), completed: false, note: action.payload }] }
        case ActionTypes.DestroyItem:
            return { ...state, toDos: (state.toDos.filter(t => t.id !== action.payload)) }
        case ActionTypes.SetFilter:
            return { ...state, filter: action.payload }
        default:
            return state;
    }
}

