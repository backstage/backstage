import{j as e}from"./iframe-DpqnIERb.js";import{C as t}from"./CodeSnippet-BZN7CHRt.js";import{I as o}from"./InfoCard-DIeyI-8u.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-B2dMzSz4.js";import"./styled-iMmr_MI_.js";import"./CopyTextButton-BZ1rpe7z.js";import"./useCopyToClipboard-DxpZSgA2.js";import"./useMountedState-5johZ_Rp.js";import"./Tooltip-BVf39uWy.js";import"./Popper-DbBOQ0oU.js";import"./Portal-BmmQaE8x.js";import"./CardContent-B6Jpg0qe.js";import"./ErrorBoundary-Dt-Pq3d7.js";import"./ErrorPanel-9MxiIPAH.js";import"./WarningPanel-4qyRcOUk.js";import"./ExpandMore-BgvB3-yb.js";import"./AccordionDetails-Bu4VHsDj.js";import"./index-B9sM2jn7.js";import"./Collapse-BXZ4KKDG.js";import"./MarkdownContent-C_B0rjEe.js";import"./Grid-ByES49Fm.js";import"./List-CZbmWexd.js";import"./ListContext-BxawfRoI.js";import"./ListItem-D0Z8ElGo.js";import"./ListItemText-DoVLQ6VK.js";import"./LinkButton-ImbjNSpo.js";import"./Button-CVkCSpbG.js";import"./Link-CYlpUQKG.js";import"./lodash-Y_-RFQgK.js";import"./index-DoyRYStT.js";import"./useAnalytics-DvwM4ONZ.js";import"./useApp-BzWSwMGn.js";import"./CardHeader-BeO5U3X8.js";import"./Divider-BjLL1Xub.js";import"./CardActions-B9E1ejZA.js";import"./BottomLink-InnL8-4N.js";import"./ArrowForward-BUxo812p.js";const X={title:"Data Display/CodeSnippet",component:t},d={width:300},r=`const greeting = "Hello";
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
