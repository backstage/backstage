import{j as e}from"./iframe-C8uhRVJE.js";import{C as t}from"./CodeSnippet-BrHkgkym.js";import{I as o}from"./InfoCard-Bk92sx2c.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-CqSl_hUY.js";import"./styled-CsbE0ba0.js";import"./CopyTextButton-DUWRsVAM.js";import"./useCopyToClipboard-Btd4dIqz.js";import"./useMountedState-D0BWMouD.js";import"./Tooltip-Dm66oIkk.js";import"./Popper-DTopPJJ5.js";import"./Portal-DGxbDxZD.js";import"./CardContent-DO-1k1lO.js";import"./ErrorBoundary-Cfj40CJD.js";import"./ErrorPanel-ByR9HTcg.js";import"./WarningPanel-DEmZ2skU.js";import"./ExpandMore-hZ2c00bV.js";import"./AccordionDetails-CeLa6pif.js";import"./index-B9sM2jn7.js";import"./Collapse-DlLfqGWf.js";import"./MarkdownContent-BWUzH6fM.js";import"./Grid-C5ZyGaTv.js";import"./List-DvPRKsUn.js";import"./ListContext-CLNvlY7i.js";import"./ListItem-CMqPdlpf.js";import"./ListItemText-u8pHhn01.js";import"./LinkButton-CZufjSdE.js";import"./Button-BSbGK_Ct.js";import"./Link-BbMg_ACg.js";import"./lodash-Y_-RFQgK.js";import"./index-BYn64cw2.js";import"./useAnalytics-CMB7EDSs.js";import"./useApp-IzIBR1Vv.js";import"./CardHeader-HGudaM0-.js";import"./Divider-BSVlJEqX.js";import"./CardActions-CbO-K8b_.js";import"./BottomLink-CsfZ_ZcK.js";import"./ArrowForward-DNYazqhw.js";const X={title:"Data Display/CodeSnippet",component:t},d={width:300},r=`const greeting = "Hello";
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
