import{j as e}from"./iframe-DIcQvc_4.js";import{C as t}from"./CodeSnippet-CCMCtViW.js";import{I as o}from"./InfoCard-CgLC-MOJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index--onu0eIM.js";import"./CardContent-hgsBYrmH.js";import"./ErrorBoundary-CaRcCzrl.js";import"./ErrorPanel-CiCq8LYk.js";import"./WarningPanel-CVVHprcv.js";import"./ExpandMore-BVDi44YU.js";import"./AccordionDetails-CHyDv55k.js";import"./index-B9sM2jn7.js";import"./Collapse-D4zspPfO.js";import"./MarkdownContent-CSu_nZsI.js";import"./makeStyles-CSt6JC-p.js";import"./Link-CNvpICkX.js";import"./lodash-D5XEdOes.js";import"./useAnalytics-CkzkVu-R.js";import"./useApp-CpeMA22u.js";import"./Grid-oLNTG-1m.js";import"./List-Bi7BJlgZ.js";import"./ListContext-5lse5t1A.js";import"./ListItem-BlT-_Dx7.js";import"./ListItemText-BHjQ7-pc.js";import"./CopyTextButton-D5_X-SOz.js";import"./useCopyToClipboard-CWZEHZcM.js";import"./useMountedState-BCWjikTD.js";import"./Tooltip-BBfUIfIG.js";import"./useObjectRef-CQfKhSp8.js";import"./useOverlayTriggerState-ovQ1kmtR.js";import"./utils-JYodRznf.js";import"./useFocusRing-C4tfuByP.js";import"./openLink-BR6QeS5d.js";import"./number-D2azkskk.js";import"./I18nProvider-BUw0KQ7A.js";import"./useControlledState-CaCljqv7.js";import"./animation-B_Bf72uX.js";import"./useHover-CrozpiDB.js";import"./ButtonIcon-BVlPIGD0.js";import"./Button-C4PGOc91.js";import"./Label-CLke59gh.js";import"./Hidden-BBwtWmDi.js";import"./useLabel-BYY4_2g1.js";import"./useLabels-ITbgZNHU.js";import"./useButton-QYfWJvVm.js";import"./usePress-BIUzH6ox.js";import"./textSelection-DrSKaTGN.js";import"./index-DeTGLoK4.js";import"./LinkButton-CIHzTNAW.js";import"./Button-sioK_7ZF.js";import"./CardHeader-CJ7BII1n.js";import"./Divider-D1lUtq2J.js";import"./CardActions-BTeAQA0p.js";import"./BottomLink-BThbyf4D.js";import"./ArrowForward-ZwAF1DXd.js";import"./Box-D_uAdcR5.js";import"./styled-CMENgzGI.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
