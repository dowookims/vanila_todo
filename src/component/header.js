import { EDIT_USERNAME } from "../constant.js";
import { emitEvent } from "../helper.js";

export default class Header {
    constructor(username) {
        this.username = username;
        this.preRender();
    }

    preRender() {
        this.$dom = document.createElement('header');
        this.$dom.className = 'todo-header';
        this.$dom.innerHTML = this.html();
        this.$p = this.$dom.querySelector('p');
        this.$username = this.$dom.querySelector('.user-name');
    }

    render($parent) {
        $parent.append(this.$dom);
        this.bindEvent();
    }

    bindEvent() {
        this.$username.addEventListener('click', (e) => this.editUserName(e.target));
    }

    changeWelcomeText(text) {
        this.$p.innerText = `어서오세요, ${text}님`;
    }

    html() {
        return `
            <p>${this.username ? `어서오세요, <span class="user-name">${this.username}님</span>` : `만나서 반갑습니다.`}</p>
        `
    }

    editUserName(target) {
        const $textarea = document.createElement('textarea');
        const text = target.innerText.slice(0, target.innerText.length - 1);
        const id = target.parentNode.dataset.id;
        target.innerHTML = '';
        $textarea.value = text;
        $textarea.className = 'edit-username';
        target.append($textarea)
        $textarea.focus();

        function emitChangeEvent () {
            const changedText = $textarea.value;
            if (changedText.length === 0) {
                target.innerText = text + '님';
                return;
            }
            emitEvent(EDIT_USERNAME, 'username', changedText)
            $textarea.removeEventListener('keypress', keyPressEvent);
            $textarea.removeEventListener('focusout', focusOutEvent);
            target.innerText = changedText + '님';
            $textarea.remove();
        }

        function keyPressEvent (evt)  {
            if (evt.code === 'Enter') {
                emitChangeEvent();
            }
        }

        function focusOutEvent () {
            emitChangeEvent();
        }

        $textarea.addEventListener('keypress', keyPressEvent);
        $textarea.addEventListener('focusout', focusOutEvent);
    }
}