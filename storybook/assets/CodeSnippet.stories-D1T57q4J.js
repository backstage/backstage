import{j as e}from"./iframe-BkP0WlJq.js";import{C as t}from"./CodeSnippet-Bz4Oium0.js";import{I as o}from"./InfoCard-DAcLehMo.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-CtyD_mKx.js";import"./styled-DkvpMltq.js";import"./CopyTextButton-D_QuNntK.js";import"./useCopyToClipboard-BMK4jvzc.js";import"./useMountedState-BhIqHF6i.js";import"./Tooltip-B0A8oVTS.js";import"./Popper-AR2CJIOS.js";import"./Portal-DFAos_7D.js";import"./index-ghTZu97H.js";import"./CardContent-CAsRWGI6.js";import"./ErrorBoundary-OscpPk1j.js";import"./ErrorPanel-B-RLv-ak.js";import"./WarningPanel-5BustiD6.js";import"./ExpandMore-BDHE7-PU.js";import"./AccordionDetails-Bwt7PtDW.js";import"./index-B9sM2jn7.js";import"./Collapse-JsIOSjTx.js";import"./MarkdownContent-iEu8rAa0.js";import"./makeStyles-x_iRcUX-.js";import"./Link-BxRVLp8M.js";import"./lodash-BwZXkg-A.js";import"./useAnalytics-C3NR7LVW.js";import"./useApp-BPVHau74.js";import"./Grid-CJH0jvjV.js";import"./List-D9EXf02M.js";import"./ListContext-JoB9gWoY.js";import"./ListItem-Dhi0hwUe.js";import"./ListItemText-BwIfrCIq.js";import"./LinkButton-BezDuljC.js";import"./Button-BlfEvuWY.js";import"./CardHeader-UfzcrVqh.js";import"./Divider-D-W5xIPe.js";import"./CardActions-sQyxri_c.js";import"./BottomLink-B05fKU4h.js";import"./ArrowForward-Dao4Cjwh.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
