var xml = require("node-xml");


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
    this.sax = xml.SaxParser(function(){});
    this.sax.setDocumentHandler(this);
    this.sax.setErrorHandler(this);
    this.sax.setLexicalHandler(this);
    this.np = new NamePicker('elem');
}

GrueParser.prototype = {
    onStartDocument: function() {},
    onEndDocument: function() {},
    onStartElementNS: function(name, attrs, prefix, nsuri, ns) {},
    onEndElementNS; function(name, prefix, nsuri) {},
    onCharacters: function(text) {},
    processingInstruction: function(name, text),
    onCdata: function(text) {},
    onComment: function(text) {},
    onError: function(msg) {},
};