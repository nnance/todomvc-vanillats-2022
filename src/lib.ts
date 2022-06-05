export const diff = (parentNode: Element, oldTree: Element | null, newTree: Element | null) => {
    const patches: Patch[] = [];
    const walk = (parentNode: Element, oldNode: Element | null, newNode: Element | null) => {
        if (oldNode === null && newNode !== null) {
            patches.push({ type: 'append', parentNode, newNode });
            return;
        } else if (newNode === null && oldNode !== null) {
            patches.push({ type: 'remove', oldNode, parentNode });
            return;
        } else if (oldNode && newNode) {
            if (oldNode.tagName !== newNode.tagName) {
                patches.push ({ type: 'replace', parentNode, oldNode, newNode });
                return;
            }
            if (oldNode.nodeType === Node.ELEMENT_NODE) {
                const oldChildren = Array.from(oldNode.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);
                const newChildren = Array.from(newNode.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);
                for (let i = 0; i < oldChildren.length; i++) {
                    const oldChild = oldChildren.length > i ? oldChildren[i] : null;
                    const newChild = newChildren.length > i ? newChildren[i] : null;
                    walk(oldNode, oldChild as HTMLElement, newChild as HTMLElement);
                }
            }
            if (oldNode.nodeType === Node.ATTRIBUTE_NODE) {
                if (oldNode.nodeValue !== newNode.nodeValue) {
                    patches.push ({ type: 'replace', parentNode, oldNode, newNode });
                }
            }
            if (oldNode.nodeType === Node.TEXT_NODE) {
                if (oldNode.nodeValue !== newNode.nodeValue) {
                    patches.push({ type: 'replace', parentNode, oldNode, newNode });
                }
            }
        }
    }
    walk(parentNode, oldTree, newTree);
    return patches;
}

type Patch = {
    type: 'replace' | 'remove' | 'append',
    parentNode: ParentNode,
    newNode?: Element,
    oldNode?: Element,
}

export const applyPatches = (patches: Patch[]) => {
    patches.forEach(patch => {
        const { type, newNode, oldNode, parentNode } = patch;

        if (type === 'replace' && newNode && oldNode && parentNode) {
            parentNode.replaceChild(newNode, oldNode);
        } else if (type === 'remove' && oldNode && parentNode) {
            parentNode.removeChild(oldNode);
        } else if (type === 'append' && newNode && parentNode) {
            parentNode.appendChild(newNode);
        }
    });
}