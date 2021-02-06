import { OPEN_MODAL } from './constant.js';

export function emitEvent(eventName, key, value) {
    const event = new CustomEvent(eventName, {
        detail: {
            [key]: value
        }
    });
    const app = document.getElementById('app');
    app.dispatchEvent(event);
}

export function openModal() {
    emitEvent(OPEN_MODAL);
}

export function emitParent(eventName, target, data) {
    const event = new CustomEvent(eventName, { detail: { data } });
    target.dispatchEvent(event);
}