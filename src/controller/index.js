import Modal from '../component/modal.js';
import { ADD_USERNAME, EDIT_TODO, NAME, OPEN_MODAL, REMOVE_TODO, SAVE_TODO, TOGGLE_TODO } from '../constant.js';
import View from '../view/view.js';

export default class Controller {
    constructor($app, model) {
        this.$app = $app;
        this.model = model
        this.username = this.model.getName();
        this.view = new View(this.username);
        this.modal = new Modal();
        this.render();
    }

    render() {
        const todayTodo = this.model.getTodayTodo();
        this.view.render(this.$app, todayTodo);
        this.modal.render(this.$app);
        this.bindEvent();
    }

    bindEvent() {
        this.$app.addEventListener(ADD_USERNAME, e => this._saveUserData(e));
        this.$app.addEventListener(OPEN_MODAL, () => this._openModal());
        this.$app.addEventListener(SAVE_TODO, (e) => this._saveTodo(e));
        this.$app.addEventListener(TOGGLE_TODO, (e) => this._toggleTodo(e));
        this.$app.addEventListener(REMOVE_TODO, (e) => this._removeTodo(e));
        this.$app.addEventListener(EDIT_TODO, (e) => this._editTodo(e));
    }

    _saveUserData(e) {
        this.model.saveData(NAME, e.detail.username);
        this.view.initDaily(e.detail.username);
    }

    _openModal() {
        this.modal.open();
    }

    _saveTodo(e) {
        const { data } = e.detail;
        const savedData = this.model.saveTodo(data);
        this.view.updateTodo(savedData);
    }

    _toggleTodo(e) {
        const { id } = e.detail;
        this.model.toggleTodo(id);
    }

    _removeTodo(e) {
        const { id } = e.detail;
        console.info(e.detail);
        this.model.removeTodo(id);
    }

    _editTodo(e) {
        const { data } = e.detail;
        this.model.editTodo(data);
    }
}