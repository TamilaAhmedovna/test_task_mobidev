






class Buffer {

    constructor(dataUrl){
        this.items = [dataUrl];
        this.index = this.items.length - 1;
        this.currentElem = this.currentElem.bind(this);
        this.add = this.add.bind(this);
        this.clear = this.clear.bind(this);
        this.save = this.save.bind(this);
        this.load = this.load.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
    }

    currentElem() {
        return this.items[this.index];
    };

    add(dataUrl) {
        this.items.push(dataUrl);
        this.index = this.items.length - 1;
        this.items = this.items.slice(0, this.index + 1);
    };

    clear() {
        this.items = [];
        this.index = 0;
    };

    save() {
        this.items.splice(this.index + 1, this.items.length - this.index);
    };

    load(dataUrlArr) {
        this.items = dataUrlArr;
        this.index = this.items.length - 1;
    };

    undo() {
        if (this.index === 0) return this.currentElem();

        this.index -= 1;
        return this.currentElem();
    };

    redo() {
        if (this.index >= this.items.length - 1) return this.currentElem();

        this.index += 1;
        return this.currentElem();
    };


}

export default Buffer;
