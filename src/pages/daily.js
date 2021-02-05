import { EDIT_TODO, REMOVE_TODO, TOGGLE_TODO } from "../constant.js";
import { emitEvent, openModal } from "../helper.js";

export class Daily {
    constructor() {
        this.date = this.getDate();
        this.preRender();
    }
    preRender() {
        document.title = `${this.date} | Todo`;
        this.$dom = document.createElement('div');
        this.$dom.className = 'todo-today';
        this.$dom.innerHTML = this.html();
    }
    render($parent, todoData) {
        if (Array.isArray(todoData) && todoData.length !== 0) {
            this.$dom.innerHTML += this.todoHtml(todoData);
            this.$innerDom = this.$dom.querySelector('.todo-today-hastodo');
            this.$openModalBtn = this.$dom.querySelector(".todo-add-btn");
            this.$todoDom = this.$dom.querySelector(".todo-hastodo-body");
        } else {
            this.$dom.innerHTML += this.emptyTodoHtml();
            this.$innerDom = this.$dom.querySelector('.empty-daily-todo');
            this.$openModalBtn = this.$dom.querySelector(".high-light-text");
        }
        $parent.append(this.$dom);
        
        this.bindEvent();
    }

    bindEvent() {
        this.$openModalBtn.addEventListener('click', () => {
            openModal();
        });

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

    toggleTodo() {
        target.parentNode.parentNode.classList.toggle('done');
        emitEvent(TOGGLE_TODO, 'id', target.getAttribute('for'));
    }

    getDate() {
        const today = new Date();
        return `${today.getMonth() + 1} 월 ${today.getDate()} 일`
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

    html() {
        return `
            <div class="todo-today-title-div">
                <h2>${this.date}</h2>
            </div>
        `;
    }

    updateTodo(data) {
        if (!this.$todoDom) {
            this.$innerDom.remove();
            this.$dom.innerHTML += this.todoHtml();
            this.$innerDom = this.$dom.querySelector('.todo-today-hastodo');
            this.$openModalBtn = this.$dom.querySelector(".todo-add-btn");
            this.$todoDom = this.$dom.querySelector(".todo-hastodo-body");
            
        }
        this.$todoDom.innerHTML += this.todoDom(data);
        if (Array.isArray(this.todoData)) {
            this.todoData.push(data)
        } else {
            this.todoData = [data];
        }
    }

    remove(target) {
        const isDelete = confirm('정말 삭제하시겠습니까?');
        if (!isDelete) {
            return;
        }
        const id = target.parentNode.dataset.id;
        emitEvent(REMOVE_TODO, 'id', id);
        target.parentNode.parentNode.remove();
        this.todoData = this.todoData.filter(todo => todo.id !== id);
        if (!Array.isArray(this.todoData) || this.todoData.length === 0) {
            this.$innerDom.remove();
            this.$dom.innerHTML += this.emptyTodoHtml();
            this.$innerDom = this.$dom.querySelector('.empty-daily-todo');
            this.$openModalBtn = this.$dom.querySelector(".high-light-text");
            this.$openModalBtn.addEventListener('click', () => {
                openModal();
            });
        }
    }

    emptyTodoHtml() {
        return `
            <p class="empty-daily-todo">
                <span>오늘은 어떤 일을 해 볼까요?</span>
                <span class="high-light-text">등록하기</span>
            </p>
        `
    }

    todoHtml(todoData) {
        this.todoData = Array.isArray(todoData) ? todoData : [];
        return `
            <div class="todo-today-hastodo">
                <div class="todo-hastodo-header">
                    <span class="todo-add-btn">+ Add todo</span>
                </div>
                <div class="todo-hastodo-body">
                    ${Array.isArray(todoData) ? todoData.map(data => this.todoDom(data)).join('') : ''}
                </div>
            </div>
        `
    }

    todoDom(data) {
        return `
        <div class="todo-daily ${data.done ? 'done' : ''}" data-id=${data.id}>
            <div class="todo-daily-title" data-id=${data.id}>
                <input id=${data.id} class="todo-daily-check" type="checkbox" ${data.done ? 'checked' : ''}/>
                <label for=${data.id} ></label>
                <p class="todo-title-p" data-field="title">${data.title}</p>
                <span class="todo-remove-btn">Remove</span>
            </div>
            <p class="todo-daily-description" data-field="description">${data.description || '&plus;'}</p>
        </div>`
    }
}