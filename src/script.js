class Canvas {
    constructor() {
        const canvas = document.getElementById("canvas");
        canvas.style.backgroundColor = "#fafafa";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = document.getElementById("canvas").getContext("2d");

        this.font_size = 32; //px
        this.text_margin = 10; //px
    }

    create_block(text, x, y) {
        console.log(this.font)
        this.ctx.font = `${String(this.font_size)}px Ubuntu`;
        const text_size = this.ctx.measureText(text);

        this.ctx.fillStyle = "pink";
        this.ctx.fillRect(x - this.text_margin, y - this.font_size - this.text_margin, text_size.width + (this.text_margin * 2), this.text_margin * 2 + this.font_size)

        this.ctx.fillStyle = "black";
        this.ctx.fillText(text, x, y);

        console.log(text_size)
    }
}



window.onload = () => {
    const canvas = new Canvas();
    canvas.create_block("Hello world !!", 30, 50);
};
