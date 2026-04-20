import{j as e}from"./iframe-ePBrCY0J.js";import{C as t}from"./CodeSnippet-Bp5-FRLj.js";import{I as o}from"./InfoCard-CrRTojCB.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-BIZWnQoQ.js";import"./styled-CDpOoIv_.js";import"./CopyTextButton-ScZPcQ2s.js";import"./useCopyToClipboard-B7cxcCPK.js";import"./useMountedState-CkgQ1DIy.js";import"./Tooltip-BVbTMuZj.js";import"./Popper-OUHWMupJ.js";import"./Portal-IwhLFSRr.js";import"./index-CGuJQhUk.js";import"./CardContent-D74Pdnas.js";import"./ErrorBoundary-DjXiKZYS.js";import"./ErrorPanel-CCZWyhZF.js";import"./WarningPanel-DefnbV6a.js";import"./ExpandMore-8D1cEb8U.js";import"./AccordionDetails-Bypwgwcr.js";import"./index-B9sM2jn7.js";import"./Collapse-DrrnMWQn.js";import"./MarkdownContent-B9OpY1S2.js";import"./makeStyles-B9PTu9_J.js";import"./Link-ccW_HqBW.js";import"./lodash-ByXYgI5E.js";import"./useAnalytics-DJbOQ4-_.js";import"./useApp-BF4JYTvB.js";import"./Grid-CKyhvvof.js";import"./List-Bvl_gPz2.js";import"./ListContext-3JA2nXVD.js";import"./ListItem-U6U0AzIJ.js";import"./ListItemText-B5XnGeSi.js";import"./LinkButton-BkVqBRbz.js";import"./Button-D12VZckj.js";import"./CardHeader-ByUAEt3j.js";import"./Divider-Cq_JEH3o.js";import"./CardActions-CS5Im1vT.js";import"./BottomLink-CNekpOuP.js";import"./ArrowForward-D7hR6khY.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
