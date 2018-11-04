 let TinyBlock = require("./TinyBlock");
let path = require("path");
let AppUtils = require("websocket_p2pnet").AppUtils;

class Notbook{

    constructor(){
        //定义一个装区块的数组
          this.blockList = [];
          //定义新建导入的工具类
          this.appUtils = new AppUtils(path.join(__dirname,'../webconfig.config'));
          //定义第一个区块
          this.preOneHash = "0000000000000000000000000000000000000000000000000000000000000000";
    }

    /**
     * 添加区块的方法
     * @param content
     */
    addNote(content){
        //新建一个区块
        let newBlock = new TinyBlock(this.blockList.length+1,content,null,null,null,new Date().toLocaleString());
        //设置上一个区块的哈希
        newBlock.preHash = this.blockList == 0 ?this.preOneHash:this.blockList[this.blockList.length - 1].hash;
        //挖矿
        let result = this.mine(newBlock.content,newBlock.preHash);
        //获取次数和当前区块的hash值
        newBlock.nounce = result.nounceNum;
        newBlock.hash = result.curHash;

        this.blockList.push(newBlock);


        //console.log(newBlock);
    }

    /**
     * 挖矿
     * @param content
     * @param preHash
     */
    mine(content,preHash){
        //定义一个工作量证明
        let nounce = -1;
        //定义一个工作量与哈希值的集合
        let resulr = {nounceNum: -1,curHash : ""};
        //定义接收日志的字符串
        let log = '';
        //循环找到符合规则的哈希值
        for (;nounce<Number.MAX_SAFE_INTEGER;nounce++){
            //调用工具类算出哈希值
            resulr.curHash=this.appUtils.HashOpe.sha256(nounce+content+preHash);
            if (resulr.curHash.startsWith("0000")){
                resulr.nounceNum = nounce;
                log += "\r\n[挖矿成功"+nounce+"次],hash="+resulr.curHash;
                break;
            }else {
                log += "\r\n[挖 矿失败"+nounce+"次]";
            }
        }
        console.log(log)
        return resulr
    }

    /**
     *校验的逻辑
     */
    check(){
        //定义当前的区块
        let curBlock = null;
        //定义上一个区块的哈希
        let preHash = null;
        //定义当前区块的哈希
        let culHash = null;
        //定义日志
        let strLog = '';
        //循环遍历区块数组
        for (let i = 0;i<this.blockList.length;i++){
            //拿到当前区块
            curBlock = this.blockList[i];
            //拿到当前哈希
            culHash = this.appUtils.HashOpe.sha256(curBlock.nounce+curBlock.content+curBlock.preHash);
            //拿到上一个区块的哈希
            if (culHash !== curBlock.hash){
                //console.log(culHash)
                console.log(curBlock.nounce)
                strLog += '第【' + curBlock.id + '】区块，hash和内容不一致！有可能被篡改了！\r\n';
            }
            //拿到上一个区块的哈希
            preHash = i == 0 ? this.preOneHash : this.blockList[i - 1].hash;
            if (curBlock.preHash !== preHash){
                strLog += '第【' + curBlock.id + '】区块，preHash和上个区块的hash不一致！有可能被篡改了！\r\n';
            }


        }
        if (strLog)
            console.log(strLog+"++++");
        else
            console.log('校验成功~~');

        // throw new Error(strLog);
    }

}
 let a = new Notbook();
 a.addNote('测试添加11111111111111111');
 a.addNote('测试添加222222222222222222');
 a.addNote('测试添加333333333333333333');
 console.log(a.blockList);


 a.check();