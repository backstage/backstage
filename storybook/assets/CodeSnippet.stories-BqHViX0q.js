import{bR as e}from"./iframe-Bm5ba6Eo.js";import{C as t}from"./CodeSnippet-DRGENOjW.js";import{I as o}from"./InfoCard-Blmd2LJx.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ob8zNRki.js";import"./CardContent-Oxj5xcv3.js";import"./ErrorBoundary-D-LyUx_h.js";import"./ErrorPanel-NY_QZQW2.js";import"./WarningPanel-DkzSJ2lp.js";import"./ExpandMore-DZhVJ5gx.js";import"./AccordionDetails-BH84Cqgt.js";import"./index-B9sM2jn7.js";import"./Collapse-8dQvh7gn.js";import"./MarkdownContent-Ck3aSIvu.js";import"./makeStyles-BxPw9vCe.js";import"./Link-BddbTmYm.js";import"./lodash-KBhUdAYx.js";import"./useAnalytics-BQdStjBt.js";import"./useApp-kMVg8txh.js";import"./Grid-2YxRqddS.js";import"./List-CJhMPRPP.js";import"./ListContext-CVjS-G2V.js";import"./ListItem-UVpWaDMa.js";import"./ListItemText-D1JMY5d6.js";import"./CopyTextButton-BbbFijNF.js";import"./useCopyToClipboard-T3ghPtvH.js";import"./useMountedState-CX6Pdejq.js";import"./Tooltip-Dj-fCTBD.js";import"./Popper-SjxBkGs3.js";import"./Portal-Cg5Nvqt2.js";import"./LinkButton-CzF5F7Rn.js";import"./Button-DO8BgoM5.js";import"./CardHeader-XvYSFQzr.js";import"./Divider-DgXuoSNG.js";import"./CardActions-FOi2MCxZ.js";import"./BottomLink-D_epTU7i.js";import"./ArrowForward-zryWdhUC.js";import"./Box-NESd7kYt.js";import"./styled-DeEwf9nS.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
