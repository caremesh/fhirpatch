/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
import antlr4 from 'antlr4';
import Lexer from './generated/FHIRPathLexer.js';
import Parser from './generated/FHIRPathParser.js';
import PathListener from './generated/FHIRPathListener.js';
import ErrorListener from './error-listener.mjs';

const methods = [
  'enterEntireExpression',
  'exitEntireExpression',
  'enterIndexerExpression',
  'exitIndexerExpression',
  'enterPolarityExpression',
  'exitPolarityExpression',
  'enterAdditiveExpression',
  'exitAdditiveExpression',
  'enterMultiplicativeExpression',
  'exitMultiplicativeExpression',
  'enterUnionExpression',
  'exitUnionExpression',
  'enterOrExpression',
  'exitOrExpression',
  'enterAndExpression',
  'exitAndExpression',
  'enterMembershipExpression',
  'exitMembershipExpression',
  'enterInequalityExpression',
  'exitInequalityExpression',
  'enterInvocationExpression',
  'exitInvocationExpression',
  'enterEqualityExpression',
  'exitEqualityExpression',
  'enterImpliesExpression',
  'exitImpliesExpression',
  'enterTermExpression',
  'exitTermExpression',
  'enterTypeExpression',
  'exitTypeExpression',
  'enterInvocationTerm',
  'exitInvocationTerm',
  'enterLiteralTerm',
  'exitLiteralTerm',
  'enterExternalConstantTerm',
  'exitExternalConstantTerm',
  'enterParenthesizedTerm',
  'exitParenthesizedTerm',
  'enterNullLiteral',
  'exitNullLiteral',
  'enterBooleanLiteral',
  'exitBooleanLiteral',
  'enterStringLiteral',
  'exitStringLiteral',
  'enterNumberLiteral',
  'exitNumberLiteral',
  'enterDateTimeLiteral',
  'exitDateTimeLiteral',
  'enterTimeLiteral',
  'exitTimeLiteral',
  'enterQuantityLiteral',
  'exitQuantityLiteral',
  'enterExternalConstant',
  'exitExternalConstant',
  'enterMemberInvocation',
  'exitMemberInvocation',
  'enterFunctionInvocation',
  'exitFunctionInvocation',
  'enterThisInvocation',
  'exitThisInvocation',
  'enterIndexInvocation',
  'exitIndexInvocation',
  'enterTotalInvocation',
  'exitTotalInvocation',
  'enterFunctn',
  'exitFunctn',
  'enterParamList',
  'exitParamList',
  'enterQuantity',
  'exitQuantity',
  'enterUnit',
  'exitUnit',
  'enterDateTimePrecision',
  'exitDateTimePrecision',
  'enterPluralDateTimePrecision',
  'exitPluralDateTimePrecision',
  'enterTypeSpecifier',
  'exitTypeSpecifier',
  'enterQualifiedIdentifier',
  'exitQualifiedIdentifier',
  'enterIdentifier',
  'exitIdentifier',
];
class Listener extends PathListener {
  constructor(input) {
    super(input);

    for (const methodName of methods) {
      if (methodName.startsWith('enter')) {
        this.makeEnterNode(methodName);
      } else if (methodName.startsWith('exit')) {
        this.makeExitNode(methodName);
      }
    }

    this.ast = {};
    this.parentStack = [this.ast];
    this.node = null;
  }

  makeEnterNode(methodName) {
    function enterNode(ctx) {
      const parentNode = this.parentStack[this.parentStack.length - 1];
      const nodeType = methodName.slice(5); // remove "enter"
      this.node = {type: nodeType};
      this.node.text = ctx.getText();
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push(this.node);
      this.parentStack.push(this.node);
      // Also collect this node's terminal nodes, if any.  Terminal nodes are
      // not walked with the rest of the tree, but include things like "+" and
      // "-", which we need.
      this.node.terminalNodeText = [];
      for (const c of ctx.children) {
        // Test for node type "TerminalNodeImpl".  Minimized code no longer
        // has the original function names, so we can't rely on
        // c.constructor.name.  It appears the TerminalNodeImpl is the only
        // node with a "symbol" property, so test for that.
        if (c.symbol) {
          this.node.terminalNodeText.push(c.getText());
        }
      }
    };
    this[methodName] = enterNode.bind(this);
  }

  makeExitNode(methodName) {
    function exitNode(ctx) {
      this.parentStack.pop();
    }
    this[methodName] = exitNode.bind(this);
  }
}

export default function parse(path) {
  const chars = new antlr4.InputStream(path);
  const lexer = new Lexer(chars);

  const tokens = new antlr4.CommonTokenStream(lexer);


  const parser = new Parser(tokens);
  parser.buildParseTrees = true;
  const errors = [];
  const errorListener = new ErrorListener(errors);

  lexer.removeErrorListeners();
  lexer.addErrorListener(errorListener);
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

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

  const extractor = new Listener(parser);
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(extractor, tree);

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
  return extractor.ast;
};

