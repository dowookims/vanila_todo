import Controller from './controller/index.js';
import Model from './model/index.js';

class App {
    constructor() {
        this.$dom = document.getElementById('app');
        this.model = new Model();
        this.controller = new Controller(this.$dom, this.model);
    }
}

new App();