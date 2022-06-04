import { diff, applyPatches } from "./lib";

describe.only("diff", () => {
    it("should return an empty array when the same node is passed", () => {
        const oldTree = document.createElement("div");
        const newTree = document.createElement("div");
        expect(diff(oldTree, newTree)).toEqual([]);
    });
    it("should return an array with a replace patch when the node is different", () => {
        const oldTree = document.createElement("div");
        const newTree = document.createElement("section");
        expect(diff(oldTree, newTree)).toHaveLength(1);
    });
});

describe.only("applyPatches", () => {
    it("should append new node when missing child", () => {
        const newTree = document.createElement("section");
        const root = document.createElement("div");
        applyPatches(root, [(parentNode) => parentNode.appendChild(newTree)]);
        expect(root.firstElementChild).toBe(newTree);
    });
    it("should replace the old node with the new node", () => {
        const oldTree = document.createElement("div");
        const newTree = document.createElement("section");
        const root = document.createElement("div");
        root.appendChild(oldTree);
        applyPatches(root, [(parentNode) => parentNode.replaceChild(newTree, oldTree)]);
        expect(root.firstElementChild).toBe(newTree);
    });
});