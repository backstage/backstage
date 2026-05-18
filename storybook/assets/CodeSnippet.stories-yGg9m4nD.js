import{j as e}from"./iframe-t9H7a1GP.js";import{C as t}from"./CodeSnippet-Ns24n3-t.js";import{I as o}from"./InfoCard-DoOIAODR.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-Ca_FhWzH.js";import"./styled-GR2b4kqg.js";import"./CopyTextButton-zOLhOJvH.js";import"./useCopyToClipboard-BaK9c688.js";import"./useMountedState-DJhuUCV5.js";import"./Tooltip-4n2HrPms.js";import"./Popper-gP0R36E2.js";import"./Portal-DcWiiunN.js";import"./index-CuWwFMcz.js";import"./CardContent-D4gwVKjB.js";import"./ErrorBoundary-nkUCCYQp.js";import"./ErrorPanel-DuXRqjsp.js";import"./WarningPanel-DQdBjCzo.js";import"./ExpandMore-Dtgj-XOJ.js";import"./AccordionDetails-CVmBM6rK.js";import"./index-B9sM2jn7.js";import"./Collapse-BxZNoJHM.js";import"./MarkdownContent-CR2NMh-B.js";import"./makeStyles-D3euK8x9.js";import"./Link-B3MFkp5k.js";import"./lodash-CR-8Qmjt.js";import"./useAnalytics-CPvjMD4k.js";import"./useApp-BO5_SDAO.js";import"./Grid-Cv9MyPTj.js";import"./List-0f6LLPdL.js";import"./ListContext-1ZEJeBTD.js";import"./ListItem-DkFcAkFQ.js";import"./ListItemText-VLp5yEt_.js";import"./LinkButton-6114--tA.js";import"./Button-HLfnNrg4.js";import"./CardHeader-IXTMVs3w.js";import"./Divider-CNlpK22j.js";import"./CardActions-C6L-qZ1_.js";import"./BottomLink-uONdOT3f.js";import"./ArrowForward-DsJwVzxj.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
