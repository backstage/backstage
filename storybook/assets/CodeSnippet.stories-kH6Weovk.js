import{bR as e}from"./iframe-BhJ5Dr2k.js";import{C as t}from"./CodeSnippet-B8NGtC5C.js";import{I as o}from"./InfoCard-BpKN3oTr.js";import"./preload-helper-PPVm8Dsz.js";import"./index--C479yzh.js";import"./CardContent-3EgiTo2Z.js";import"./ErrorBoundary-CafD9WVt.js";import"./ErrorPanel-D4FsxPlh.js";import"./WarningPanel-BEp5BZIq.js";import"./ExpandMore-BKKO7hh3.js";import"./AccordionDetails-B7ZvhU_V.js";import"./index-B9sM2jn7.js";import"./Collapse-pJkUGgh5.js";import"./MarkdownContent-COPR2F0H.js";import"./makeStyles-DYyKjhyQ.js";import"./Link-CC_KtSOn.js";import"./lodash-B1ZVbPgx.js";import"./useAnalytics-DNfXVerI.js";import"./useApp-CYIhR5HZ.js";import"./Grid-DDRFl87z.js";import"./List-CgBnxwYg.js";import"./ListContext-f6zilHA_.js";import"./ListItem-C_QyLOpG.js";import"./ListItemText-BMtWvFgB.js";import"./CopyTextButton-DoIKDSbP.js";import"./useCopyToClipboard-DfFPONnd.js";import"./useMountedState-C_QJXoN6.js";import"./Tooltip-cVotykzK.js";import"./Popper-FZP7SLCD.js";import"./Portal-wkxcFvaf.js";import"./LinkButton-DBbVw5HL.js";import"./Button-DJugJdqz.js";import"./CardHeader-a0HWiRyp.js";import"./Divider-DUf9-sOW.js";import"./CardActions-Ctll2lFR.js";import"./BottomLink-CuTIp3aF.js";import"./ArrowForward-DrvWPx9h.js";import"./Box-Y2xnXHg0.js";import"./styled-w-HNwOwS.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
