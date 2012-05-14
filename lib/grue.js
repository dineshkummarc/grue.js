var xml = require("node-xml"),
    util = require("util");

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
    this.sax = new xml.SaxParser(function(){});
    this.sax.setDocumentHandler(this);
    this.sax.setErrorHandler(this);
    this.sax.setLexicalHandler(this);
    this.indent = 0;
}

GrueParser.prototype = {
    onStartDocument: function() {
        console.log("onStartDocument");
    },
    onEndDocument: function() {
        console.log("onEndDocument");
    },
    onStartElementNS: function(name, attrs, prefix, nsuri, spaces) {
        console.log("onStartElementNS: %j %j %j %j %j", name, attrs, prefix, nsuri, spaces);
        this._output("(function(_) {");
        this.indent++;
        for (var i in attrs) {
            var k = attrs[i][0], v = attrs[i][1];
            if (k.indexOf(':') == -1) {
                this._output("_.setAttribute(%s, %s);", k.toString(), v.toString());
            } else {
                //FIXME: Resolve namespace
                this._output("_.setAttributeNS(%s, %s, %s);", "", k.toString(), v.toString());
            }
        }
    },
    onEndElementNS: function(name, prefix, nsuri) {
        console.log("onEndElementNS: %j %j %j", name, prefix, nsuri);
        this.indent--;
        this._output("})(_.appendChild(document.createElementNS(%s, %s)));", nsuri.toString(), name.toString());
    },
    onCharacters: function(text) {
        if (text.trim() == "") { // Don't do anything if it's just whitespace.
            return;
        }
        this._output("%s.appendChild(document.createTextNode(%s));", this._currentName(), text.toString());
    },
    processingInstruction: function(name, text) {
        // JavaScript code to paste verbatum (wrapped in an empty function, of course);
        console.log("processingInstruction: %j %j", name, text);
        if (name == "js") {
            this._output("(function(_) {%s})(_);", text);
        } else if (name == "xml") {
            //TODO: Verify it's first
        } else {
            //TODO: stick in template
        this._output(
            "_.appendChild(document.createProcessingInstruction(%s, %s));", 
            name.toString(), text.toString()
            );
        }
    },
    onCdata: function(text) {
        // This is an XML-specific alternate representation of plain text.
        this.onCharacters(text);
    },
    onComment: function(text) {
        // Don't do anything, omit this
    },
    onError: function(msg) {
        console.log("onError: %j", msg);
        //TODO: Propogate this up
    },
};


/*
basic form:
(function(_) {
    _.addChild(document....);
    _.addChild(document....);
    (function(_) {
        ...
    })(_.addChild(document.createElement(...)));
})(_.addChild(document.createElement(...)));
*/

module.exports.GrueParser = GrueParser;