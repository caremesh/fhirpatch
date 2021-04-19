/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
import antlr4 from 'antlr4';
import Lexer from './generated/FHIRPathLexer.js';
import Parser from './generated/FHIRPathParser.js';
import PathListener from './generated/FHIRPathListener.js';
import ErrorListener from './error-listener.mjs';

function enterNode(ctx) {
  const parentNode = this.parentStack[this.parentStack.length - 1];
  const nodeType = p.slice(5); // remove "enter"
  this._node = {type: nodeType};
  this._node.text = ctx.getText();
  if (!parentNode.children) {
    parentNode.children = [];
  }
  parentNode.children.push(this._node);
  this.parentStack.push(this._node);
  // Also collect this node's terminal nodes, if any.  Terminal nodes are
  // not walked with the rest of the tree, but include things like "+" and
  // "-", which we need.
  this._node.terminalNodeText = [];
  for (const c of ctx.children) {
    // Test for node type "TerminalNodeImpl".  Minimized code no longer
    // has the original function names, so we can't rely on
    // c.constructor.name.  It appears the TerminalNodeImpl is the only
    // node with a "symbol" property, so test for that.
    if (c.symbol) {
      node.terminalNodeText.push(c.getText());
    }
  }
};

function exitNode(ctx) {
  parentStack.pop();
}

class Listener extends PathListener {
  constructor() {
    super();
    const superclass = Object.getPrototypeOf(this);
    for (const methodName of Object.getOwnPropertyNames(superclass)) {
      if (methodName.startsWith('enter')) {
        this[methodName] = enterNode.bind(this);
      } else if (methodName.startsWith('exit')) {
        this[methodName] = exitNode.bind(this);
      }
    }

    this.ast = {};
    this._parentStack = [this.ast];
    this._node = null;
  }
}

export default function parse(path) {
  const chars = new antlr4.InputStream(path);
  const lexer = new Lexer(chars);

  const tokens = new antlr4.CommonTokenStream(lexer);


  const parser = new Parser(tokens);
  parser.buildParseTrees = true;
  const errors = [];
  const listener = new ErrorListener(errors);

  lexer.removeErrorListeners();
  lexer.addErrorListener(listener);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);

  const tree = parser.entireExpression();

  // function PathListener() {
  //   Listener.call(this); // inherit default listener
  //   return this;
  // }
  // // inherit default listener
  // PathListener.prototype = Object.create(Listener.prototype);
  // PathListener.prototype.constructor = PathListener;

  // const ast = {};
  // let node;
  // const parentStack = [ast];
  // for (const p of Object.keys(Listener.prototype)) {
  //   if (p.startsWith('enter')) {
  //     PathListener.prototype[p] = function(ctx) {
  //       const parentNode = parentStack[parentStack.length - 1];
  //       const nodeType = p.slice(5); // remove "enter"
  //       node = {type: nodeType};
  //       node.text = ctx.getText();
  //       if (!parentNode.children) {
  //         parentNode.children = [];
  //       }
  //       parentNode.children.push(node);
  //       parentStack.push(node);
  //       // Also collect this node's terminal nodes, if any.  Terminal nodes are
  //       // not walked with the rest of the tree, but include things like "+" and
  //       // "-", which we need.
  //       node.terminalNodeText = [];
  //       for (const c of ctx.children) {
  //         // Test for node type "TerminalNodeImpl".  Minimized code no longer
  //         // has the original function names, so we can't rely on
  //         // c.constructor.name.  It appears the TerminalNodeImpl is the only
  //         // node with a "symbol" property, so test for that.
  //         if (c.symbol) {
  //           node.terminalNodeText.push(c.getText());
  //         }
  //       }
  //     };
  //   } else if (p.startsWith('exit')) {
  //     PathListener.prototype[p] = function() {
  //       parentStack.pop();
  //     };
  //   }
  // }

  const printer = new Listener();
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(printer, tree);

  if (errors.length > 0) {
    const errMsgs = [];
    for (let i=0, len=errors.length; i<len; ++i) {
      const err = errors[i];
      const msg = 'line: '+err[2]+'; column: '+ err[3]+'; message: '+err[4];
      errMsgs.push(msg);
    }
    const e = new Error(errMsgs.join('\n'));
    e.errors = errors;
    throw e;
  }
  return printer.ast;
};

