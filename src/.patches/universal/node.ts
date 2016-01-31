import { Provider, OpaqueToken } from 'angular2/core';
import { COMPILER_PROVIDERS } from 'angular2/compiler';
import { NODE_PROVIDERS, NODE_APPLICATION_PROVIDERS } from 'angular2-universal-preview';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
import { DOCUMENT } from 'angular2/platform/common_dom';
import { Title } from 'angular2/src/platform/browser/title';
import { ServerTitle } from './server_title';

const { Parser, TreeAdapters } = require('parse5');

const parser = new Parser(TreeAdapters.htmlparser2);

function isTag(tagName, node) {
  return node.type === 'tag' && node.name === tagName;
}

function createDocument(html) {
  const doc = parser.parse(html);
  let rootNode, bodyNode, headNode, titleNode;
  
  for (let i = 0; i < doc.children.length; ++i) {
    const child = doc.children[i];

    if (isTag('html', child)) {
      rootNode = child;
      break;
    }  
  }
  
  if (!rootNode) { rootNode = doc }
  
  for (let i = 0; i < rootNode.children.length; ++i) {   
    const child = rootNode.children[i];
    
    if (isTag('head', child)) { headNode = child }
    if (isTag('body', child)) { bodyNode = child }
  }
  
  if (!headNode) {
    headNode = parser.treeAdapter.createElement('head', null, []);
    DOM.appendChild(doc, headNode);
  }

  if (!bodyNode) {
    bodyNode = parser.treeAdapter.createElement('body', null, []);
    DOM.appendChild(doc, headNode);
  }      
  
  for (let i = 0; i < headNode.children.length; ++i) {
    if (isTag('title', headNode.children[i])) { titleNode = headNode.children[i] }
  }
  
  if (!titleNode) {
    titleNode = parser.treeAdapter.createElement('title', null, []);
    DOM.appendChild(headNode, titleNode);
  }
  
  doc._window = {};
  
  doc.head = headNode;
  doc.body = bodyNode;

  const titleNodeText = titleNode.children[0];
  
  Object.defineProperty(doc, 'title', {
    get: () => titleNodeText.data,
    set: (newTitle) => titleNodeText.data = newTitle
  });
  
  return doc;
}

export const DOCUMENT_HTML = new OpaqueToken('html');

export const PLATFORM_PROVIDERS = [
  ...NODE_PROVIDERS
];

export const APPLICATION_PROVIDERS = [
  ...NODE_APPLICATION_PROVIDERS,
  ServerTitle,
  new Provider(DOCUMENT, { deps: [DOCUMENT_HTML], useFactory: createDocument }),
  new Provider(Title, { useExisting: ServerTitle })
];
