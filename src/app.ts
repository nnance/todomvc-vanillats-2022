type ToDo = {
    id: number,
    completed: boolean,
    note: string,
}

const renderToDo = (todo: ToDo) => {
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

const renderToDos = (toDos: ToDo[]) => {
    return `
        <ul class="todo-list">
            ${toDos.map(renderToDo).reduce((prev, cur) => prev + cur)}
        </ul>
    `
}

const renderApp = () => {
	// Your starting point. Enjoy the ride!
    const main = window.document.querySelector('.main')
    const toDos: ToDo[] = [{
        id: 1,
        completed: true,
        note: "Taste JavaScript"
    }, {
        id: 2,
        completed: false,
        note: "Buy a unicorn"
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