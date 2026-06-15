import{bR as e}from"./iframe-DQDMWdhR.js";import{C as t}from"./CodeSnippet-DtU3_YHx.js";import{I as o}from"./InfoCard-BeZY1A2v.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DY_5w8ej.js";import"./CardContent-CJZuQje0.js";import"./ErrorBoundary-DdzzXEjn.js";import"./ErrorPanel-COcAsJP5.js";import"./WarningPanel-BgagYreT.js";import"./ExpandMore-DOwjJ_du.js";import"./AccordionDetails--_XJ7ukc.js";import"./index-B9sM2jn7.js";import"./Collapse-BfmpBEPX.js";import"./MarkdownContent-CwNfWeSX.js";import"./makeStyles-B5aW9Q-2.js";import"./Link-Cl_RxpbQ.js";import"./lodash-3i45iK7k.js";import"./useAnalytics-IT8D4hNJ.js";import"./useApp-CTum3p-d.js";import"./Grid-BqTQ24QW.js";import"./List-BphJ6ppe.js";import"./ListContext-K2B4oL84.js";import"./ListItem-DO9NzT1C.js";import"./ListItemText-2PUuT8MN.js";import"./CopyTextButton-DECt3aqZ.js";import"./useCopyToClipboard-Dbaufu2W.js";import"./useMountedState-DN-AA97d.js";import"./Tooltip-CHviRUrF.js";import"./Popper-DRhkdNdl.js";import"./Portal-Dba-4_gW.js";import"./LinkButton-DJVfqbx9.js";import"./Button-7lQi3A0V.js";import"./CardHeader-BsGAmlpx.js";import"./Divider-DomKsQ_s.js";import"./CardActions-JpsaTh9B.js";import"./BottomLink-Dr1ttUZB.js";import"./ArrowForward-BUt1Qfk4.js";import"./Box-BSlsrAFI.js";import"./styled-DGFjQDj-.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
