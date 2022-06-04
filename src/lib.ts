export const diff = (oldTree: HTMLElement, newTree: HTMLElement) => {
    const patches: Patch[] = [];
    const walk = (oldNode: HTMLElement, newNode: HTMLElement) => {
        if (oldNode.nodeName !== newNode.nodeName) {
            patches.push ({
                id: oldNode.id,
                type: 'replace',
                node: newNode
            });
            return;
        }
        if (oldNode.nodeType === Node.ELEMENT_NODE) {
            const oldChildren = Array.from(oldNode.childNodes);
            const newChildren = Array.from(newNode.childNodes);
            for (let i = 0; i < oldChildren.length; i++) {
                walk(oldChildren[i] as HTMLElement, newChildren[i] as HTMLElement);
            }
        }
        if (oldNode.nodeType === Node.ATTRIBUTE_NODE) {
            if (oldNode.nodeValue !== newNode.nodeValue) {
                patches.push ({
                    id: oldNode.id,
                    type: 'replace',
                    node: newNode
                });
            }
        }
        if (oldNode.nodeType === Node.TEXT_NODE) {
            if (oldNode.nodeValue !== newNode.nodeValue) {
                patches.push({
                    id: oldNode.id,
                    type: 'replace',
                    node: newNode
                });
            }
        }
    }
    walk(oldTree, newTree);
    return patches;
}

type Patch = {
    id: string,
    type: 'replace' | 'remove' | 'append',
    node: HTMLElement
}

export const applyPatches = (patches: Patch[]) => {
    const root = document.getElementById('root');
    if (!root) {
        throw new Error('Root element not found');
    }
    patches.forEach(patch => {
        const node = document.getElementById(patch.id);
        if (!node) {
            throw new Error(`Node with id ${patch.id} not found`);
        }
        if (patch.type === 'replace') {
            root.replaceChild(patch.node, node);
        }
    });
}