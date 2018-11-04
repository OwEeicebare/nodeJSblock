class TinyBlock{

    constructor(id,content,hash,preHash,nounce,time){
        this.id = id;
        this.hash = hash;
        this.preHash = preHash;
        this .content = content;
        this.nounce = nounce
        this.time = time;
    }

}

module.exports = TinyBlock;