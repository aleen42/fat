require('./common.less');
require('storm-react-diagrams/dist/style.min.css');

/* global DOT_INPUT, DOT_NAME, MODULES */
/** Use viz.js to parse dot diagrams */
/** document: https://github.com/mdaines/viz.js/wiki */
const Viz = require('viz.js').default;
const {Module, render} = require('viz.js/full.render.js');
const viz = new Viz({Module, render});

const {
    DiagramEngine,
    DiagramModel,
    DiagramWidget,
} = require('storm-react-diagrams');

const {GroupFactory, GroupModel} = require('components/group');
const {LinkFactory, LinkModel} = require('components/link');
const {NodeModel} = require('components');

const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

// noinspection JSUnresolvedFunction
viz.renderJSONObject(DOT_INPUT).then(data => {
    console.log(data);
    /** set up the diagram engines */
    const engine = new DiagramEngine();
    engine.installDefaultFactories();
    /** register custom components factories */
    engine.registerNodeFactory(new GroupFactory());
    engine.registerLinkFactory(new LinkFactory());
    /** setup the diagram model */
    const diagramModel = new DiagramModel();

    const [, , , vh] = data.bb.split(',');

    const groups = data.objects.filter(obj => obj.compound && obj.label !== '..')
        .map(group => Object.assign(group, {
            model: new GroupModel(group.label, (MODULES || []).some(module => new RegExp(module).test(group.name))
                ? 'rgba(0, 192, 255, 0.2)'
                : 'rgba(0, 0, 0, 0)'),
        }));
    /** create groups */
    groups.forEach(({_gvid, bb, lp, subgraphs, model}) => {
        const [, , gw, gh] = bb.split(',');
        const [x, y] = lp.split(',');

        if (subgraphs) {
            subgraphs.reverse().forEach(id => {
                const child = groups.filter(group => group._gvid === id)[0];
                child.root = _gvid;
                model.addNode(child.model);
            });
        }
    });
    /** only add root group */
    groups.filter(group => group.root === void 0).forEach(({model}) => {
        diagramModel.addNode(model);
    });

    /** create boxes */
    const boxes = data.objects.filter(obj => obj.shape === 'box');
    boxes.forEach(({_gvid, label, pos, color}, index) => {
        let colorFn;
        if (color === 'red') {
            colorFn = opacity => `rgb(161, 0, 0, ${opacity})`;
        } else if (color === 'grey') {
            colorFn = opacity => `rgb(100, 100, 100, ${opacity})`;
        } else {
            colorFn = _randomColor();
        }

        const node = new NodeModel(label, colorFn(0.8));
        const [x, y] = pos.split(',');

        const parents = groups.filter(group => group.nodes.includes(_gvid));
        /** the last one group is the the closest parent group */
        if (parents.length) {
            node.setCol(parseFloat(x));
            node.setRow(parseFloat(vh) - parseFloat(y));
            parents[parents.length - 1].model.addNode(node)
        } else {
            /** root node */
            diagramModel.addNode(node);
        }

        boxes[index]['node'] = node;
        boxes[index]['linkColor'] = colorFn(0.5);
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

        const link = new LinkModel();
        link.setSourcePort(endPort);
        link.setTargetPort(startPort);
        link.setColor(endBox.linkColor);
        link.setCurvyness(100);
        diagramModel.addLink(link);
    });

    /** load model into engine */
    engine.setDiagramModel(diagramModel);

    ReactDOM.render(
        <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} inverseZoom={true}/>,
        $('.fat-wrapper')[0]
    );

    /** painting position */
    let [minX, minY] = [0, 0];
    const nodes = Object.values(diagramModel.getNodes());
    nodes.filter(node => node instanceof GroupModel).reverse().forEach(node => {
        /** group firstly */
        if (node instanceof GroupModel) {
            node.setPosition(minX, 100);
            minX += node.width;
            minY = Math.max(minY, node.height);
        }

        return node;
    });

    nodes.filter(node => !(node instanceof GroupModel)).reverse().forEach(node => {
        /** boxes secondly */
        node.setPosition(0, minY);
        minY += node.height;
    });

    engine.repaintCanvas();

    /** title */
    $('.fat-title').text(DOT_NAME || '');
}).catch(console.warn);

/** helpers */
function _randomColor() {
    const _ran = (base = 0) => Math.round(base + Math.random() * (255 - base));
    const _color = [_ran(), _ran(), _ran()];
    return _opacity => `rgb(${[..._color, _opacity].join(',')})`;
}
