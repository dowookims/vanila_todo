import { EDIT_TODO, REMOVE_TODO, TOGGLE_TODO } from "../constant.js";
import { emitEvent, emitParent } from "../helper.js";

export default class Todo {
    constructor(data) {
        this.data = data;
        this.preRender();
    }

    preRender() {
        this.$dom = document.createElement('div');
        this.$dom.className = `todo-daily ${this.data.done ? 'done' : ''}`;
        this.$dom.dataset.id = this.data.id;
        this.$dom.innerHTML = this.html();
    }

    render(parent) {
        parent.append(this.$dom);
        this.bindEvent();
    }

    bindEvent() {
        this.$dom.addEventListener('click', (e) => {
            if (e.target.tagName === 'LABEL') {
                this.toggleTodo(e.target);
            } else if (e.target.className === 'todo-remove-btn') {
                this.remove(e.target);
            } else if (e.target.className === 'todo-title-p' || e.target.className === 'todo-daily-description') {
                this.todoEditable(e.target);
            }
        })
    }

    html() {
        return `
            <div class="todo-daily-title" data-id=${this.data.id}>
                <input id=${this.data.id} class="todo-daily-check" type="checkbox" ${this.data.done ? 'checked' : ''}/>
                <label for=${this.data.id} ></label>
                <p class="todo-title-p" data-field="title">${this.data.title}</p>
                <span class="todo-remove-btn">❌</span>
            </div>
            <p class="todo-daily-description" data-field="description">${this.data.description || '&plus;'}</p>
        `
    }

    remove(target) {
        const isDelete = confirm('정말 삭제하시겠습니까?');
        if (!isDelete) {
            return;
        }
        const id = target.parentNode.dataset.id;
        emitEvent(REMOVE_TODO, 'id', id);
        emitParent(REMOVE_TODO, this.$dom.parentNode, id);
        this.$dom.remove();
    }

    toggleTodo(target) {
        target.parentNode.parentNode.classList.toggle('done');
        emitEvent(TOGGLE_TODO, 'id', target.getAttribute('for'));
    }

    todoEditable(target) {
        const $textarea = document.createElement('textarea');
        const text = target.innerText;
        const id = target.parentNode.dataset.id;
        target.innerHTML = '';
        $textarea.value = text;
        $textarea.className = 'editable-todo';
        target.append($textarea)
        $textarea.focus();

        function emitChangeEvent (field) {
            const changedText = $textarea.value;
            if (changedText.length === 0) {
                return;
            }
            emitEvent(EDIT_TODO, 'data', {
                id,
                field,
                content: changedText
            });
            $textarea.removeEventListener('keypress', keyPressEvent);
            $textarea.removeEventListener('focusout', focusOutEvent);
            target.innerText = changedText;
            $textarea.remove();
        }

        function keyPressEvent (evt)  {
            if (evt.code === 'Enter') {
                emitChangeEvent(target.dataset.field);
            }
        }

        function focusOutEvent () {
            emitChangeEvent(target.dataset.field);
        }

        $textarea.addEventListener('keypress', keyPressEvent);
        $textarea.addEventListener('focusout', focusOutEvent);
    }
}