import { REMOVE_TODO, TOGGLE_TODO } from "../constant.js";
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
        if (todoData) {
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
                e.target.parentNode.parentNode.classList.toggle('done');
                emitEvent(TOGGLE_TODO, 'id', e.target.getAttribute('for'));
            } else if (e.target.className === 'todo-remove-btn') {
                this.remove(e.target);
            }
        })
    }

    getDate() {
        const today = new Date();
        return `${today.getMonth() + 1} 월 ${today.getDate()} 일`
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
        this.todoData = Array.isArray(this.todoData) ? this.todoData.push(data) : [data];
    }

    remove(target) {
        const id = target.getAttribute('for');
        emitEvent(REMOVE_TODO, 'id', id);
        target.parentNode.parentNode.remove();
        this.todoData.filter(todo => todo.id !== id);
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
        <div class="todo-daily ${data.done ? 'done' : ''}">
            <p class="todo-daily-title">
                <input id=${data.id} class="todo-daily-check" type="checkbox" ${data.done ? 'checked' : ''}/>
                <label for=${data.id} ></label>
                <span class="todo-title-span">${data.title}</span>
                <span class="todo-remove-btn">Remove</span>
            </p>
            <p class="todo-daily-description">${data.description}</p>
        </div>`
    }
}