import { diff, applyPatches } from "./lib";

describe("diff", () => {
    it("should return an empty array when the same node is passed", () => {
        const oldTree = document.createElement("div");
        const newTree = document.createElement("div");
        expect(diff(oldTree, newTree)).toEqual([]);
    });
    it("should return an array with a replace patch when the node is different", () => {
        const oldTree = document.createElement("div");
        const newTree = document.createElement("section");
        expect(diff(oldTree, newTree)).toEqual([{
            id: oldTree.id,
            type: "replace",
            node: newTree
        }]);
    });
    it("should return an array with a remove patch when the node is different", () => {
        const oldTree = document.createElement("div");
        const newTree = document.createElement("label");
        expect(diff(oldTree, newTree)).toEqual([{
            id: oldTree.id,
            type: "remove",
            node: oldTree
        }]);
    });
    it("should return an array with an append patch when the node is different", () => {
        const oldTree = document.createElement("div");
        const newTree = document.createElement("label");
        expect(diff(oldTree, newTree)).toEqual([{
            id: oldTree.id,
            type: "append",
            node: newTree
        }]);
    });
});
