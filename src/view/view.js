import { InputUser } from '../pages/index.js'
import Header from '../component/header.js';
import { Daily } from '../pages/daily.js';

export default class View {
    constructor(username) {
        this.username = username;
    }
    preRender() {
        this.$dom = document.createElement('main');
        this.header = new Header(this.username);
        this.page = this.pages();
    }

    render($parent, todoData, date) {
        this.date = date;
        this.preRender();
        this.$parent = $parent;
        this.header.render($parent);
        this.page.render(this.$dom, todoData);
        $parent.append(this.$dom);
    }
    
    pages() {
        return this.username ? new Daily(this.date) : new InputUser();
    }

    initDaily(username, date) {
        this.page.remove();
        this.page = new Daily(date);
        this.username = username;
        this.header.remove();
        this.render(this.$parent, [], date);
    }

    updateTodo(data) {
        this.page.updateTodo(data);
    }

    changeDate(todoData, date) {
        this.page.remove();
        this.page.setDate(date);
        this.page.render(this.$dom, todoData);
    }
}