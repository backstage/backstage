import{j as e}from"./iframe-BbcE2xlx.js";import{C as t}from"./CodeSnippet-C8m-Ujvi.js";import{I as o}from"./InfoCard-Dd6u2Tvl.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-DV7TtJ3X.js";import"./styled-CYn__la3.js";import"./CopyTextButton-DODSIrEV.js";import"./useCopyToClipboard-CYB6N8c9.js";import"./useMountedState-OO1MzqbQ.js";import"./Tooltip-DGQL3ZPr.js";import"./Popper-BWJvOSAM.js";import"./Portal-Dt7280Bv.js";import"./index-DfiyOdhX.js";import"./CardContent-Co_XGHGa.js";import"./ErrorBoundary-CCQ1CIP4.js";import"./ErrorPanel-CqTIImcD.js";import"./WarningPanel-xT0w7WLy.js";import"./ExpandMore-BlT2jwO9.js";import"./AccordionDetails-r5DmlixB.js";import"./index-B9sM2jn7.js";import"./Collapse-L8V7cMC0.js";import"./MarkdownContent-DMHIxffD.js";import"./makeStyles-ByEaUd5i.js";import"./Link-IFkxtfSo.js";import"./lodash--S21zL8B.js";import"./useAnalytics-BQ8kZAPF.js";import"./useApp-lAnrRgXP.js";import"./Grid-AQTL701u.js";import"./List-Bm-97Bpf.js";import"./ListContext-D5tjuQRC.js";import"./ListItem-BurMZ2sa.js";import"./ListItemText-C2fSQsN6.js";import"./LinkButton-Du7c7LFm.js";import"./Button-D3ZO0Cbq.js";import"./CardHeader-DDmTaiP0.js";import"./Divider-DkzbiSpR.js";import"./CardActions-DPDnyCnz.js";import"./BottomLink-DPIZD8uA.js";import"./ArrowForward-C53efLk6.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
