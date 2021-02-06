import Todo from "../component/todo.js";
import { CHANGE_TEMPLATE, REMOVE_TODO, TOGGLE_TODO } from "../constant.js";
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
        this.$finDom = this.$dom.querySelector('.todo-donetodo-body');
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
        this.$dom.addEventListener(TOGGLE_TODO, e => this.toggleTodo(e));
    }

    remove() {
        this.$dom.remove();
    }

    html() {
        return `
            <div class="todo-hastodo-header">
                <span class="todo-add-btn">+ Add todo</span>
                <h3>
                    <span>Todays </span>
                    <span>Tasks</span>
                </h3>
            </div>
            <div class="todo-hastodo-body">
            </div>
            <div class="todo-donetodo-body">
                <div class="todo-donetodo-title">
                    <h3>
                        <span>Finished</span>
                        <span>Task</span>
                    </h3>
                </div>
            </div>
        `
    }

    renderTodo() {
        this.todos && this.todos.forEach(todo => {
            if (todo) {
                if (todo.data.done) {
                    todo.render(this.$finDom);
                } else {
                    todo.render(this.$todoDom);
                }
            }
        })
    }

    toggleTodo(e) {
        const { data, dom } = e.detail.data;
        data.done = !data.done;
        if (data.done) {
            this.addTodo(data, this.$finDom)
        } else {
            this.addTodo(data, this.$todoDom);
        }
        dom.remove();
    }

    addTodo(data, parent) {
        const target = parent || this.$todoDom;
        const todo = new Todo(data);
        todo.render(target);
    }

    removeTodoData(id) {
        this.todoData = this.todoData.filter(data => data.id !== id);
        emitParent(REMOVE_TODO, this.$dom.parentNode, this.todoData);
        if (this.todoData.length === 0) {
            emitParent(CHANGE_TEMPLATE, this.$dom.parentNode);
        }
    }
}