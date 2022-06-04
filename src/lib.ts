export const diff = (oldTree: Element | null, newTree: Element) => {
    const patches: Patch[] = [];
    const walk = (oldNode: Element | null, newNode: Element) => {

        if (!oldNode && newNode) {
            patches.push((parent) => parent.appendChild(newNode));
            return;
        } else if (oldNode) {            
            if (oldNode.nodeName !== newNode.nodeName) {
                patches.push ((parent) => parent.replaceChild(newNode, oldNode));
                return;
            }
        }

    }
    walk(oldTree, newTree);
    return patches;
}

type Patch = (parentNode: ParentNode) => Element;

export const applyPatches = (root: HTMLElement, patches: Patch[]) => {
    patches.forEach(patch => {
        patch(root);
    });
}