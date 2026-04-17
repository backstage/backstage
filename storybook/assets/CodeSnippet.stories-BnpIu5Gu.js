import{j as e}from"./iframe-BemVm3iW.js";import{C as t}from"./CodeSnippet-CkD9Jg-W.js";import{I as o}from"./InfoCard-tqdQ9iZm.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-7KDenMHz.js";import"./styled-C58he6hV.js";import"./CopyTextButton-ClwD2Tiu.js";import"./useCopyToClipboard-BH3nj1RT.js";import"./useMountedState-DjTA7C2l.js";import"./Tooltip-hyP9rZZW.js";import"./Popper-BaVns9-l.js";import"./Portal-CR5LO1QX.js";import"./index-B743ax-R.js";import"./CardContent-Bhe01hXI.js";import"./ErrorBoundary-BHku2_sA.js";import"./ErrorPanel-DrgKHuXs.js";import"./WarningPanel-CM40nkjW.js";import"./ExpandMore--lDgnP_6.js";import"./AccordionDetails-DTt7V5rY.js";import"./index-B9sM2jn7.js";import"./Collapse-IMjZlHsi.js";import"./MarkdownContent-DtZxppSm.js";import"./makeStyles-C7F85DJE.js";import"./Link-cfxBzomB.js";import"./lodash-C0pW7aP-.js";import"./useAnalytics-DC6bz4bN.js";import"./useApp-Cm_EfMWP.js";import"./Grid-DEKpYIQV.js";import"./List-DrSzlW8g.js";import"./ListContext-ACqJPmwm.js";import"./ListItem-C4gGRMdA.js";import"./ListItemText-Cci1p3Kg.js";import"./LinkButton-L5-DU4c9.js";import"./Button-Bd1A66p0.js";import"./CardHeader-B5QhMxPY.js";import"./Divider-DMpaR7VZ.js";import"./CardActions-CQZHnxGP.js";import"./BottomLink-B7G4mSKP.js";import"./ArrowForward-BSaUdY_l.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
