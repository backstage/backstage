import{bR as e}from"./iframe-BvJPDVBV.js";import{C as t}from"./CodeSnippet-B3MZVWv-.js";import{I as o}from"./InfoCard-Du7CX6jL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D-x_07yS.js";import"./CardContent-BXhhwZJ2.js";import"./ErrorBoundary-DURwUBYx.js";import"./ErrorPanel-CooBuwoO.js";import"./WarningPanel-BiANO9m0.js";import"./ExpandMore-CpcuGUFx.js";import"./AccordionDetails-CqRqXsaw.js";import"./index-B9sM2jn7.js";import"./Collapse-CDxa-s3u.js";import"./MarkdownContent-STzFOCRt.js";import"./makeStyles-DyOUY6B2.js";import"./Link-DnetWwwd.js";import"./lodash-B7F9zazX.js";import"./useAnalytics-D2-jQxwo.js";import"./useApp-Db4LI50H.js";import"./Grid-DM4zpHaB.js";import"./List-BnAg8TSB.js";import"./ListContext-DJFdpsTI.js";import"./ListItem-CDg2S178.js";import"./ListItemText-BIQEiE57.js";import"./CopyTextButton-PR9fM2ep.js";import"./useCopyToClipboard-CJLQiF8u.js";import"./useMountedState-BBUEMOpo.js";import"./Tooltip-bJ-Oj7_3.js";import"./Popper-DlDpjqC3.js";import"./Portal-SYvoszGN.js";import"./LinkButton-CKPEIJNd.js";import"./Button-7juq2ou4.js";import"./CardHeader-C8HswRZH.js";import"./Divider-BbDnV3K6.js";import"./CardActions-DyjklAty.js";import"./BottomLink-BLafjx_m.js";import"./ArrowForward-B4spZCXe.js";import"./Box-CglGxEOc.js";import"./styled-DeJZjMKc.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
