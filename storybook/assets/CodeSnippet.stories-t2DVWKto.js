import{j as e}from"./iframe-CwGYDpYH.js";import{C as t}from"./CodeSnippet-CAWaV5he.js";import{I as o}from"./InfoCard-BclgKvWF.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-DK8SMPjv.js";import"./styled-Bo4D4TjS.js";import"./CopyTextButton-CafBm5cp.js";import"./useCopyToClipboard-Dl6M58F9.js";import"./useMountedState-DGAu4OuG.js";import"./Tooltip-0URE30Se.js";import"./Popper-B-_f95Yk.js";import"./Portal-ChQ23K-b.js";import"./index-fEpbvEIU.js";import"./CardContent-D8KknM98.js";import"./ErrorBoundary-Bk984qzw.js";import"./ErrorPanel-51u8WX4S.js";import"./WarningPanel-5ArBzLiS.js";import"./ExpandMore-C1vGF3Td.js";import"./AccordionDetails-AiT2KCk_.js";import"./index-B9sM2jn7.js";import"./Collapse-BaMd2IqY.js";import"./MarkdownContent-sJutuZpy.js";import"./makeStyles-B-7ejBjc.js";import"./Link-CswoIIi-.js";import"./lodash-DVkgycFV.js";import"./useAnalytics-Bir4eJYF.js";import"./useApp-hwqbTLFx.js";import"./Grid-D9pxZO34.js";import"./List-D7ewfho0.js";import"./ListContext-B7RocSCf.js";import"./ListItem-a-yOdytX.js";import"./ListItemText-DX5F26PV.js";import"./LinkButton-vZfXRNSn.js";import"./Button-i77kpIMD.js";import"./CardHeader-XNHnYtjo.js";import"./Divider-CRsARYGl.js";import"./CardActions-BWRJ52dL.js";import"./BottomLink-CAOlzqUR.js";import"./ArrowForward-pstlmdeK.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
