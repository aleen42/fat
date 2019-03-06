require('./common.css');
require('storm-react-diagrams/dist/style.min.css');

/* global DOT_INPUT */
/** Use viz.js to parse dot diagrams */
/** document: https://github.com/mdaines/viz.js/wiki */
const Viz = require('viz.js').default;
const {Module, render} = require('viz.js/full.render.js');
const viz = new Viz({Module, render});

const {
    DiagramEngine,
    DiagramModel,
    DefaultNodeModel,
    DiagramWidget,
    DefaultLinkModel,
} = require('storm-react-diagrams');

const React = require('react');
const ReactDOM = require('react-dom');

viz.renderSVGElement(DOT_INPUT).then(element => {
    document.querySelector('.viz').appendChild(element);
});

// noinspection JSUnresolvedFunction
viz.renderJSONObject(DOT_INPUT).then(data => {
    console.log(data);
    /** set up the diagram engines */
    const engine = new DiagramEngine();
    engine.installDefaultFactories();
    /** setup the diagram model */
    const model = new DiagramModel();

    const [x, y, vw, vh] = data.bb.split(',');
    const [gx, gy] = [4, 1.8];

    const boxes = data.objects.filter(obj => obj.shape === 'box');
    const groups = data.objects.filter(obj => obj.compound);

    /** create boxes */
    boxes.forEach(({_gvid, label, pos}, index) => {
        const color = _randomColor();
        const node = new DefaultNodeModel(label, color(0.8));
        const [x, y] = pos.split(',');
        node.setPosition(parseFloat(x) * gx, (parseFloat(vh) - parseFloat(y)) * gy);
        /** add node to the model */
        model.addNode(node);

        boxes[index]['node'] = node;
        boxes[index]['color'] = color(0.3);
    });

    /** create links */
    data.edges.forEach(({tail, head}) => {
        const [startBox, endBox] = [
            ...boxes.filter(box => box._gvid === head),
            ...boxes.filter(box => box._gvid === tail),
        ];

        const [startNode, endNode] = [startBox.node, endBox.node];

        const [startPort, endPort] = [
            startNode.getInPorts()[0] || startNode.addInPort(' '),
            endNode.getOutPorts()[0] || endNode.addOutPort(' '),
        ];


        const link = new DefaultLinkModel();
        link.setSourcePort(endPort);
        link.setTargetPort(startPort);
        link.setColor(endBox.color);
        model.addLink(link);
    });

    /** load model into engine */
    engine.setDiagramModel(model);

    ReactDOM.render(
        <DiagramWidget className="srd-demo-canvas" diagramEngine={engine}/>,
        document.querySelector('.wrapper')
    );
}).catch(error => {
    console.warn(error);
});

/** helpers */
function _randomColor() {
    const _ran = () => Math.round(Math.random() * 255);
    const _color = [_ran(), _ran(), _ran()];
    return _opacity => `rgb(${[..._color, _opacity].join(',')})`;
}

