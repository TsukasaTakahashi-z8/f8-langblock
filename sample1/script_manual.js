function getData(url, value) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send("q=" + value);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText);
            return data;
        }
    }
}

class Canvas {
    constructor() {
        const canvas = document.getElementById("canvas");
        canvas.style.backgroundColor = "#eeeeee";
        canvas.width = window.innerWidth * 16;
        canvas.height = window.innerHeight;
        this.ctx = document.getElementById("canvas").getContext("2d");

        this.font_size = 32; //px
        this.text_margin = 10; //px

        this.connector_size = 20; //px
        this.block_margin = 8; //px

        //名詞橙、代名詞赤、形容詞黄、副詞青、動詞水、前置詞(設置詞)緑、接続詞黄緑、間投詞紫
        this.det_color = "#FFBBDD"; // pink- determiner
        this.noun_color = "#FFBBBB"; //red-noun, numeral, proper noun
        this.pron_color = "#FFBB88"; //orange- pronouns
        this.adj_color = "#FFFF77"; //yellow-adjective
        this.adv_color = "#AABBEE"; //blue-adverb
        this.verb_color = "#99DDFF"; // cyan-verb
        this.adp_color = "#AADDAA"; // green-adposition
        this.conj_color = "#DDEEAA" // yellowgreen-coordinating conjuction
        this.intj_color = "#DDBBDD"; // purple-interjection, symbol
        this.symbol_color = "#EEEEEE";
        this.other_color = "#393E46";
        this.sentence_color = "#a89dac";
        this.line_color = "#678284"; //gray-輪郭
        //this.text_color = "#222831";
        this.text_color = "#393E46";

        this.data = getData();
    }

    measure(texts) {
        let width = texts.length * ((this.text_margin * 2) + this.block_margin);

        for (let i = 0; i < texts.length; i++) {
            this.ctx.font = `${String(this.font_size)}px Ubuntu`;
            width += this.ctx.measureText(texts[i]).width;
        }
        return width;
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

    add_cc_block(text, x, y, front_pole_length, rear_pole_length, level, color, shape, pattern = "") {
        console.log(text + ", " + x + ", " + y)
        x += this.text_margin;
        this.connector_size; //px
        let pole_height = 30; //px
        if (front_pole_length + rear_pole_length == 0) pole_height = 10;
        this.ctx.strokeStyle = this.line_color;
        this.ctx.fillStyle = color;
        this.ctx.font = `${String(this.font_size)}px Ubuntu`;
        //this.ctx.font = `${String(this.font_size)}px 'Zen Kaku Gothic New'`;
        const text_size = this.ctx.measureText(text);

        // block_line 右回り
        this.ctx.beginPath();
        this.ctx.lineWidth = 1.5;
        this.ctx.moveTo(x + this.text_margin, y + this.connector_size);
        switch (shape) {
            case 'S':
                this.ctx.lineTo(x + this.text_margin, y);
                this.ctx.lineTo(x + this.text_margin + this.connector_size, y + this.connector_size - 10);
                break;
            case 'V':
                this.ctx.lineTo(x + this.text_margin + (this.connector_size / 2), y);
                break;
            case 'O':
                this.ctx.arc(x + this.text_margin + 10, y + this.connector_size - 10, 10, Math.PI, 0, false)
                break;
            case 'C':
                this.ctx.lineTo(x + this.text_margin, y);
                this.ctx.lineTo(x + this.text_margin + this.connector_size, y);
                break;
            case 'M':
                this.ctx.lineTo(x + this.text_margin, y);
                this.ctx.lineTo(x + this.text_margin + (this.connector_size / 2), y + this.connector_size - 10);
                this.ctx.lineTo(x + this.text_margin + this.connector_size, y);
                break;
        }
        this.ctx.lineTo(x + this.text_margin + this.connector_size, y + this.connector_size);
        this.ctx.lineTo(x + text_size.width + (this.text_margin * 2) + rear_pole_length, y + this.connector_size);
        this.ctx.lineTo(x + text_size.width + (this.text_margin * 2) + rear_pole_length, y + this.connector_size + pole_height);
        // ここにrear_connector
        this.ctx.lineTo(x + text_size.width + (this.text_margin * 2), y + this.connector_size + pole_height);

        for (let i = 1; i <= level; i++) {
            this.ctx.lineTo(x + text_size.width + (this.text_margin * 2), y + this.connector_size + ((pole_height + 80) * i));
            this.ctx.lineTo(x + text_size.width + (this.text_margin * 2) + rear_pole_length, y + this.connector_size + ((pole_height + 80) * i));
            this.ctx.lineTo(x + text_size.width + (this.text_margin * 2) + rear_pole_length, y + this.connector_size + ((pole_height + 80) * i)+pole_height);
            this.ctx.lineTo(x + text_size.width + (this.text_margin * 2), y + this.connector_size  + ((pole_height + 80) * i)+pole_height);
        }

        this.ctx.lineTo(x, y + this.connector_size + pole_height + ((level) * (pole_height + 80)) );
        this.ctx.lineTo(x, y + this.connector_size + pole_height);
        // ここにfront_connector
        this.ctx.lineTo(x - front_pole_length, y + this.connector_size + pole_height);
        this.ctx.lineTo(x - front_pole_length, y + this.connector_size);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // text
        this.ctx.fillStyle = this.text_color;
        this.ctx.fillText(text, x + this.text_margin, y + pole_height + this.font_size + this.connector_size);

        let res;
        res = [
            text_size.width + (this.text_margin * 2) + rear_pole_length + 6
        ];
        return res;
    }

    add_block(text, x, y, front_pole_length, rear_pole_length, color, shape, pattern = "") {
        x += this.text_margin;
        this.connector_size; //px
        let pole_height = 30; //px
        if (front_pole_length + rear_pole_length == 0) pole_height = 10;
        this.ctx.strokeStyle = this.line_color;
        this.ctx.fillStyle = color;
        this.ctx.font = `${String(this.font_size)}px Ubuntu`;
        //this.ctx.font = `${String(this.font_size)}px 'Zen Kaku Gothic New'`;
        const text_size = this.ctx.measureText(text);

        // block_line 右回り
        this.ctx.beginPath();
        this.ctx.lineWidth = 1.5;
        this.ctx.moveTo(x + this.text_margin, y + this.connector_size);
        switch (shape) {
            case 'S':
                this.ctx.lineTo(x + this.text_margin, y);
                this.ctx.lineTo(x + this.text_margin + this.connector_size, y + this.connector_size - 10);
                break;
            case 'V':
                this.ctx.lineTo(x + this.text_margin + (this.connector_size / 2), y);
                break;
            case 'O':
                this.ctx.arc(x + this.text_margin + 10, y + this.connector_size - 10, 10, Math.PI, 0, false)
                break;
            case 'C':
                this.ctx.lineTo(x + this.text_margin, y);
                this.ctx.lineTo(x + this.text_margin + this.connector_size, y);
                break;
            case 'M':
                this.ctx.lineTo(x + this.text_margin, y);
                this.ctx.lineTo(x + this.text_margin + (this.connector_size / 2), y + this.connector_size - 10);
                this.ctx.lineTo(x + this.text_margin + this.connector_size, y);
                break;
        }
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
        this.ctx.fill();
        this.ctx.stroke();

        // text
        this.ctx.fillStyle = this.text_color;
        this.ctx.fillText(text, x + this.text_margin, y + pole_height + this.font_size + this.connector_size);

        let res;
        res = [
            text_size.width + (this.text_margin * 2) + rear_pole_length + 6
        ];
        return res;
    }
}

function array_sum(arr) {
    let k = 0;
    for (let i = 0; i < arr.length; i++) {
        k += arr[i];
    }
    return k;
}

window.onload = () => {

    const canvas = new Canvas();
    let x = [100];

    canvas.add_block(
        "",
        array_sum(x) - (canvas.text_margin * 2 + canvas.block_margin),
        70,
        0,
        canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run",
            "and",
            "transportation",
            "system",
            "that",
            "was established",
            "by",
            "the",
            "Roman",
            "Empire"
        ]),
        canvas.sentence_color, "", ""
    );
    canvas.add_block(
        "Cursus Publicus",
        x[0] + canvas.measure(["The"]),
        100,
        canvas.measure(["The"]),
        0,
        canvas.noun_color, "S", "PROPN"
    );
    canvas.add_block("The",
        x[0],
        130,
        0,
        0,
        canvas.det_color, "M", "PROPN"
    );
    canvas.add_block("was",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus"
        ]),
        100,
        0,
        0,
        canvas.verb_color, "V", "VERB");

    canvas.add_block("system",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run",
            "and",
            "transportation",
        ]),
        100,
        canvas.measure([
            "a",
            "state-run",
            "and",
            "transportation",
        ]),
        canvas.measure([
            "that",
            "was established",
            "by",
            "the",
            "Roman",
            "Empire"
        ]),
        canvas.noun_color, "C", "NOUN");

    canvas.add_block("a",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was"
        ]),
        130,
        0,
        0,
        canvas.det_color, "M", "DET");

    canvas.add_block("state-run",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a"
        ]),
        130,
        0,
        0,
        canvas.adj_color, "M", "ADJ");

    canvas.add_cc_block("and",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run"
        ]),
        130,
        0,
        canvas.measure(["transportation"]),
        3, canvas.conj_color, "M", "CCONJ");

    canvas.add_block("courier",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run",
            "and"
        ]),
        270,
        0,
        0,
        canvas.adj_color, "M", "NOUN");

    canvas.add_block("transportation",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run",
            "and"
        ]),
        160,
        0,
        0,
        canvas.adj_color, "M", "NOUN");

    canvas.add_block("that",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run",
            "and",
            "transportation",
            "system"
        ]),
        130,
        0,
        canvas.measure([
            "was established",
            "by",
            "the",
            "Roman",
            "Empire"
        ]),
        canvas.pron_color, "M", "PRON");

    canvas.add_block("was established",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run",
            "and",
            "transportation",
            "system",
            "that"
        ]),
        160,
        0,
        0,
        canvas.verb_color, "V", "VERB");

    canvas.add_block("by",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run",
            "and",
            "transportation",
            "system",
            "that",
            "was established"
        ]),
        160,
        0,
        canvas.measure([
            "the",
            "Roman",
            "Empire"
        ]),
        canvas.adp_color, "M", "ADP");

    canvas.add_block("Empire",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run",
            "and",
            "transportation",
            "system",
            "that",
            "was established",
            "by",
            "the",
            "Roman"
        ]),
        190,
        canvas.measure(["the", "Roman"]),
        0,
        canvas.noun_color, "O", "PROPN");

    canvas.add_block("the",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run",
            "and",
            "transportation",
            "system",
            "that",
            "was established",
            "by"
        ]),
        220,
        0,
        0,
        canvas.det_color, "M", "DET");

    canvas.add_block("Roman",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run",
            "and",
            "transportation",
            "system",
            "that",
            "was established",
            "by",
            "the"
        ]),
        220,
        0,
        0,
        canvas.adj_color, "M", "PROPN");

    canvas.add_block(".",
        x[0] + canvas.measure([
            "The",
            "Cursus Publicus",
            "was",
            "a",
            "state-run",
            "and",
            "transportation",
            "system",
            "that",
            "was established",
            "by",
            "the",
            "Roman",
            "Empire"
        ]),
        100,
        0,
        0,
        canvas.symbol_color, "", "");
}
