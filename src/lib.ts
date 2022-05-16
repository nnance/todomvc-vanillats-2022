export const createElement = (html: string): HTMLElement => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild as HTMLElement;
}

export type DelegateHandler = (event?: Event, el?: HTMLElement) => void;

export const addListener = (el: HTMLElement, selector: string, event: string, handler: DelegateHandler) => {
    el.querySelector(selector)?.addEventListener(event, e => {
        handler(e, el);
    });
}