import{j as e}from"./iframe-Tg-tOL7r.js";import{C as t}from"./CodeSnippet-C5Tydu1Z.js";import{I as o}from"./InfoCard-BoC-VvBw.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-OYxHzwcw.js";import"./styled-vStV8VkZ.js";import"./CopyTextButton-Chh78sPf.js";import"./useCopyToClipboard-Cl1GCTia.js";import"./useMountedState-21qTsz5p.js";import"./Tooltip-YEgNEbvL.js";import"./Popper-Bs4wNPYC.js";import"./Portal-D1OaIdE9.js";import"./index-bEg_r36Z.js";import"./CardContent-BR8TvRAy.js";import"./ErrorBoundary-VtdSXZoH.js";import"./ErrorPanel-Dd70HXyQ.js";import"./WarningPanel-B6WHjrG9.js";import"./ExpandMore-D5uHqsby.js";import"./AccordionDetails-CKxrbGul.js";import"./index-B9sM2jn7.js";import"./Collapse-2l9C9_VC.js";import"./MarkdownContent-CdI6l00u.js";import"./makeStyles-BHicTeCr.js";import"./Link-Cr3hmmz_.js";import"./lodash-BweN80hA.js";import"./useAnalytics-DVZEM2og.js";import"./useApp-DATYOo-f.js";import"./Grid-CWzrm0bY.js";import"./List-Bn-Heble.js";import"./ListContext-Bmt6Pt9F.js";import"./ListItem-BxOtbo8f.js";import"./ListItemText-Bifl7FfV.js";import"./LinkButton-DIHqsybV.js";import"./Button-C-mblHrF.js";import"./CardHeader-CnIo8nzK.js";import"./Divider-Dat2vlo6.js";import"./CardActions-B7T0Kdp-.js";import"./BottomLink-BVJWmpAD.js";import"./ArrowForward-BYnwR7Ik.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
