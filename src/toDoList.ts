export type ToDo = {
    id: number,
    completed: boolean,
    note: string,
}

export const renderToDo = (todo: ToDo) => {
    const { completed, note, id } = todo;
    return `
        <li ${completed ? `class="completed"` : ``}>
            <div class="view">
                <input class="toggle" type="checkbox" ${completed ? `checked` : ``}>
                <label>${note}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="${id}">
        </li>
    `
}

export const renderToDos = (toDos: ToDo[]) => {
    return `
        <ul class="todo-list">
            ${toDos.map(renderToDo).reduce((prev, cur) => prev + cur)}
        </ul>
    `
}