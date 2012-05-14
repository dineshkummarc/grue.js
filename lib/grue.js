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

function GrueParser() {
    this.sax = xml.SaxParser(function(){});
    this.sax.setDocumentHandler(this);
    this.sax.setErrorHandler(this);
    this.sax.setLexicalHandler(this);
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