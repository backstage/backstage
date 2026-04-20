import{j as e}from"./iframe-Cz6SWQVH.js";import{C as t}from"./CodeSnippet-DUPJVwqL.js";import{I as o}from"./InfoCard-nJO1PnLj.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-BfOwOGWn.js";import"./styled-CHQDB4JG.js";import"./CopyTextButton-3tmDfE_W.js";import"./useCopyToClipboard-BcEFygxy.js";import"./useMountedState-BtaJiN7o.js";import"./Tooltip-DEuFBR78.js";import"./Popper-CWL0dBRv.js";import"./Portal-Cwv6n3co.js";import"./index-COEqbYNs.js";import"./CardContent-BPcbg0eM.js";import"./ErrorBoundary-D52kfV4P.js";import"./ErrorPanel-ZEv74Hg9.js";import"./WarningPanel-pLOCmyda.js";import"./ExpandMore-VjMAX4xv.js";import"./AccordionDetails-CGZDKfZJ.js";import"./index-B9sM2jn7.js";import"./Collapse-Bcgk9z9C.js";import"./MarkdownContent-D0APngxN.js";import"./makeStyles-DkpM-pcx.js";import"./Link-rJUKOl72.js";import"./lodash-BYoV5fke.js";import"./useAnalytics-D119RZa6.js";import"./useApp-DGYXI2Z1.js";import"./Grid-vJ4N4mtA.js";import"./List-CPTtSvEh.js";import"./ListContext-BZcjIfXN.js";import"./ListItem-Co51ld_D.js";import"./ListItemText-BXEA_G4I.js";import"./LinkButton-ByTZ5-Xg.js";import"./Button-BNliiCLH.js";import"./CardHeader-R6ICu8kr.js";import"./Divider-BnJfzwCx.js";import"./CardActions-oUmrUj8R.js";import"./BottomLink-CXQPJ9wy.js";import"./ArrowForward-DZa_Hyhb.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
