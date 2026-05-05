import{j as e}from"./iframe-CBMR_Zns.js";import{C as t}from"./CodeSnippet-DAEyWRmV.js";import{I as o}from"./InfoCard-c544uTLL.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-DRo0xUou.js";import"./styled-Fdl9HABt.js";import"./CopyTextButton-CJEDUKzV.js";import"./useCopyToClipboard-B8cKa4TS.js";import"./useMountedState-CYyJnhmf.js";import"./Tooltip-C_Z4nOgm.js";import"./Popper-7279CciU.js";import"./Portal-HQVuNq59.js";import"./index-BkiKfy6N.js";import"./CardContent-CnnD02GI.js";import"./ErrorBoundary-Dy97mSdB.js";import"./ErrorPanel-C-svbPUf.js";import"./WarningPanel-CCW-lmK-.js";import"./ExpandMore-C7lVdomT.js";import"./AccordionDetails-CvJuRNsn.js";import"./index-B9sM2jn7.js";import"./Collapse-C0Mf3OWg.js";import"./MarkdownContent-CK1Ftajp.js";import"./makeStyles-sF8PfItD.js";import"./Link-DSfdg0tL.js";import"./lodash-CkAY2xSD.js";import"./useAnalytics-2o7uH7x2.js";import"./useApp-CBwGPM4M.js";import"./Grid-Dj5TTCpv.js";import"./List-yyB1VOVV.js";import"./ListContext-B9Lnotut.js";import"./ListItem-DwcTS-Gk.js";import"./ListItemText-C3372Kse.js";import"./LinkButton-C8L8ph7n.js";import"./Button-DZakymzu.js";import"./CardHeader-B6mPlsu1.js";import"./Divider-W3olFd1W.js";import"./CardActions-D4_UvN7u.js";import"./BottomLink-B69FlCkR.js";import"./ArrowForward-C3dox-7b.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
