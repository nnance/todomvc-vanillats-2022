import { ToDo, renderToDos } from "./toDoList.js"

const renderApp = () => {
	// Your starting point. Enjoy the ride!
    const main = window.document.querySelector('.main')
    const toDos: ToDo[] = [{
        id: 1,
        completed: true,
        note: "Add TypeScript"
    }, {
        id: 2,
        completed: false,
        note: "Make Modules Work"
    }]

    if (main) {
        main.innerHTML = `
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
            ${renderToDos(toDos)}
        `
    }
}

renderApp();