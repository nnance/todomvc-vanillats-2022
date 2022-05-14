export const renderToDo = (todo) => {
    const { completed, note, id } = todo;
    return `
        <li ${completed ? `class="completed"` : ``}>
            <div class="view">
                <input class="toggle" type="checkbox" ${completed ? `checked` : ``} data-id="${id}">
                <label>${note}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="${id}">
        </li>
    `;
};
export const toDoController = (model, view) => {
    const el = view.querySelector('.toggle');
    if (el) {
        console.log("selector found");
        el.addEventListener('click', () => {
            console.log("toggle clicked");
            model.completed = !model.completed;
            model.completed ? view.classList.add('completed') : view.classList.remove('completed');
        });
    }
};
export const renderToDos = (toDos) => {
    const toDoElements = toDos.map(todo => {
        const view = document.createElement('li');
        view.innerHTML = renderToDo(todo);
        toDoController(todo, view);
        return view;
    });
    const ul = document.createElement('ul');
    ul.innerHTML = `
        <ul class="todo-list">
            ${toDoElements.reduce((prev, cur) => prev + cur.innerHTML, '')}
        </ul>
    `;
    return ul;
};
