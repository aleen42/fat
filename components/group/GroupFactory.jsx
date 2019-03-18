const React = require('react');
const {GroupWidget} = require('./GroupWidget');
const {GroupModel} = require('./GroupModel');
const {NodeModel} = require('../NodeModel');
const {DefaultNodeModel, DefaultNodeFactory, DefaultNodeWidget} = require('storm-react-diagrams');

export class GroupFactory extends DefaultNodeFactory {
    constructor() {
        super('group');
    }

    generateReactWidget(diagramEngine, node) {
        if (node instanceof GroupModel) {
            return <GroupWidget node={node} diagramEngine={diagramEngine}/>;
        } else if (node instanceof NodeModel || node instanceof DefaultNodeModel) {
            return <DefaultNodeWidget node={node} diagramEngine={diagramEngine} />;
        }
    }
}