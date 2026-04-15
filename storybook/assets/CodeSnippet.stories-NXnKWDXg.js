import{j as e}from"./iframe-K1-r__6v.js";import{C as t}from"./CodeSnippet-VWXx1uDM.js";import{I as o}from"./InfoCard-Dr4WyJXV.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-B4QFyYd3.js";import"./styled-Dvtyklio.js";import"./CopyTextButton-F41xXW8n.js";import"./useCopyToClipboard-BZjwlB7d.js";import"./useMountedState-BKHhStKI.js";import"./Tooltip-DwW2_HQ0.js";import"./Popper-nGRjgLcs.js";import"./Portal-sMTljpp0.js";import"./index-DpBtBlP-.js";import"./CardContent-OEVTrk4q.js";import"./ErrorBoundary-CjoWWqsk.js";import"./ErrorPanel-TINjs-TZ.js";import"./WarningPanel-CRkeNd9c.js";import"./ExpandMore-GHPOgA4J.js";import"./AccordionDetails-B5q_f95I.js";import"./index-B9sM2jn7.js";import"./Collapse-COvLNAfh.js";import"./MarkdownContent-loM_RY04.js";import"./makeStyles-cstAPlYX.js";import"./Link-B5LuFRSc.js";import"./lodash-DrAHxKI9.js";import"./useAnalytics-BPbkB55A.js";import"./useApp-qTVc4QMB.js";import"./Grid-ChuVeJzk.js";import"./List-CB2UH9Sb.js";import"./ListContext-DOXF3fgH.js";import"./ListItem-B_ZN_8ak.js";import"./ListItemText-Be1a_sGd.js";import"./LinkButton-DfamfGpH.js";import"./Button-4fxwjKev.js";import"./CardHeader-4vuolLbL.js";import"./Divider-DUGyrTwD.js";import"./CardActions-CAdY76Ae.js";import"./BottomLink-DNzGlP6r.js";import"./ArrowForward-BT_7OSP3.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
