import{j as e}from"./iframe-B7ESvRaB.js";import{C as t}from"./CodeSnippet-BuVXZKcB.js";import{I as o}from"./InfoCard-DVDPk2sg.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-BGVcxrSI.js";import"./styled-BYmoTReO.js";import"./CopyTextButton-CEaatXng.js";import"./useCopyToClipboard-PWgpe9Dd.js";import"./useMountedState-BXWtuRQC.js";import"./Tooltip-DDcr_SxO.js";import"./Popper-B4XOTFHE.js";import"./Portal-Dv8WnOrA.js";import"./index-DWyhtxdM.js";import"./CardContent-5fJmHd_l.js";import"./ErrorBoundary-CatcXn1H.js";import"./ErrorPanel-m--ZC33I.js";import"./WarningPanel-U0rftR-m.js";import"./ExpandMore-DiriN8Nn.js";import"./AccordionDetails-CItzjruw.js";import"./index-B9sM2jn7.js";import"./Collapse-CS_qsOih.js";import"./MarkdownContent-xPhYglMC.js";import"./makeStyles-D6c8jQg1.js";import"./Link-BVbc5K8M.js";import"./lodash-Bt12QuHv.js";import"./useAnalytics-DL1ROu7Z.js";import"./useApp--u6yStsZ.js";import"./Grid-DUZSx2Cf.js";import"./List-BzC9H2Gx.js";import"./ListContext-Cg-0b41u.js";import"./ListItem-D3zRoU3Q.js";import"./ListItemText-B-vocj-6.js";import"./LinkButton-xOjkJYqU.js";import"./Button-DQmR4fSC.js";import"./CardHeader-Bn7lPt5s.js";import"./Divider-BR90CobV.js";import"./CardActions-Ds4C0emW.js";import"./BottomLink-7ZuukCy5.js";import"./ArrowForward-BtiVNM8z.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
