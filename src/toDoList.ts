import { Actions, ToDo } from "./types.js";

const renderToDo = (todo: ToDo, toggle: (todo: ToDo) => void) => {
    const { completed, note, id } = todo;

    const li = document.createElement('div');

    li.innerHTML = `
        <li ${completed ? `class="completed"` : ``}>
            <div class="view">
                <input class="toggle" type="checkbox" ${completed ? `checked` : ``} data-id="${id}">
                <label>${note}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="${id}">
        </li>
    `;

    li.querySelector('.toggle')?.addEventListener('click', () => toggle(todo));

    return li;
}

const renderToDos = (toDos: ToDo[], toDoToggle: (todo: ToDo) => void) => {

    const toDoElements = toDos.map(todo => {
        return renderToDo(todo, toDoToggle);
    });

    const ul = document.createElement('div');

    ul.innerHTML = `
        <ul class="todo-list">
        </ul>
    `;

    const parent = ul.firstElementChild as HTMLElement;
    toDoElements.forEach(li => parent.appendChild(li));

    return ul;
};

export const renderApp = (actions: Actions) => (toDos: ToDo[]) => {
	// Your starting point. Enjoy the ride!
    const main = document.querySelector('.main')

    const html = `
        <input id="toggle-all" class="toggle-all" type="checkbox">
        <label for="toggle-all">Mark all as complete</label>
    `

    if (main) {    
        main.innerHTML = html;
        main.appendChild(renderToDos(toDos, actions.toggleCompleted).firstElementChild as HTMLElement);

        main.querySelector('.toggle-all')?.addEventListener('click', actions.toggleAll);
    }
}
