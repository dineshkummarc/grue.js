var xml = require("node-xml"),
    util = require("util"),
    assert = require("assert");

var NAMESPACE = 'http://astro73.com/xml/grue/js';

/*
<?js ?>
<js:if>, <js:elseif>, <js:else>
<js:for>
<js:var>
<js:select>
<js:case>
<js:root>
<js:contents>
*/

function GrueParser() {
    this.sax = new xml.SaxParser(function(){});
    this.sax.setDocumentHandler(this);
    this.sax.setErrorHandler(this);
    this.sax.setLexicalHandler(this);
    
    // State
    this.indent = 0;
    this.select_depth = 0;
}

GrueParser.prototype = {
    _output: function(txt) {
        assert.ok(this.indent >= 0);
        if (arguments.length > 1) {
            txt = util.format.apply(null, arguments);
        }
        for (var i = 0; i < this.indent; i++) {
            txt = "\t"+txt;
        }
        
        console.log(txt);
    },
    _indent: function() {
        this._output.apply(this, arguments);
        this.indent++;
    },
    _undent: function() {
        this.indent--;
        this._output.apply(this, arguments);
    },
    _: JSON.stringify,
    onStartDocument: function() {
        console.log("onStartDocument");
    },
    onEndDocument: function() {
        console.log("onEndDocument");
    },
    onStartElementNS: function(name, attrs, prefix, nsuri, spaces) {
        console.log("onStartElementNS: %j %j %j %j %j", name, attrs, prefix, nsuri, spaces);
        // TODO: Resolve attribute namespaces here
        if (nsuri == NAMESPACE) {
            switch(name) {
                case 'if':
                    assert.assert(attrs['when'], "js:if requires 'when' attribute");
                    this._indent("if (%s) {", attrs['when']);
                    break;
                case 'elseif':
                    assert.assert(attrs['when'], "js:elseif requires 'when' attribute");
                    this._indent("else if (%s) {", attrs['when']);
                    break;
                case 'else':
                    this._indent("else {");
                    break;
                case 'for':
                    assert.assert(attrs['each'], "js:for requires 'each' attribute");
                    this._indent("for (%s) {", attrs['each']);
                    break;
                case 'var':
                    assert.assert(attrs['name'], "js:var requires 'name' attribute");
                    assert.assert(attrs['value'], "js:var requires 'value' attribute");
                    this._indent("(function() {");
                    this._output("var %s = %s;", attrs['name'], attrs['value']);
                    break;
                case 'select':
                    this.select_depth++;
                    break;
                case 'case':
                    assert.assert(this.select_depth, "js:case can only appear in js:select");
                case 'root':
                    break;
                case 'contents':
                    break;
                default:
                    throw "Invalid tag in Grue namespace";
            }
        } else {
            // TODO: Check attributes for conditionals and looping
            this._indent("(function(_) {");
            for (var i in attrs) {
                var k = attrs[i][0], v = attrs[i][1];
                if (k.indexOf(':') == -1) {
                    this._output("_.setAttribute(%s, %s);", this._(k), this._(v));
                } else {
                    //FIXME: Resolve namespace
                    this._output("_.setAttributeNS(%s, %s, %s);", "'TODO'", this._(k), this._(v));
                }
            }
        }
    },
    onEndElementNS: function(name, prefix, nsuri) {
        console.log("onEndElementNS: %j %j %j", name, prefix, nsuri);
        this.indent--;
        if (nsuri == NAMESPACE) {
            switch(name) {
                case 'if':
                case 'elseif':
                case 'else':
                case 'for':
                    this._undent("}");
                    break;
                case 'var':
                    this._undent("})();");
                    break;
                case 'select':
                    this.select_depth--;
                    break;
                case 'case':
                    assert.assert(this.select_depth, "js:case must be in a js:select");
                    break;
                case 'root':
                    break;
                case 'contents':
                    break;
                default:
                    throw "Invalid tag in Grue namespace";
            }
        } else if (nsuri) {
            this._undent("})(_.appendChild(document.createElementNS(%s, %s)));", this._(nsuri), this._(name));
        } else {
            this._undent("})(_.appendChild(document.createElement(%s)));", this._(name));
        }
    },
    onCharacters: function(text) {
        if (text.trim() == "") { // Don't do anything if it's just whitespace.
            return;
        }
        this._output("_.appendChild(document.createTextNode(%s));", this._(text));
    },
    processingInstruction: function(name, text) {
        // JavaScript code to paste verbatum (wrapped in an empty function, of course);
        console.log("processingInstruction: %j %j", name, text);
        if (name == "js") {
            this._indent("(function(_) {");
            this._output(text);
            this._undent("})(_);");
        } else if (name == "xml") {
            //TODO: Verify it's first
        } else {
            //TODO: stick in template
        this._output(
            "_.appendChild(document.createProcessingInstruction(%s, %s));", 
            this._(name), this._(text)
            );
        }
    },
    onCdata: function(text) {
        // This is an XML-specific alternate representation of plain text.
        this.onCharacters(text);
    },
    onComment: function(text) {
        // Don't do anything
    },
    onError: function(msg) {
        console.log("onError: %j", msg);
        assert.ifError(msg);
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
