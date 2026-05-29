import{j as e}from"./iframe-CY7lbe83.js";import{C as t}from"./CodeSnippet-h4AUX-n_.js";import{I as o}from"./InfoCard-BZJ8-2T5.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-gZ8thPU9.js";import"./styled-CZ8uUDah.js";import"./CopyTextButton-Cl87XUod.js";import"./useCopyToClipboard-C_KwtDOM.js";import"./useMountedState-B5irowov.js";import"./Tooltip-COPl2w0n.js";import"./Popper-DCMX2Z1y.js";import"./Portal-DEwmDmBY.js";import"./index-B1QT4D-J.js";import"./CardContent-9aSW46po.js";import"./ErrorBoundary-CR7Pikl5.js";import"./ErrorPanel-4LghmRCc.js";import"./WarningPanel-HsNEbXDc.js";import"./ExpandMore-BuW45XRi.js";import"./AccordionDetails-QEpfY1Be.js";import"./index-B9sM2jn7.js";import"./Collapse-PXpyupz1.js";import"./MarkdownContent-DYmYI5js.js";import"./makeStyles-BGiSvRlD.js";import"./Link-Ccz9XHl0.js";import"./lodash-ADtPu9nK.js";import"./useAnalytics-BhHlZ_-q.js";import"./useApp-BWWc3uRn.js";import"./Grid-DcImk4IG.js";import"./List-Ci1Aezal.js";import"./ListContext-CUuh2mol.js";import"./ListItem-CeQUv4cf.js";import"./ListItemText-DYXqavrO.js";import"./LinkButton-DxiDX5AE.js";import"./Button-tx84uWRl.js";import"./CardHeader-eqlW1ZIg.js";import"./Divider-DSnv80CJ.js";import"./CardActions-DJyhRhd-.js";import"./BottomLink-B3Tb3HQ2.js";import"./ArrowForward-BB9fsLEC.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
