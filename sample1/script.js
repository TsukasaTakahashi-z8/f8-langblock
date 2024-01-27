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

        //colorの連想配列化
        this.color = { 
            det: "#FFBBDD", // pink- determiner
            noun: "#FFBBBB", //red-noun, numeral, proper noun
            pron: "#FFBB88", //orange- pronouns
            adj: "#FFFF77", //yellow-adjective
            adv: "#AABBEE", //blue-adverb
            verb: "#99DDFF", // cyan-verb
            adp: "#AADDAA", // green-adposition
            conj: "#DDEEAA", // yellowgreen-coordinating conjuction
            intj: "#DDBBDD", // purple-interjection, symbol
            symbol: "#EEEEEE",
            other: "#393E46",
            sentence: "#a89dac",
            line: "#678284", //gray-輪郭
            text: "#222831"
        };

        this.data = getData();
    }

    add_block(text, x, y, front_pole_length, rear_pole_length, level, color, type, pattern = "") {
        let res = [];

        x += this.text_margin;
        this.connector_size; //px
        let pole_height = 30; //px
        if (front_pole_length + rear_pole_length == 0) pole_height = 10;
        this.ctx.strokeStyle = this.line_color;
        this.ctx.fillStyle = color;
        this.ctx.font = `${String(this.font_size)}px Ubuntu`;
        //this.ctx.font = `${String(this.font_size)}px 'Zen Kaku Gothic New'`;
        const text_size = this.ctx.measureText(text);

        res.push(
            x + text_size.width + (this.text_margin * 2) + rear_pole_length + 6, //最右の座標(余白含む)
        );

        // block_line 右回り
        this.ctx.beginPath();
        this.ctx.lineWidth = 1.5;
        this.ctx.moveTo(x + this.text_margin, y + this.connector_size);

        for (let i = 0; i<type.length; i++) {
            let x_margin = this.text_margin*(i+1)
            switch (type[i]) {
                case 'S':
                    this.ctx.lineTo(x + this.x_margin, y);
                    this.ctx.lineTo(x + this.x_margin + this.connector_size, y + this.connector_size - 10);
                    break;
                case 'V':
                    this.ctx.lineTo(x + this.x_margin + (this.connector_size / 2), y);
                    break;
                case 'O':
                    this.ctx.arc(x + this.x_margin + 10, y + this.connector_size - 10, 10, Math.PI, 0, false)
                    break;
                case 'C':
                    this.ctx.lineTo(x + this.x_margin, y);
                    this.ctx.lineTo(x + this.x_margin + this.connector_size, y);
                    break;
                case 'M':
                    this.ctx.lineTo(x + this.x_margin, y);
                    this.ctx.lineTo(x + this.x_margin + (this.connector_size / 2), y + this.connector_size - 10);
                    this.ctx.lineTo(x + this.x_margin + this.connector_size, y);
                    break;
            }
        }

        this.ctx.lineTo(x + this.text_margin + this.connector_size, y + this.connector_size);
        this.ctx.lineTo(x + text_size.width + (this.text_margin * 2) + rear_pole_length, y + this.connector_size);
        this.ctx.lineTo(x + text_size.width + (this.text_margin * 2) + rear_pole_length, y + this.connector_size + pole_height);
        // ここにrear_connector
        this.ctx.lineTo(x + text_size.width + (this.text_margin * 2), y + this.connector_size + pole_height);

        if (level>1) {
            for (let i = 1; i <= level; i++) {
                this.ctx.lineTo(x + text_size.width + (this.text_margin * 2), y + this.connector_size + ((pole_height + 80) * i));
                this.ctx.lineTo(x + text_size.width + (this.text_margin * 2) + rear_pole_length, y + this.connector_size + ((pole_height + 80) * i));
                this.ctx.lineTo(x + text_size.width + (this.text_margin * 2) + rear_pole_length, y + this.connector_size + ((pole_height + 80) * i)+pole_height);
                this.ctx.lineTo(x + text_size.width + (this.text_margin * 2), y + this.connector_size  + ((pole_height + 80) * i)+pole_height);
            }
            this.ctx.lineTo(x, y + this.connector_size + pole_height + ((level) * (pole_height + 80)) );
            res.push(y + this.connector_size + pole_height + ((level) * (pole_height + 80)))
        } else {
            this.ctx.lineTo(x + text_size.width + (this.text_margin * 2), y + this.connector_size + pole_height + this.font_size + this.text_margin);
            this.ctx.lineTo(x, y + this.connector_size + pole_height + this.font_size + this.text_margin);
            res.push(y + this.connector_size + pole_height + this.font_size + this.text_margin)
        }


        this.ctx.lineTo(x, y + this.connector_size + pole_height);
        // ここにfront_connector
        this.ctx.lineTo(x - front_pole_length, y + this.connector_size + pole_height);
        this.ctx.lineTo(x - front_pole_length, y + this.connector_size);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // text
        this.ctx.fillStyle = this.text_color;
        if (level>1) {
            this.ctx.fillText(text, x + this.text_margin, y + this.connector_size + pole_height + ((level) * (pole_height + 80)/2));
        } else {
            this.ctx.fillText(text, x + this.text_margin, y + pole_height + this.font_size + this.connector_size);
        }

        return res;
    }

    create_tree(arr) {
        const init_x=100;
        const init_y=100;
        let position = [init_x, init_y];

        for(let i = 0; i<Object.keys(arr).length; i++) {
            console.log(arr[i])
            position = this.add_block(
                arr[i]["text"], //text
                position[0], // position x
                0, // position y
                0, // front
                200, //back
                arr[i]["level"], this.color[arr[i]["block_color"]], arr[i]["block_type"], "PROPN"
            );
        }
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

    //let data = getData("url", "q");
    let data = `
    {
        "blocks": {
            "0": {
                "text": "",
                "block_color": "sentence",
                "level": "1",
                "block_type": [],
                "front_connector": [],
                "front_child": [],
                "rear_connectors": [],
                "rear_child": [],
                "inner_connectors": ["M", "S", "V", "O"],
                "inner_child": ["1", "2", "2", "2"]
            },
            "1": {
                "text": "If",
                "pos": "SCONJ",
                "level": "1",
                "block_color": "conj",
                "block_type": ["M"],
                "front_connector": [],
                "front_child": [],
                "rear_connectors": [],
                "rear_child": [],
                "inner_connectors": ["M", "S", "V", "O"],
                "inner_child": ["1", "2", "2", "2"]
            },
            "2": {
                "text": "but",
                "pos": "CCONJ",
                "block_color": "conj",
                "block_type": ["V"],
                "level": "2",
                "front_connector": [],
                "front_child": [],
                "rear_connectors": [],
                "rear_child": [],
                "inner_connectors": [
                    ["S", "V", "O", "M"],
                    ["M", "S", "O"]
                ],
                "inner_child": [
                    ["S", "V", "O", "M"],
                    ["M", "S", "O"]
                ]
            },
            "3": {
                "text": "I",
                "pos": "NOUN",
                "level": "1",
                "block_color": "noun",
                "block_type": ["S"],
                "front_connector": [],
                "front_child": [],
                "rear_connectors": [],
                "rear_child": [],
                "inner_connectors": [],
                "inner_child": []
            },
            "4": {
                "text": "have known",
                "pos": "VERB",
                "level": "1",
                "block_color": "verb",
                "block_type": ["V"],
                "front_connector": [],
                "front_child": [],
                "rear_connectors": [],
                "rear_child": [],
                "inner_connectors": [],
                "inner_child": []
            },
            "5": {
                "text": "about",
                "pos": "ADP",
                "level": "1",
                "block_color": "adp",
                "block_type": ["M"],
                "front_connector": [],
                "front_child": [],
                "rear_connectors": ["O"],
                "rear_child": ["7"],
                "inner_connectors": [],
                "inner_child": []
            },
            "6": {
                "text": "party",
                "pos": "NOUN",
                "level": "1",
                "block_color": "noun",
                "block_type": ["O"],
                "front_connector": ["M"],
                "front_child": ["8"],
                "rear_connectors": [],
                "rear_child": [],
                "inner_connectors": [],
                "inner_child": []
            },
            "7": {
                "text": "the",
                "pos": "DET",
                "level": "1",
                "block_color": "noun",
                "block_type": ["M"],
                "front_connector": [],
                "front_child": [],
                "rear_connectors": [],
                "rear_child": [],
                "inner_connectors": [],
                "inner_child": []
            }
        }
    }
        `
    //canvas.create_tree(data['blocks']);
    data = JSON.parse(data)['blocks'];
    canvas.create_tree(data);
}
