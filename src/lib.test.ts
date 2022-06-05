import { diff, applyPatches } from "./lib";

describe("diff", () => {
    it("should return an empty array when the same node is passed", () => {
        const root = document.createElement("div");
        const oldTree = document.createElement("div");
        const newTree = document.createElement("div");
        expect(diff(root, oldTree, newTree)).toEqual([]);
    });
    it("should return an array with a replace patch when the node is different", () => {
        const root = document.createElement("div");
        const oldTree = document.createElement("div");
        const newTree = document.createElement("section");
        expect(diff(root, oldTree, newTree).filter(p => p.type === 'replace')).toHaveLength(1);
    });
    it("should return an array with a remove patch when the node is null", () => {
        const root = document.createElement("div");
        const oldTree = document.createElement("div");
        const newTree = null;
        expect(diff(root, oldTree, newTree).filter(p => p.type === 'remove')).toHaveLength(1);
    });
    it("should return an array with a append patch when the node is null", () => {
        const root = document.createElement("div");
        const newTree = document.createElement("div");
        const oldTree = null;
        expect(diff(root, oldTree, newTree).filter(p => p.type === 'append')).toHaveLength(1);
    });
    it("should return an array with a remove patch when child count is different", () => {
        const root = document.createElement("div");
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
        expect(diff(root, oldTree, newTree).filter(p => p.type === 'remove')).toHaveLength(1);
    });
});

describe("applyPatches", () => {
    it("should append new node when missing child", () => {
        const newNode = document.createElement("section");
        const parentNode = document.createElement("div");
        applyPatches([{ type: 'append', parentNode, newNode }]);
        expect(parentNode.firstElementChild).toBe(newNode);
    });
    it("should replace the old node with the new node", () => {
        const oldNode = document.createElement("div");
        const newNode = document.createElement("section");
        const parentNode = document.createElement("div");
        parentNode.appendChild(oldNode);
        applyPatches([{ type: 'replace', parentNode, newNode, oldNode }]);
        expect(parentNode.firstElementChild).toBe(newNode);
    });
});