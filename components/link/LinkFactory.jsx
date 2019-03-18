require('./link.less');

const React = require('react');
const {AbstractLinkFactory, DefaultLinkWidget} = require('storm-react-diagrams');

export class LinkFactory extends AbstractLinkFactory {
    constructor() {
        super('default');
    }

    generateReactWidget(diagramEngine, link) {
        return React.createElement(DefaultLinkWidget, {
            link: link,
            diagramEngine: diagramEngine
        });
    }

    generateLinkSegment(model, widget, selected, path) {
        return (
            <path
                className={selected ? widget.bem('__fat_path-selected') : ''}
                strokeWidth={model.width}
                stroke={model.color}
                d={path}
            />
        );
    }
}
