import { renderToDos } from "./toDoList.js";
import { createStore } from "./store.js";
const renderApp = (store) => {
    // Your starting point. Enjoy the ride!
    const main = window.document.querySelector('.main');
    if (main) {
        main.innerHTML = `
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
            ${renderToDos(store)}
        `;
    }
};
const [store, setStore] = createStore(renderApp);
setStore([{
        id: 1,
        completed: true,
        note: "Add TypeScript"
    }, {
        id: 2,
        completed: false,
        note: "Make Modules Work"
    }, {
        id: 3,
        completed: false,
        note: "Render on store change"
    }
]);
