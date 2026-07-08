import{bR as e}from"./iframe-DUP7Kr9f.js";import{C as t}from"./CodeSnippet-DmRuKWkj.js";import{I as o}from"./InfoCard-BFReN7kL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C5YDA-DN.js";import"./CardContent-CmNV6xZ6.js";import"./ErrorBoundary-BpFVbInz.js";import"./ErrorPanel-CAdikN5j.js";import"./WarningPanel-CYAkRc6e.js";import"./ExpandMore-DwEd-O1-.js";import"./AccordionDetails-9j3J5__4.js";import"./index-B9sM2jn7.js";import"./Collapse-BNEqbWFL.js";import"./MarkdownContent-BHHV0WGg.js";import"./makeStyles-Dd-C4kag.js";import"./Link-BDaMnIWB.js";import"./lodash-1-sk3vtf.js";import"./useAnalytics-DTHv5VM-.js";import"./useApp-DuupV57f.js";import"./Grid-Cd5C4HAL.js";import"./List-C1Kz1ZAt.js";import"./ListContext-Cuf4_omo.js";import"./ListItem-CWB1REQF.js";import"./ListItemText-BJOFrCLO.js";import"./CopyTextButton-DmU31750.js";import"./useCopyToClipboard-CPgY8YIm.js";import"./useMountedState-CmRrT-JN.js";import"./Tooltip-Bl60t-ot.js";import"./useObjectRef-BVJl6YFP.js";import"./useOverlayTriggerState-BDxCsQwJ.js";import"./utils-OsyFBnTM.js";import"./useFocusRing-B1eaMwrg.js";import"./openLink-CpcL-pAy.js";import"./number-BPPv7Ioc.js";import"./I18nProvider-ByGA4yZu.js";import"./useControlledState-DtDFdZyB.js";import"./animation-DvaI1_gU.js";import"./useHover-D-kET7Yv.js";import"./ButtonIcon-DOR-Ju1P.js";import"./Button-xMTzeFHr.js";import"./Label-BWr9MvjN.js";import"./Hidden-DFXJQe4O.js";import"./useLabel-9tsjfF-g.js";import"./useLabels-BZeNsKrn.js";import"./useButton-BpH5atl_.js";import"./usePress-CBZTJU3x.js";import"./textSelection-Dy2q-sAc.js";import"./index-Dk7fxhAf.js";import"./LinkButton-BAP4AYle.js";import"./Button-D-BEBcdv.js";import"./CardHeader-DJHbhkAQ.js";import"./Divider-DfV7_Pd4.js";import"./CardActions-BMFHVOb1.js";import"./BottomLink-DBFPZH2u.js";import"./ArrowForward-NhMXzEDh.js";import"./Box-D9WPCwYT.js";import"./styled-Cg0H8rnn.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
const world = "World";

const greet = person => greeting + " " + person + "!";

greet(world);
`,d=`const greeting: string = "Hello";
const world: string = "World";

const greet = (person: string): string => greeting + " " + person + "!";

greet(world);
`,c=`greeting = "Hello"
world = "World"

def greet(person):
    return f"{greeting} {person}!"

greet(world)
`,i=()=>e.jsx(o,{title:"JavaScript example",children:e.jsx(t,{text:"const hello = 'World';",language:"javascript"})}),s=()=>e.jsx(o,{title:"JavaScript multi-line example",children:e.jsx(t,{text:r,language:"javascript"})}),a=()=>e.jsx(o,{title:"Show line numbers",children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})}),n=()=>e.jsxs(o,{title:"Overflow",children:[e.jsx("div",{style:l,children:e.jsx(t,{text:r,language:"javascript"})}),e.jsx("div",{style:l,children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})})]}),p=()=>e.jsxs(o,{title:"Multiple languages",children:[e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0}),e.jsx(t,{text:d,language:"typescript",showLineNumbers:!0}),e.jsx(t,{text:c,language:"python",showLineNumbers:!0})]}),m=()=>e.jsx(o,{title:"Copy Code",children:e.jsx(t,{text:r,language:"javascript",showCopyCodeButton:!0})});i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"MultipleLines"};a.__docgenInfo={description:"",methods:[],displayName:"LineNumbers"};n.__docgenInfo={description:"",methods:[],displayName:"Overflow"};p.__docgenInfo={description:"",methods:[],displayName:"Languages"};m.__docgenInfo={description:"",methods:[],displayName:"CopyCode"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript example">
    <CodeSnippet text="const hello = 'World';" language="javascript" />
  </InfoCard>`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript multi-line example">
    <CodeSnippet text={JAVASCRIPT} language="javascript" />
  </InfoCard>`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <InfoCard title="Show line numbers">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
  </InfoCard>`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => <InfoCard title="Overflow">
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
  </InfoCard>`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => <InfoCard title="Copy Code">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showCopyCodeButton />
  </InfoCard>`,...m.parameters?.docs?.source}}};const Se=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{m as CopyCode,i as Default,p as Languages,a as LineNumbers,s as MultipleLines,n as Overflow,Se as __namedExportsOrder,xe as default};
