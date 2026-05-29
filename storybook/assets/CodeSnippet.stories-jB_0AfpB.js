import{bR as e}from"./iframe-t54gLFa0.js";import{C as t}from"./CodeSnippet-BgQ5VAqv.js";import{I as o}from"./InfoCard-DA8a0O2e.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-CMT-4mK8.js";import"./styled-CbrhIpjk.js";import"./CopyTextButton-C3ylSF4d.js";import"./useCopyToClipboard-CHiTKuc0.js";import"./useMountedState-54CMczLh.js";import"./Tooltip-CbljDWBy.js";import"./Popper-C582Ee7M.js";import"./Portal-Bh1zuHZS.js";import"./index-DX7uUS-A.js";import"./CardContent-C5KxQPUX.js";import"./ErrorBoundary-DQMRwnfT.js";import"./ErrorPanel-CIG-uEdq.js";import"./WarningPanel-RwP7igJQ.js";import"./ExpandMore-sn3c1e-H.js";import"./AccordionDetails-BJ9ncWuA.js";import"./index-B9sM2jn7.js";import"./Collapse-Ch3l8ZAc.js";import"./MarkdownContent-CMu20KNq.js";import"./makeStyles-DQwCtVrG.js";import"./Link-D4UteyGO.js";import"./lodash-D9iXkaqZ.js";import"./useAnalytics-mvrvRrti.js";import"./useApp-Cd5JmEQB.js";import"./Grid-BqPQ-ztq.js";import"./List-QkFCm4Dm.js";import"./ListContext-DqTTJq5i.js";import"./ListItem-d__Oj8We.js";import"./ListItemText-bolOwYFk.js";import"./LinkButton-C-a1kR7Z.js";import"./Button-Bw332Eet.js";import"./CardHeader-BBoLzgPg.js";import"./Divider-BFQ3spsH.js";import"./CardActions-CC-SYyDS.js";import"./BottomLink-C35dMnsZ.js";import"./ArrowForward-Cs6vCUlm.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
