import{j as e}from"./iframe-Co8mkF6n.js";import{C as t}from"./CodeSnippet-DAxN1hXq.js";import{I as o}from"./InfoCard-BBZj5Jg_.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-DA6OOHjA.js";import"./styled-JXjQDdCt.js";import"./CopyTextButton-DnLw8rkj.js";import"./useCopyToClipboard-9wtNivfI.js";import"./useMountedState-CQLsF9D-.js";import"./Tooltip-By13aFvS.js";import"./Popper-DLIxumuv.js";import"./Portal-Dx4WX7P_.js";import"./index-Cw_DALCy.js";import"./CardContent-CBszlJdr.js";import"./ErrorBoundary-DnXF6UH5.js";import"./ErrorPanel-DVo3pUGz.js";import"./WarningPanel-aG9DE5Tq.js";import"./ExpandMore-mAw3t7Lg.js";import"./AccordionDetails-CcuO3Mzb.js";import"./index-B9sM2jn7.js";import"./Collapse-QUv5fteM.js";import"./MarkdownContent-F_TSR_3r.js";import"./makeStyles-CFpzSHZa.js";import"./Link-C5p9O8kc.js";import"./lodash-PVyZah61.js";import"./useAnalytics-BZJh0YtL.js";import"./useApp-DuP2kRR6.js";import"./Grid-Bhd9sgun.js";import"./List-BISM21Ia.js";import"./ListContext-DLNgH7rU.js";import"./ListItem-Bi_Q5yAP.js";import"./ListItemText-BLNlDTGS.js";import"./LinkButton-DYc2_6PS.js";import"./Button-BfCaCzhB.js";import"./CardHeader-DZqR2bM_.js";import"./Divider-Do-RRSQA.js";import"./CardActions-C_pplrmA.js";import"./BottomLink-CvXc5wWP.js";import"./ArrowForward-CacgvP_Y.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
