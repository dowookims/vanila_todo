import { NAME } from '../constant.js';

export default class Model {
    
    constructor() {
        const today = new Date();
        this.today = [today.getMonth() + 1, today.getDate()];
        this.todoData = this.getTodayTodo();
        this.nameData = this.loadData(NAME);
    }

    loadData(key) {
        const data = localStorage.getItem(key);
        if (data && data[0] === '{' || data && data[0] === '[') {
            return JSON.parse(data)    
        }
        return data || null;
    }

    getName() {
        return this.nameData;
    }

    setName(name) {
        this.nameData = name;
        this.saveData(NAME, name)
    }

    saveData(key, value) {
        localStorage.setItem(key, value);
    }

    saveTodo(data) {
        data.id = Math.random().toString(36).substr(2, 9);
        let todoData = this.getTodayTodo();
        if (!todoData) {
            todoData = [];
        }
        todoData.push(data);
        this.saveTodayTodo(todoData);
        return data;
    }

    getTodayTodo() {
        const TODAY_TODO_KEY = this.getTodayTodoKey();
        const todoData = this.loadData(TODAY_TODO_KEY);
        return todoData;
    }

    toggleTodo(id) {
        let changedData;
        let todoData = this.getTodayTodo();
        const filteredTodo = todoData.filter(todo => {
            if (todo.id === id) {
                changedData = todo;
                changedData.done = !changedData.done;
            }
            return todo.id !== id
        });
        filteredTodo.push(changedData);
        this.saveTodayTodo(filteredTodo);
    };

    saveTodayTodo(data) {
        const TODAY_TODO_KEY = this.getTodayTodoKey();
        localStorage.setItem(TODAY_TODO_KEY, JSON.stringify(data));
    }

    getTodayTodoKey() {
        const [month, date] = this.today;
        return `todo${month}-${date}`;
    }

    removeTodo(id) {
        let todoData = this.getTodayTodo();
        const filteredTodo = todoData.filter(todo => todo.id !== id);
        const TODAY_TODO_KEY = this.getTodayTodoKey();
        localStorage.setItem(TODAY_TODO_KEY, JSON.stringify(filteredTodo));
    }

    editTodo(data) {
        const { id, field, content } = data;
        let changedData;
        let todoData = this.getTodayTodo();
        const filteredTodo = todoData.filter(todo => {
            if (todo.id === id) {
                changedData = todo;
                changedData[field] = content;
            }
            return todo.id !== id
        });
        filteredTodo.push(changedData);
        this.saveTodayTodo(filteredTodo);
    }
}