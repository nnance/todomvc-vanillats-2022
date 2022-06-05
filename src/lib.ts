export const diff = (parentNode: Element, oldTree: Element | null, newTree: Element | null) => {
    
    const walk = (parentNode: Element, oldNode: Element | null, newNode: Element | null, patches: Patch[] = []): Patch[] => {
        if (oldNode === null && newNode !== null) {
            return [...patches, { type: 'append', parentNode, newNode }];
        }
        if (newNode === null && oldNode !== null) {
            return [...patches, { type: 'remove', oldNode, parentNode }];
        }
        if (oldNode && newNode) {
            if (oldNode.tagName !== newNode.tagName) {
                return [...patches, { type: 'replace', parentNode, oldNode, newNode }];
            }
            if (oldNode.nodeType === Node.ELEMENT_NODE) {
                const oldChildren = Array.from(oldNode.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);
                const newChildren = Array.from(newNode.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);

                const children = oldChildren.length > newChildren.length ? oldChildren : newChildren;
                return children.reduce((patches, child, i) => {
                    const oldChild = oldChildren.length > i ? oldChildren[i] as HTMLElement : null;
                    const newChild = newChildren.length > i ? newChildren[i] as HTMLElement : null;
                    return [...walk(oldNode, oldChild, newChild, patches)];
                }, patches);
            }
            if (oldNode.nodeType === Node.ATTRIBUTE_NODE) {
                if (oldNode.nodeValue !== newNode.nodeValue) {
                    return [...patches, { type: 'replace', parentNode, oldNode, newNode }];
                }
            }
            if (oldNode.nodeType === Node.TEXT_NODE) {
                if (oldNode.nodeValue !== newNode.nodeValue) {
                    return [...patches, { type: 'replace', parentNode, oldNode, newNode }];
                }
            }
        }
        return patches;
    }
    
    return walk(parentNode, oldTree, newTree);
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