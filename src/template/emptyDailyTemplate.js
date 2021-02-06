import { openModal } from "../helper.js";

export class EmptyDailyTemplate {
    constructor() {
        this.preRender()
    }

    preRender() {
        this.$dom = document.createElement('p');
        this.$dom.className = 'empty-daily-todo';
        this.$dom.innerHTML += this.html();
    }

    render(parent) {
        parent.append(this.$dom);
        this.bindEvent();
    }

    bindEvent() {
        this.$openModalBtn = this.$dom.querySelector(".high-light-text");
        this.$openModalBtn.addEventListener('click', () => openModal());
    }

    remove() {
        this.$dom.remove();
    }

    html() {
        return `
            <span>오늘은 어떤 일을 해 볼까요?</span>
            <span class="high-light-text">등록하기</span>
        `
    }
}