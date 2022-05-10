export const createStore = (render) => {
    var store = [];
    const setter = (newValue) => {
        render(newValue);
        store = newValue;
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
