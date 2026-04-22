import{j as e}from"./iframe-CC8dZ5v0.js";import{C as t}from"./CodeSnippet-C42Dz4me.js";import{I as o}from"./InfoCard-Cnayyfyv.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-BhabvipW.js";import"./styled-CM_Xf2DM.js";import"./CopyTextButton-DE0i5KZb.js";import"./useCopyToClipboard-C2Esnc-g.js";import"./useMountedState-BiVC6Sna.js";import"./Tooltip-DdmdxGgY.js";import"./Popper-B3_-o048.js";import"./Portal-COibyzBH.js";import"./index-twBdpm7Y.js";import"./CardContent-BsQdVfoF.js";import"./ErrorBoundary-BZGoOp-s.js";import"./ErrorPanel-CLfUZ9ms.js";import"./WarningPanel-CIUGXjzm.js";import"./ExpandMore-RARwx0Xw.js";import"./AccordionDetails-C7iUogkW.js";import"./index-B9sM2jn7.js";import"./Collapse-0iMZ9ReK.js";import"./MarkdownContent--WfXG79O.js";import"./makeStyles-DTH3glJL.js";import"./Link-ORDuPGhJ.js";import"./lodash-BzWoCuL2.js";import"./useAnalytics-4dX8X2S1.js";import"./useApp-DJZpM7fA.js";import"./Grid-CCYqzPMW.js";import"./List-D-_F1OrG.js";import"./ListContext-Bfuv36sR.js";import"./ListItem-B4tF2XTx.js";import"./ListItemText-DP3OOKih.js";import"./LinkButton-DUC3MA6m.js";import"./Button-D-oxz3_H.js";import"./CardHeader-G7oj26gV.js";import"./Divider-BDaqKUXC.js";import"./CardActions-5idev0LJ.js";import"./BottomLink-BLMe8zPx.js";import"./ArrowForward-BbfO88sj.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
const world = "World";

const greet = person => greeting + " " + person + "!";

greet(world);
`,m=`const greeting: string = "Hello";
const world: string = "World";

const greet = (person: string): string => greeting + " " + person + "!";

greet(world);
`,c=`greeting = "Hello"
world = "World"

def greet(person):
    return f"{greeting} {person}!"

greet(world)
`,s=()=>e.jsx(o,{title:"JavaScript example",children:e.jsx(t,{text:"const hello = 'World';",language:"javascript"})}),a=()=>e.jsx(o,{title:"JavaScript multi-line example",children:e.jsx(t,{text:r,language:"javascript"})}),i=()=>e.jsx(o,{title:"Show line numbers",children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})}),n=()=>e.jsxs(o,{title:"Overflow",children:[e.jsx("div",{style:d,children:e.jsx(t,{text:r,language:"javascript"})}),e.jsx("div",{style:d,children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})})]}),p=()=>e.jsxs(o,{title:"Multiple languages",children:[e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0}),e.jsx(t,{text:m,language:"typescript",showLineNumbers:!0}),e.jsx(t,{text:c,language:"python",showLineNumbers:!0})]}),l=()=>e.jsx(o,{title:"Copy Code",children:e.jsx(t,{text:r,language:"javascript",showCopyCodeButton:!0})});s.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"MultipleLines"};i.__docgenInfo={description:"",methods:[],displayName:"LineNumbers"};n.__docgenInfo={description:"",methods:[],displayName:"Overflow"};p.__docgenInfo={description:"",methods:[],displayName:"Languages"};l.__docgenInfo={description:"",methods:[],displayName:"CopyCode"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript example">
    <CodeSnippet text="const hello = 'World';" language="javascript" />
  </InfoCard>`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript multi-line example">
    <CodeSnippet text={JAVASCRIPT} language="javascript" />
  </InfoCard>`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => <InfoCard title="Show line numbers">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
  </InfoCard>`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => <InfoCard title="Overflow">
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" />
    </div>
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    </div>
  </InfoCard>`,...n.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => <InfoCard title="Multiple languages">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    <CodeSnippet text={TYPESCRIPT} language="typescript" showLineNumbers />
    <CodeSnippet text={PYTHON} language="python" showLineNumbers />
  </InfoCard>`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => <InfoCard title="Copy Code">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showCopyCodeButton />
  </InfoCard>`,...l.parameters?.docs?.source}}};const $=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{l as CopyCode,s as Default,p as Languages,i as LineNumbers,a as MultipleLines,n as Overflow,$ as __namedExportsOrder,Z as default};
