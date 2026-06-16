import{bR as e}from"./iframe-A5q7KvPV.js";import{C as t}from"./CodeSnippet-DoTexFgi.js";import{I as o}from"./InfoCard-H4Ryzna6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CPIaraR9.js";import"./CardContent-DfXmyZWT.js";import"./ErrorBoundary-x1jah5kw.js";import"./ErrorPanel-BFFMrVVW.js";import"./WarningPanel-aF7tzwTa.js";import"./ExpandMore-DZiXAgMM.js";import"./AccordionDetails-CJeHfiZr.js";import"./index-B9sM2jn7.js";import"./Collapse-DNyQVL9b.js";import"./MarkdownContent-97mqW_uF.js";import"./makeStyles-BSDvNkE_.js";import"./Link-BMgV47st.js";import"./lodash-9IYu6p8I.js";import"./useAnalytics-Ds2gUWuY.js";import"./useApp-Rwr12CC0.js";import"./Grid-B2YGGSgc.js";import"./List-BHb0DGH0.js";import"./ListContext-BrmWluE9.js";import"./ListItem-CLjawmK4.js";import"./ListItemText-BWLQ0n6h.js";import"./CopyTextButton-DvCyKSRO.js";import"./useCopyToClipboard-BHlmIXZx.js";import"./useMountedState-D9Kraart.js";import"./Tooltip-DV_BwGfD.js";import"./Popper-FC50uWcj.js";import"./Portal-CYnqZvqi.js";import"./LinkButton-DwdvCoY4.js";import"./Button-C6s0yYXo.js";import"./CardHeader-BNihrFza.js";import"./Divider-yQcNjI7O.js";import"./CardActions-DpHVhXbj.js";import"./BottomLink-BtHfKJYB.js";import"./ArrowForward-DqYLsbrK.js";import"./Box-Do1kLFaD.js";import"./styled-CaiGGCTB.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
