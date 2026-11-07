import{j as e}from"./iframe-D9zyyCLm.js";import{C as t}from"./CodeSnippet-DkBo__Jd.js";import{I as o}from"./InfoCard-CHMSTKQH.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CZyC9z6L.js";import"./CardContent-CxAlLPCY.js";import"./ErrorBoundary-BlDArdiE.js";import"./ErrorPanel-KLek1RLY.js";import"./WarningPanel-Dkkr8AIM.js";import"./ExpandMore-C2LE1N2L.js";import"./AccordionDetails-CelqUZr6.js";import"./index-B9sM2jn7.js";import"./Collapse-D4zdbtg3.js";import"./MarkdownContent-CnYiXyLA.js";import"./makeStyles-CWCwef5R.js";import"./Link-BQ85eo89.js";import"./lodash-c_X8lcuE.js";import"./useAnalytics-b9lD6bMf.js";import"./useApp-D2m-Ae2p.js";import"./Grid-BB8AJhQB.js";import"./List-C4uiJVgu.js";import"./ListContext-BGhsm4dp.js";import"./ListItem-O17-VUI5.js";import"./ListItemText-CSafx1d3.js";import"./CopyTextButton-D8CXvYoG.js";import"./useCopyToClipboard-CYoqdluJ.js";import"./useMountedState-T1Hh3_OE.js";import"./Tooltip-BhAvVrKz.js";import"./useObjectRef-DW2A_FKT.js";import"./useOverlayTriggerState-BkEw8wth.js";import"./utils-BhB9Kn0J.js";import"./useFocusRing-Cyv4kXD7.js";import"./openLink-Dq3aE_9q.js";import"./number-oRZks6E2.js";import"./I18nProvider-CFA5Nn83.js";import"./useControlledState-CNVQPQl6.js";import"./animation-Dc2F1pm8.js";import"./useHover-CXer1LBh.js";import"./ButtonIcon-D9JFIQSe.js";import"./Button-eiFaSVQp.js";import"./Label-8xCw--Gh.js";import"./Hidden-BEbPYnKb.js";import"./useLabel-CNCvRjXr.js";import"./useLabels-Cf60hIuc.js";import"./useButton-Br280P7j.js";import"./usePress-DakPojsx.js";import"./textSelection-B_folLqx.js";import"./getMetaValue-DvVIc-fc.js";import"./index-BJpHCwC2.js";import"./LinkButton-DdiNGXLd.js";import"./Button-DUoliIUS.js";import"./CardHeader-DwmSDkHO.js";import"./Divider-BqjqocUC.js";import"./CardActions--San9s7F.js";import"./BottomLink-B1eYcEJj.js";import"./ArrowForward-DAbH0-gQ.js";import"./Box-Defj12pz.js";import"./styled-D79h_skJ.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
  </InfoCard>`,...m.parameters?.docs?.source}}};const fe=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{m as CopyCode,i as Default,p as Languages,a as LineNumbers,s as MultipleLines,n as Overflow,fe as __namedExportsOrder,Se as default};
