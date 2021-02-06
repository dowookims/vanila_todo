import { InputUser } from '../pages/index.js'
import Header from '../component/header.js';
import { Daily } from '../pages/daily.js';
import Modal from '../component/modal.js';

export default class View {
    constructor(username) {
        this.username = username;
    }
    preRender() {
        this.$dom = document.createElement('main');
        this.header = new Header(this.username);
        this.page = this.page();
    }

    render($parent, todoData, date) {
        this.date = date;
        this.preRender();
        this.$parent = $parent;
        this.header.render($parent);
        this.page.render(this.$dom, todoData);
        $parent.append(this.$dom);
    }
    
    page() {
        return this.username ? new Daily(this.date) : new InputUser();
    }

    initDaily(username) {
        this.page.remove();
        this.page = new Daily(this.date);
        this.header.changeWelcomeText(username);
        this.render(this.$parent);
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