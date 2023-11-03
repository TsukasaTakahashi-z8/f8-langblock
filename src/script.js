function getData() {
    const json = `
{
    "blocks": {
        "0": {
            "text": "",
            "block": "third_sentence",
            "S": "1",
            "V": "2",
            "O": "4",
            "front_child": "[]",
            "rear_child": "[]"
        },
        "1": {
            "text": "I",
            "pos": "NOUN",
            "block": "noun",
            "front_child": "[]",
            "rear_child": "[]"
        },
        "2": {
            "text": "have",
            "pos": "VERB",
            "block": "verb",
            "front_child": "[]",
            "rear_child": "[]"
        },
        "3": {
            "text": "a",
            "pos": "DET",
            "block": "adj",
            "front_child": "[]",
            "rear_child": "[]"
        },
        "4": {
            "text": "pen",
            "pos": "NOUN",
            "block": "noun",
            "front_child": "[3]",
            "rear_child": "[]"
        }
    }
}
`;
    const data = JSON.parse(json);
    return data;
}
class Canvas {
    constructor() {
        const canvas = document.getElementById("canvas");
        canvas.style.backgroundColor = "#fafafa";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = document.getElementById("canvas").getContext("2d");

        this.font_size = 32; //px
        this.text_margin = 10; //px

        //名詞橙、代名詞赤、形容詞黄、副詞青、動詞水、前置詞(設置詞)緑、接続詞黄緑、間投詞紫
        this.noun_color = "orange"; // determiner, noun, numeral, proper noun
        this.pron_color = "red"; //pronoun
        this.adj_color = "yellow"; //adjective
        this.adv_color = "blue"; //adverb
        this.verb_color = "cyan"; // verb
        this.adp_color = "green"; // adposition
        this.conj_color = "yellowgreen" // coordinating conjuction
        this.intj_color = "purple"; // interjection, symbol
        this.line_color = "white"; //輪郭

        this.connector_size = 20; //px

        this.data = getData();
    }

    measure_child(child_arr) {
        let width = child_arr.length * 2 * this.text_margin;
        for (let i = 0; i < child_arr.length; i++) {
            const text = this.data["blocks"][String(child_arr[i])]["text"];
            this.ctx.font = `${String(this.font_size)}px Ubuntu`;
            width += this.ctx.measureText(text);
        }
        return width;
    }

    add_noun_block(text, x, y, front_pole_length, rear_pole_length) {
        this.connector_size; //px
        let pole_height = 30; //px
        if (front_pole_length + rear_pole_length == 0) pole_height = 10;
        this.ctx.strokeStyle = "gray";
        this.ctx.fillStyle = this.noun_color;
        this.ctx.font = `${String(this.font_size)}px Ubuntu`;
        const text_size = this.ctx.measureText(text);

        // connector
        this.ctx.beginPath();
        this.ctx.moveTo(x + this.text_margin, y);
        this.ctx.lineTo(x + this.text_margin + this.connector_size, y + this.connector_size - 10);
        this.ctx.lineTo(x + this.text_margin + this.connector_size, y + this.connector_size);
        this.ctx.lineTo(x + this.text_margin, y + this.connector_size);
        this.ctx.closePath();
        this.ctx.fill();

        // pole
        this.ctx.fillRect(x - front_pole_length, y + this.connector_size, text_size.width + (this.text_margin * 2) + front_pole_length + rear_pole_length, pole_height)

        //text background
        this.ctx.fillRect(x, y + this.connector_size + pole_height, text_size.width + (this.text_margin * 2), this.text_margin * 1 + this.font_size)

        // text
        this.ctx.fillStyle = "black";
        this.ctx.fillText(text, x + this.text_margin, y + pole_height + this.font_size + this.connector_size);

        // block_line 右回り
        this.ctx.beginPath();
        this.ctx.lineWidth = 1.5;
        this.ctx.moveTo(x + this.text_margin, y + this.connector_size);
        this.ctx.lineTo(x + this.text_margin, y);
        this.ctx.lineTo(x + this.text_margin + this.connector_size, y + this.connector_size - 10);
        this.ctx.lineTo(x + this.text_margin + this.connector_size, y + this.connector_size);
        this.ctx.lineTo(x + text_size.width + (this.text_margin * 2) + rear_pole_length, y + this.connector_size);
        this.ctx.lineTo(x + text_size.width + (this.text_margin * 2) + rear_pole_length, y + this.connector_size + pole_height);
        // ここにrear_connector
        this.ctx.lineTo(x + text_size.width + (this.text_margin * 2), y + this.connector_size + pole_height);
        this.ctx.lineTo(x + text_size.width + (this.text_margin * 2), y + this.connector_size + pole_height + this.font_size + this.text_margin);
        this.ctx.lineTo(x, y + this.connector_size + pole_height + this.font_size + this.text_margin);
        this.ctx.lineTo(x, y + this.connector_size + pole_height);
        // ここにfront_connector
        this.ctx.lineTo(x - front_pole_length, y + this.connector_size + pole_height);
        this.ctx.lineTo(x - front_pole_length, y + this.connector_size);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    add_pron_block(text, x, y, front, rear) {

    }
    add_adj_block(text, x, y, front, rear) {
    }
    add_adv_block(text, x, y, front, rear) {
    }
    add_verb_block(text, x, y, front, rear) {
    }
    add_adp_block(text, x, y, front, rear) {
    }
    add_conj_block(text, x, y, front, rear) {
    }
    add_intj_block(text, x, y, front, rear) {
    }

}



window.onload = () => {
    const canvas = new Canvas();
    canvas.add_noun_block("a", 200, 100, 100, 200)
    /*canvas.pron_color = "red"; //pronoun
    canvas.adj_color = "yellow"; //adjective
    canvas.adv_color = "blue"; //adverb
    canvas.verb_color = "cyan"; // verb
    canvas.adp_color = "green"; // adposition
    canvas.conj_color = "yellowgreen" // coordinating conjuction
    canvas.intj_color = "purple"; // interjection, symbol
    console.log(getData())
    */
};
