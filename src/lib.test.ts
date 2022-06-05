import { diff, applyPatches, PatchType } from "./lib";

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
    it("should return an array with a remove patch when the node is null", () => {
        const oldTree = document.createElement("div");
        const newTree = null;
        expect(diff(oldTree, newTree)).toHaveLength(1);
    });
    it("should return an array with a remove patch child count is different", () => {
        const oldTree = document.createElement("div");
        oldTree.innerHTML = `
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>`

        const newTree = document.createElement("div");
        newTree.innerHTML = `
        <ul>
            <li>1</li>
            <li>2</li>
        </ul>`
        expect(diff(oldTree, newTree)).toHaveLength(1);
    });
});

describe("applyPatches", () => {
    it("should append new node when missing child", () => {
        const newTree = document.createElement("section");
        const root = document.createElement("div");
        applyPatches(root, [{ type: PatchType.Append, node: newTree }]);
        expect(root.firstElementChild).toBe(newTree);
    });
    it("should replace the old node with the new node", () => {
        const oldTree = document.createElement("div");
        const newTree = document.createElement("section");
        const root = document.createElement("div");
        root.appendChild(oldTree);
        applyPatches(root, [{ type: PatchType.Replace, node: newTree }]);
        expect(root.firstElementChild).toBe(newTree);
    });
});