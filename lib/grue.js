var xml = require("node-xml");

module.exports.GrueParser = GrueParser

const NAMESPACE = 'http://astro73.com/xml/grue/js';

/*
<?js ?>
js:if, js:elseif, js:else
js:for
js:var
js:select
<js:root>
<js:contents>
*/

/**
 * My goal in life is to pick unique names for everything. You can give me some 
 * suggestions for the name, which I may or may not use.
 */
function NamePicker(defname) {
    this.defname = defname;
    if (!this.defname) {
        this.defname = "e";
    }
    this.usednames = {};
}

NamePicker.prototype = {
    pick: function(suggestion) {
        if (!suggestion) {
            suggestion = this.defname;
        }
        //FIXME: Strip numbers off of suggestion
        var i;
        if (!this.usednames[suggestion]) {
            i = 1;
        } else {
            i = this.usednames[suggestion] + 1;
        }
        this.usednames[suggestion] = i;
        return suggestion + i;
    }
};


function GrueParser() {
    this.sax = new xml.SaxParser(function(){});
    this.sax.setDocumentHandler(this);
    this.sax.setErrorHandler(this);
    this.sax.setLexicalHandler(this);
    this.np = new NamePicker('elem');
}

GrueParser.prototype = {
    onStartDocument: function() {
        console.log("onStartDocument: %j", arguments);
    },
    onEndDocument: function() {
        console.log("onEndDocument: %j", arguments);
    },
    onStartElementNS: function(name, attrs, prefix, nsuri, ns) {
        console.log("onStartElementNS: %j", arguments);
    },
    onEndElementNS: function(name, prefix, nsuri) {
        console.log("onEndElementNS: %j", arguments);
    },
    onCharacters: function(text) {
        console.log("onCharacters: %j", arguments);
    },
    processingInstruction: function(name, text) {
        console.log("processingInstruction: %j", arguments);
    },
    onCdata: function(text) {
        console.log("onCdata: %j", arguments);
    },
    onComment: function(text) {
        console.log("onComment: %j", arguments);
    },
    onError: function(msg) {
        console.log("onError: %j", arguments);
    },
};
