// KTS - IoIT

const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(timestamp, data) {
        this.index = 0;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = "0";
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + this.data + this.nonce).toString();
    }

    mineBlock(difficulty) {

    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesis()];
    }

    createGenesis() {
        return new Block("01/01/2018", "Genesis block", "0")
    }

    latestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.latestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    checkValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

/*
 * deci to bin 
 */
function deciToBin(arg) {
    res1 = 999;
    args = arg;
    while (args > 1) {
        arg1 = parseInt(args / 2);
        arg2 = args % 2;
        args = arg1;
        if (res1 == 999) {
            res1 = arg2.toString();
        } else {
            res1 = arg2.toString() + res1.toString();
        }
    }
    if (args == 1 && res1 != 999) {
        res1 = args.toString() + res1.toString();
    } else if (args == 0 && res1 == 999) {
        res1 = 0;
    } else if (res1 == 999) {
        res1 = 1;
    }
    var ll = res1.length;
    while (ll % 4 != 0) {
        res1 = "0" + res1;
        ll = res1.length;
    }
    return res1;
}


/*
 * djb2 Hash
 */
function djb2(s, tableSize) {
    var b = '', i, hash = 5381;

    for (i = 0; i < s.length; i++) {
        b += deciToBin(s[i].charCodeAt());
    }

    for (i = 0; i < b.length; i++) {
        if (b[i] == '1') {
            hash = ((hash << 5) + hash) + 1;
        } else {
            hash = ((hash << 5) + hash) + 0;
        }
    }

    return Math.abs(hash) % tableSize;
}


/*
 * Universal Hash
 */
function universalHash(s, tableSize) {
    var b = 27183, h = 0, a = 31415;

    if (tableSize > 1) {
        for (i = 0; i < s.length; i++) {
            h = (a * h + s[i].charCodeAt()) % tableSize;
            a = ((a % tableSize) * (b % tableSize)) % (tableSize);
        }
    }

    return h;
}


/*
 * Simple Hash
 */
function simpleHash(s, tableSize) {
    var i, hash = 0;

    for (i = 0; i < s.length; i++) {
        hash += (s[i].charCodeAt() * (i + 1));
    }

    return Math.abs(hash) % tableSize;
}


/*
 * Division Hash Function
 */
function divisionHash(s, tableSize) {
    return s.length % tableSize;
}



function main() {

    let jsChain = new Blockchain();
    jsChain.addBlock(new Block("02/25/2018", { amount: 9 }));
    jsChain.addBlock(new Block("03/29/2018", { amount: 10 }));
    jsChain.addBlock(new Block("03/30/2018", { amount: 15 }));


    CHARS = 'qwertyuiopasdfghjklzxcvbnm';
    console.log(JSON.stringify(jsChain, null, 5));
    console.log("Is blockchain valid? " + jsChain.checkValid());
}



function saveTextAsFile() {
    var textToWrite = document.getElementById("inputTextToSave").value;
    var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function loadFileAsText() {
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById("inputTextToSave").value = textFromFileLoaded;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}