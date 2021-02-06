import Todo from "../component/todo.js";
import { CHANGE_TEMPLATE, REMOVE_TODO } from "../constant.js";
import { emitParent, openModal } from "../helper.js";

export class TodoTemplate {
    constructor(todoData) {
        this.todoData = todoData || [];
        this.todos = this.todoData.map(data => new Todo(data));
        this.preRender();
    }

    preRender() {
        this.$dom = document.createElement('div');
        this.$dom.className = 'todo-today-hastodo';
        this.$dom.innerHTML = this.html();
        this.$todoDom = this.$dom.querySelector('.todo-hastodo-body');
    }

    render(parent) {
        this.renderTodo();
        parent.append(this.$dom);
        this.bindEvent();
    }

    bindEvent() {
        this.$openModalBtn = this.$dom.querySelector(".todo-add-btn");
        this.$openModalBtn.addEventListener('click', () => openModal());
        this.$todoDom.addEventListener(REMOVE_TODO, e => this.removeTodoData(e.detail.data));
    }

    remove() {
        this.$dom.remove();
    }

    html() {
        return `
            <div class="todo-hastodo-header">
                <span class="todo-add-btn">+ Add todo</span>
            </div>
            <div class="todo-hastodo-body">
            </div>
            <div class="todo-donetodo-body"></div>
        `
    }

    renderTodo() {
        this.todos && this.todos.forEach(todo => {
            todo && todo.render(this.$todoDom);
        })
    }

    addTodo(data) {
        const todo = new Todo(data);
        todo.render(this.$todoDom);
    }

    removeTodoData(id) {
        this.todoData = this.todoData.filter(data => data.id !== id);
        emitParent(REMOVE_TODO, this.$dom.parentNode, this.todoData);
        if (this.todoData.length === 0) {
            emitParent(CHANGE_TEMPLATE, this.$dom.parentNode);
        }
    }
}