import { SAVE_TODO } from "../constant.js";
import { emitEvent } from "../helper.js";

export default class Modal {
    constructor() {
        this.preRender();
    }

    preRender() {
        this.$dom = document.createElement('div');
        this.$dom.className = 'modal hide';
        this.$dom.innerHTML = this.html();
        this.$exit = this.$dom.querySelector('.exit');
        this.$overlay = this.$dom.querySelector('.overlay');
        this.$cancelButton = this.$dom.querySelector('.exit-button');
        this.$form = this.$dom.querySelector('.modal-form');
        this.$error;
    }

    render($parent) {
        $parent.append(this.$dom);
        this.bindEvent();
    }

    bindEvent() {
        const $titleInput = this.$form.querySelector('.todo-title-input');

        this.$form.addEventListener('submit', (e) => {
            e.preventDefault();
            const descriptionInput = this.$form.querySelector('.todo-description-input');
            if ($titleInput.value.length !== 0) {
                const data = {
                    title: $titleInput.value,
                    description: descriptionInput.value,
                    done: false,
                    removed: false
                };
                emitEvent(SAVE_TODO, 'data', data);
                $titleInput.value = '';
                descriptionInput.value = '';
                this.$dom.classList.add('hide');
            } else {
                alert('제목을 반드시 입력해야 합니다.');
            }
        });
        $titleInput.addEventListener('input', (e) => {
            if (e.target.value.length === 0) {
                if (this.$error) {
                    this.$error.classList.remove('hide');
                } else {
                    this.$error = document.createElement('p');
                    this.$error.classList.add('error');
                    this.$error.innerText = '제목을 반드시 입력해야 합니다.';
                    this.$form.insertBefore(this.$error, document.querySelector('.todo-description-input'));
                }
                this.titleError = true;
            } else {
                if (this.$error && this.titleError) {
                    this.$error.classList.add('hide')
                }
                this.titleError = false;
            }
        })
        this.$cancelButton.addEventListener('click', () => {
            this.$dom.classList.add('hide')
        })
        this.$exit.addEventListener('click', () => {
            this.$dom.classList.add('hide')
        });
        this.$overlay.addEventListener('click', () => {
            this.$dom.classList.add('hide')
        });
    };

    open() {
        this.$dom.classList.remove('hide');
    }

    html() {
        return `
            <div class="overlay"></div>
            <div class="content">
                <div class="modal-header">
                    <span class="exit">&times;</span>
                </div>
                <div class="modal-body">
                    <form class="modal-form">
                        <input class="todo-title-input" type="text" name="todo-title" autocomplete="off" placeholder="오늘의 할 일" required />
                        <input class="todo-description-input" type="text" name="description" autocomplete="off" placeholder="설명" />
                        <div class="modal-form-buttons">
                            <button class="save-button" type="submit">저장</button>
                            <button class="exit-button" type="button">취소</button>
                        </div>
                    </form>
                </div>
            </div>
        `
    }
}