const {DefaultLinkModel} = require('storm-react-diagrams');

export class LinkModel extends DefaultLinkModel {
    constructor(type = 'default') {
        super(type);
    }

    setCurvyness(curvyness = 50) {
        curvyness > 0 ? (this.curvyness = curvyness) : console.warn(`wrong curvyness: ${curvyness}`);
    }

    getSelectedEntities() {
        return this.keep ? [] : super.getSelectedEntities();
    }

    setSelected(selected = true, keep = false) {
        this.selected = selected;
        this.keep = selected && keep;
    }
}