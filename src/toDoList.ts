import { ToDo } from "./store.js";

export const renderToDo = (todo: ToDo, toggle: (todo: ToDo) => void) => {
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

export const toDoController = (model: ToDo, view: HTMLElement) => {
    const el = view.querySelector('.toggle') as HTMLInputElement;
    if (el) {
        console.log("selector found")
        el.addEventListener('click', () => {
            console.log("toggle clicked")
            model.completed = !model.completed;
            model.completed ? view.classList.add('completed') : view.classList.remove('completed');
        });
    }
}

export const renderToDos = (toDos: ToDo[], toggle: (todo: ToDo) => void) => {
    const toDoElements = toDos.map(todo => {
        const view = renderToDo(todo, toggle);
        // toDoController(todo, view);
        return view;
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