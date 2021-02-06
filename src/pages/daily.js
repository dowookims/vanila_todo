import { CHANGE_TEMPLATE, REMOVE_TODO } from "../constant.js";
import { EmptyDailyTemplate } from "../template/emptyDailyTemplate.js";
import { TodoTemplate } from "../template/todoTemplate.js";

export class Daily {
    constructor(todoData) {
        this.date = this.getDate();
        this.preRender();
        this.emptyTemplate = new EmptyDailyTemplate();
        this.isEmpty = Boolean(todoData);
        this.todoData = Array.isArray(todoData) ? todoData : [];
    }
    preRender() {
        document.title = `${this.date} | Todo`;
        this.$dom = document.createElement('div');
        this.$dom.className = 'todo-today';
        this.$dom.innerHTML = this.html();
    }

    render($parent, todoData) {
        const hasData = Array.isArray(todoData) && todoData.length !== 0;
        this.todoData = todoData;
        hasData ? this.renderTodoTemplate() : this.renderEmptyTemplate();
        $parent.append(this.$dom);
        this.bindEvent();
    }

    bindEvent() {
        this.$dom.addEventListener(CHANGE_TEMPLATE, () => this.renderEmptyTemplate());
        this.$dom.addEventListener(REMOVE_TODO, (e) => {
            this.todoData = e.detail.data;
        });
    }

    getDate() {
        const today = new Date();
        return `${today.getMonth() + 1} 월 ${today.getDate()} 일`;
    }

    html() {
        return `
            <div class="todo-today-title-div">
                <h2>${this.date}</h2>
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
}