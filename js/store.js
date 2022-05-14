export const createStore = (render) => {
    var store = [];
    const setter = (newValue) => {
        store = newValue;
        render(newValue);
    };
    return [
        store,
        setter
    ];
};
export const destroyItem = (store) => (id) => {
    const [toDos, setToDos] = store;
    setToDos(toDos.filter(toDo => toDo.id === id));
};
