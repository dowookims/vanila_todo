import { ADD_USERNAME } from "../constant.js";
import { emitEvent } from "../helper.js";

export default class InputUser {
    constructor() {
        this.$dom = null;
        this.preRender();
    }

    preRender() {
        this.$dom = document.createElement('div');
        this.$dom.innerHTML = this.html();
        this.$form = this.$dom.querySelector('form');
        this.$label = this.$dom.querySelector('label');
        this.$input = this.$dom.querySelector('input');
        this.$p = this.$dom.querySelector('p');
        this.$dom.className = 'todo-input-page';
    }

    render(parent) {
        parent.append(this.$dom);
        this.bindEvent();
    }

    bindEvent() {
        let block = false;
        this.$form.addEventListener('submit', (event) => {
            event.preventDefault();
            emitEvent(ADD_USERNAME, 'username', this.$input.value)
        });

        this.$input.addEventListener('focus', () => {
            if (this.$input.value.length === 0) {
                this.$label.className = 'name-input-clicked';
            }
        });

        this.$input.addEventListener('blur', () => {
            this.$label.classList.remove('name-input-clicked');
        });

        this.$input.addEventListener('input', (event) => {
            if (event.target.value.length > 0) {
                if (block) {
                    return ;
                }
                block = true;
                this.$p.classList.toggle('hidden');
                this.$label.classList.toggle('hidden');
                return;
            }

            if (!block) {
                return 
            }

            block = false;
            this.$p.classList.toggle('hidden');
            this.$label.classList.toggle('hidden');
        })
    }

    html() {
        return `
            <form class="input-username-form">
                <label for="input-name">닉네임을 입력 해 주세요.</label>
                <input
                    id="input-name"
                    class="input-name"
                    type="text"
                    name="name"
                    placeholder="닉네임을 입력 해 주세요."
                    autocomplete="off"
                    required
                />
                <p class="hidden end-user-input">입력이 끝났으면 엔터를 눌러주세요.</p>
            </form>
        `
    }

    remove() {
        this.$dom.remove();
    }
}