import { CHANGE_DATE, CHANGE_TEMPLATE, REMOVE_TODO } from "../constant.js";
import { emitEvent } from "../helper.js";
import { EmptyDailyTemplate } from "../template/emptyDailyTemplate.js";
import { TodoTemplate } from "../template/todoTemplate.js";

export class Daily {
    constructor(date) {
        this.date = date;
        this.emptyTemplate = new EmptyDailyTemplate();
        this.isEmpty = true;
    }

    setDate(date) {
        this.date = date;
    }

    preRender() {
        document.title = `${this.getDate()} | Todo`;
        this.$dom = document.createElement('div');
        this.$dom.className = 'todo-today';
        this.$dom.innerHTML = this.html();
        this.$previous = this.$dom.querySelector('.previous');
        this.$next = this.$dom.querySelector('.next');
    }

    render($parent, todoData) {
        this.preRender();
        const hasData = Array.isArray(todoData) && todoData.length !== 0;
        this.todoData = todoData;
        hasData ? this.renderTodoTemplate() : this.renderEmptyTemplate();
        $parent.append(this.$dom);
        this.bindEvent();
    }

    remove() {
        this.$dom.remove();
    }

    bindEvent() {
        this.$dom.addEventListener(CHANGE_TEMPLATE, () => this.renderEmptyTemplate());
        this.$dom.addEventListener(REMOVE_TODO, (e) => { this.todoData = e.detail.data; });
        this.$previous.addEventListener('click', () => this.changeDate(-1));
        this.$next.addEventListener('click', () => this.changeDate(1));
    }

    getDate() {
        return `${this.date[0]} 월 ${this.date[1]} 일`;
    }

    html() {
        return `
            <div class="todo-today-title-div">
                <span class="change-date-span previous">&laquo;</span>
                <h2>${this.getDate()}</h2>
                <span class="change-date-span next">&raquo;</span>
            </div>
        `;
    }

    updateTodo(data) {
        if (Array.isArray(this.todoData)) {
            this.todoData.push(data)
        } else {
            this.todoData = [data];
        }

        this.isEmpty ? this.renderTodoTemplate() : this.todoTemplate.addTodo(data);
    }

    renderEmptyTemplate() {
        this.isEmpty = true;
        this.todoTemplate && this.todoTemplate.remove();
        this.emptyTemplate.render(this.$dom);
    }

    renderTodoTemplate() {
        this.emptyTemplate.remove();
        this.isEmpty = false;
        this.todoTemplate = new TodoTemplate(this.todoData);
        this.todoTemplate.render(this.$dom);
    }

    changeDate(direction) {
        emitEvent(CHANGE_DATE, 'data', direction);
    }
}