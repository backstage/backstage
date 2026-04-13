import{j as e}from"./iframe-Pg_F-I9L.js";import{C as t}from"./CodeSnippet-B8fu7jLM.js";import{I as o}from"./InfoCard-DmYPc1-o.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-203OJvOv.js";import"./styled-CAdW7jEY.js";import"./CopyTextButton-DGA1dmmr.js";import"./useCopyToClipboard-B9rynQkB.js";import"./useMountedState-D6eLrfLV.js";import"./Tooltip-CpdE-o-J.js";import"./Popper-CaJ2KdJo.js";import"./Portal-CkW81tAw.js";import"./index-M3sqaKV4.js";import"./CardContent-abImMGpA.js";import"./ErrorBoundary-CEe_S_Z0.js";import"./ErrorPanel-DbzJVEOG.js";import"./WarningPanel-16oLvM6D.js";import"./ExpandMore-BaxmueBk.js";import"./AccordionDetails-BeAGU05y.js";import"./index-B9sM2jn7.js";import"./Collapse-C4uiH6iK.js";import"./MarkdownContent-33uXacfS.js";import"./makeStyles-Cbx_09Po.js";import"./Link-CtDLnTRC.js";import"./lodash-B6WwamON.js";import"./useAnalytics-DLzqrBGl.js";import"./useApp-Dqd5lgHs.js";import"./Grid-B2ie39ah.js";import"./List-6IhIysu1.js";import"./ListContext-CwmeD3xv.js";import"./ListItem-2g96ETpe.js";import"./ListItemText-Si6zf9CU.js";import"./LinkButton-BMLTQUVh.js";import"./Button-1fUtT4DD.js";import"./CardHeader-C3e2HlXR.js";import"./Divider-BhBPAqRx.js";import"./CardActions-Df2NHIvO.js";import"./BottomLink-CCwIoU7-.js";import"./ArrowForward-D-952dTn.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
