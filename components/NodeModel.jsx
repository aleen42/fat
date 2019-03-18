const {DefaultNodeModel} = require('storm-react-diagrams');

export class NodeModel extends DefaultNodeModel {
    constructor(name = 'default', color) {
        super(name, color);
        this.col = 1;
        this.row = 1;
    }

    setCol(col) {
        this.col = col;
    }

    getCol() {
        return this.col;
    }

    setRow(row) {
        this.row = row;
    }

    getRow() {
        return this.row;
    }

    setSelected(selected = true) {
        this.selected = selected;
    }
}
