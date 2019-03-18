const {DefaultNodeModel} = require('storm-react-diagrams');

export class GroupModel extends DefaultNodeModel {
    constructor(name = 'group', color = 'rgba(0, 0, 0, 0)') {
        super(name, color);
        this.childNodes = [];
    }

    getPorts() {
        /** update ports data */
        this.ports = this.childNodes.reduce((ports, node) => Object.assign(ports, node.getPorts()), {});
        return this.ports;
    }

    setPosition(x, y) {
        /** update ports data */
        this.ports = this.childNodes.reduce((ports, node) => Object.assign(ports, node.getPorts()), {});
        super.setPosition(x, y);
    }

    getCol() {
        return this.childNodes.length ? Math.min.apply(null, this.childNodes.map(node => node.getCol())) : 1;
    }

    getRow() {
        return this.childNodes.length ? Math.max.apply(null, this.childNodes.map(node => node.getRow())) : 1;
    }

    addNode(...node) {
        this.childNodes.push(...node);
    }

    getNodes() {
        return this.childNodes;
    }
}