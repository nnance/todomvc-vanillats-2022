export const diff = (oldTree: Element | null, newTree: Element | null) => {
    const patches: Patch[] = [];
    const walk = (oldNode: Element | null, newNode: Element | null) => {

        if (!oldNode && newNode) {
            patches.push({
                type: PatchType.Append,
                node: newNode
            })
            return;
        } else if (oldNode && !newNode) {
            patches.push({
                type: PatchType.Remove,
                node: oldNode
            });
            return;
        } else if (oldNode && newNode) {            
            if (oldNode.nodeName !== newNode.nodeName) {
                patches.push ({
                    type: PatchType.Replace,
                    node: newNode,
                });
                return;
            }
            const oldChildren = oldNode.childNodes;
            const newChildren = newNode.childNodes;
            for (let i = 0; i < oldChildren.length; i++) {
                walk(oldChildren[i] as Element, newChildren[i] as Element);
            }
        }

    }
    walk(oldTree, newTree);
    return patches;
}

export enum PatchType {
    Append,
    Remove,
    Replace
}

export type Patch = {
    type: PatchType,
    node: Element,
}

export const applyPatches = (root: HTMLElement, patches: Patch[]) => {
    const applyPatch = (parent: HTMLElement, patch: Patch) => {
        if (patch.type === PatchType.Append) {
            parent.appendChild(patch.node);
        } else if (patch.type === PatchType.Remove) {
            parent.removeChild(patch.node);
        } else if (patch.type === PatchType.Replace) {
            parent.replaceChild(patch.node, patch.node);
        }
    };

    patches.forEach(patch => {
        applyPatch(root, patch);
    });
}