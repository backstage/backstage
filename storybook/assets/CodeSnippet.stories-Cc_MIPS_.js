import{bR as e}from"./iframe-DhttR-Z-.js";import{C as t}from"./CodeSnippet-ClFaEFmB.js";import{I as o}from"./InfoCard-CnEqz6ZY.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B5_svkds.js";import"./CardContent-DosRVGgJ.js";import"./ErrorBoundary-m6gg4lWq.js";import"./ErrorPanel-D_q8qYhi.js";import"./WarningPanel-DgRNnxkJ.js";import"./ExpandMore-BIuXHLqD.js";import"./AccordionDetails-DRqafEwz.js";import"./index-B9sM2jn7.js";import"./Collapse-CQ74Gc0d.js";import"./MarkdownContent-CmlvBWEr.js";import"./makeStyles-C_GO-7Nl.js";import"./Link-CmpVD7EF.js";import"./lodash-B8DiURsi.js";import"./useAnalytics-Cg4YSIs1.js";import"./useApp-CHw-3fg9.js";import"./Grid-VkbE96t3.js";import"./List-DzoxYXEY.js";import"./ListContext-DPsuXuco.js";import"./ListItem-C_3NeckJ.js";import"./ListItemText-Cn8xzOI9.js";import"./CopyTextButton-BwcNHDZX.js";import"./useCopyToClipboard-CWfwN7Xp.js";import"./useMountedState-CE-seWbI.js";import"./Tooltip-CLkcFFIX.js";import"./Popper-CM66lfCc.js";import"./Portal-CqcvHw1l.js";import"./LinkButton-fvj8hkdN.js";import"./Button-mAQR2kmf.js";import"./CardHeader-DiO24i2z.js";import"./Divider-Dn59IuqE.js";import"./CardActions-DbjfBMuo.js";import"./BottomLink-DN9X3kyi.js";import"./ArrowForward-Huc5aJF9.js";import"./Box-CUxFOM_T.js";import"./styled-jJXBC4kr.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
