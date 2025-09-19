import{j as e}from"./iframe-hd6BgcQH.js";import{C as t}from"./CodeSnippet-BlQm8FHA.js";import{I as o}from"./InfoCard-DXQ7_Apb.js";import"./preload-helper-D9Z9MdNV.js";import"./Box-C4_Hx4tK.js";import"./styled-Csv0DLFw.js";import"./CopyTextButton-C8AIAO8L.js";import"./useCopyToClipboard-ZIjVTeCY.js";import"./useMountedState-BwuO-QSl.js";import"./Tooltip-DHFXXWJ1.js";import"./Popper-BLI_ywQx.js";import"./Portal-QtjodaYU.js";import"./CardContent-Da9FNRpD.js";import"./ErrorBoundary-BxDyxJNA.js";import"./ErrorPanel-pwFCh6zc.js";import"./WarningPanel-Le2tKfrN.js";import"./ExpandMore-C7-67hd9.js";import"./AccordionDetails-DosuP5Ed.js";import"./index-DnL3XN75.js";import"./Collapse-D-UdipB4.js";import"./MarkdownContent-aZlBpoZT.js";import"./Grid-C4Dm4yGa.js";import"./List-Eydl9qQR.js";import"./ListContext-DMV1tqqG.js";import"./ListItem-BuICECdF.js";import"./ListItemText-B0MXj_oA.js";import"./LinkButton-DUOFEHwI.js";import"./Button-3MbgNa_D.js";import"./Link-DIsoXdRS.js";import"./lodash-CwBbdt2Q.js";import"./index-BvioCNb0.js";import"./useAnalytics-BNw5WHP5.js";import"./useApp-D57mFECn.js";import"./CardHeader-ChJbkXh1.js";import"./Divider-BsrVsHFl.js";import"./CardActions-Ci4WOTdw.js";import"./BottomLink-BlsHV6Ti.js";import"./ArrowForward-Bdq2LjKG.js";const X={title:"Data Display/CodeSnippet",component:t},d={width:300},r=`const greeting = "Hello";
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
  </InfoCard>`,...l.parameters?.docs?.source}}};const Z=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{l as CopyCode,s as Default,p as Languages,i as LineNumbers,a as MultipleLines,n as Overflow,Z as __namedExportsOrder,X as default};
