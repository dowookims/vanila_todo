import { InputUser } from '../pages/index.js'
import Header from '../component/header.js';
import { Daily } from '../pages/daily.js';
import Modal from '../component/modal.js';

export default class View {
    constructor(username) {
        this.username = username;
        this.preRender();
    }
    preRender() {
        this.$dom = document.createElement('main');
        this.header = new Header(this.username);
        this.page = this.page();
    }
    render($parent, todoData) {
        this.$parent = $parent;
        this.header.render($parent);
        this.page.render(this.$dom, todoData);
        $parent.append(this.$dom);
    }
    
    page() {
        return this.username ? new Daily() : new InputUser();
    }

    initDaily(username) {
        this.page.remove();
        this.page = new Daily();
        this.header.changeWelcomeText(username);
        this.render(this.$parent);
    }

    updateTodo(data) {
        this.page.updateTodo(data);
    }
}