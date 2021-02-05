export default class Header {
    constructor(username) {
        this.username = username;
        this.preRender();
    }

    preRender() {
        this.$dom = document.createElement('header');
        this.$dom.className = 'todo-header';
        this.$dom.innerHTML = this.html();
        this.$p = this.$dom.querySelector('p');
    }

    render($parent) {
        $parent.append(this.$dom);
    }

    changeWelcomeText(text) {
        this.$p.innerText = `어서오세요, ${text}님`;
    }

    html() {
        return `
            <p>${this.username ? `어서오세요, ${this.username}님` : `만나서 반갑습니다.`}</p>
        `
    }
}