import{j as e}from"./iframe-izSSIzTR.js";import{C as t}from"./CodeSnippet-2YpUyrCc.js";import{I as o}from"./InfoCard-ZCxp9PJ1.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-BA3YWuLj.js";import"./styled-DV0BGOgt.js";import"./CopyTextButton-DrhwHmvQ.js";import"./useCopyToClipboard-DpcsO0N1.js";import"./useMountedState-BNHFfL0T.js";import"./Tooltip-BCaU-ke_.js";import"./Popper-BmNk75vF.js";import"./Portal-gwFfNa32.js";import"./index-DfUIGjtL.js";import"./CardContent-k4C88kX7.js";import"./ErrorBoundary-m_fXQdQl.js";import"./ErrorPanel-fD8NSdri.js";import"./WarningPanel-BM3a2g3z.js";import"./ExpandMore-Cro6Rs4P.js";import"./AccordionDetails-B2SuDynl.js";import"./index-B9sM2jn7.js";import"./Collapse-61rLnbUv.js";import"./MarkdownContent-B9NWTZGU.js";import"./makeStyles-efJG6AvH.js";import"./Link-2J958yax.js";import"./lodash-BqgGC0cZ.js";import"./useAnalytics-DIHZCFHN.js";import"./useApp-CAU_EJC9.js";import"./Grid-DS_Ye4hI.js";import"./List-Bk9wyVdJ.js";import"./ListContext-CKBIT16f.js";import"./ListItem-CLO1ybEL.js";import"./ListItemText-BVZ15Dno.js";import"./LinkButton-CqYeh63o.js";import"./Button-XKiaKw4a.js";import"./CardHeader-DFdiwyFZ.js";import"./Divider-CT2SL79S.js";import"./CardActions-BknE5WyV.js";import"./BottomLink-yltqlLxB.js";import"./ArrowForward-CKhRAqQ5.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
