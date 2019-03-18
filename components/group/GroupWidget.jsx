const React = require('react');
const $ = require('jquery');
const {GroupModel} = require('./GroupModel');
const {BaseWidget, DefaultNodeWidget} = require('storm-react-diagrams');

require('./group.less');

export class GroupWidget extends BaseWidget {
    constructor(props) {
        super('srd-group', props);
    }

    mouseDownHandler(node, e) {
        e.stopPropagation();
        const isToggled = $(e.target).closest('.srd-default-node').hasClass('srd-default-node__path-selected');

        const _toggle = (node, pre = false) => {
            node.setSelected(!isToggled);
            /** get required modules */
            pre && node.getInPorts().forEach(port => {
                Object.values(port.getLinks()).forEach(link => link.setSelected(!isToggled, true));
            });
            /** get requiring modules */
            node.getOutPorts().forEach(port => {
                Object.values(port.getLinks())
                    .forEach(link => {
                        _toggle(link.targetPort.parent);
                        link.setSelected(!isToggled, true);
                    });
            });
        };

        _toggle(node, true);
        /** GPU acceleration */
        requestAnimationFrame(() => {
            const diagramEngine = this.props.diagramEngine;
            diagramEngine.clearRepaintEntities();
            diagramEngine.repaintCanvas();
        });
    }

    render() {
        return (
            <div className={this.bem('__wrapper')}
                 style={{backgroundColor: this.props.node.color}}>
                <div className={this.bem('__title')}>
                    <div className={this.bem('__name')}>{this.props.node.name}</div>
                </div>
                <div className={this.bem('__child')}>
                    {

                        Object.entries((this.props.node.childNodes || []).reduce((elements, node) => {
                            const col = node.getCol ? node.getCol() : 1;
                            (elements[col] = elements[col] || []).push(node);
                            return elements;
                        }, {})).sort((a, b) => a[0] - b[0])
                            .map(([, nodes], index) => <div className={this.bem('__col')} key={index}>
                                {
                                    nodes.sort((a, b) => (a.getRow ? a.getRow() : 1) - (b.getRow ? b.getRow() : 1))
                                        .map((node, index) => node instanceof GroupModel
                                            ? <GroupWidget key={index} diagramEngine={this.props.diagramEngine}
                                                           node={node}/>
                                            : <div onMouseDown={this.mouseDownHandler.bind(this, node)}
                                                   className={this.bem('__row')}
                                                   key={index} style={{
                                                marginTop: index > 0
                                                    ? (node.getRow ? node.getRow() : 1) - (nodes[index - 1].getRow ? nodes[index - 1].getRow() : 1)
                                                    : 5
                                            }}><DefaultNodeWidget className={node.selected ? 'srd-default-node__path-selected' : ''}
                                                                  diagramEngine={this.props.diagramEngine}
                                                                  node={node}/></div>)
                                }
                            </div>)
                    }
                </div>
            </div>
        );
    }
}
