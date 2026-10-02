import{j as e}from"./iframe-DOtOeTqo.js";import{C as t}from"./CodeSnippet-DsbjsTj1.js";import{I as o}from"./InfoCard-BDtTW3Tw.js";import"./preload-helper-PPVm8Dsz.js";import"./index-7nocqFCe.js";import"./CardContent-BnWPK7EZ.js";import"./ErrorBoundary-Cy2uTdX0.js";import"./ErrorPanel-DNhnDHOW.js";import"./WarningPanel-BGxEpT--.js";import"./ExpandMore-8D-WX9pK.js";import"./AccordionDetails-lBJv0gg5.js";import"./index-B9sM2jn7.js";import"./Collapse-COg7M1Hj.js";import"./MarkdownContent-A_WO0S75.js";import"./makeStyles-aCtRezqa.js";import"./Link-D1jM9Lpj.js";import"./lodash-C_cdduUD.js";import"./useAnalytics-DanEeCEV.js";import"./useApp-CYz1MO9C.js";import"./Grid-KxYFYxAG.js";import"./List-IyXwRYVt.js";import"./ListContext-qvPrRuDM.js";import"./ListItem-BmxIywAG.js";import"./ListItemText--2Kbl56n.js";import"./CopyTextButton-CfQhmwxW.js";import"./useCopyToClipboard-BGmklS9m.js";import"./useMountedState-CMMEaIUk.js";import"./Tooltip-BpL3QK8E.js";import"./useObjectRef-BWUUeiPu.js";import"./useOverlayTriggerState-CMprxMq5.js";import"./utils-pgFMei_k.js";import"./useFocusRing-BXb8q1JL.js";import"./openLink-CJNg7ARK.js";import"./number-Bmc2WaUx.js";import"./I18nProvider-DuDY5T7I.js";import"./useControlledState-BfKz3a4E.js";import"./animation-PioyXRyy.js";import"./useHover-CLTRyNT2.js";import"./ButtonIcon-sleBnERd.js";import"./Button-BEAJi762.js";import"./Label-BxIKHFQ8.js";import"./Hidden-CxPa8WIq.js";import"./useLabel-DH87djdw.js";import"./useLabels-BnFtLpP2.js";import"./useButton-nXyYv-0V.js";import"./usePress-BQ7zB3R2.js";import"./textSelection-8fES9RA1.js";import"./index-BlBcDPbs.js";import"./LinkButton-CtIFwyDA.js";import"./Button-DuuiuDo1.js";import"./CardHeader-CokiDU0f.js";import"./Divider-9aSoofHc.js";import"./CardActions-cRdfzlYf.js";import"./BottomLink-Cx0zM_s4.js";import"./ArrowForward-SfJD0Wow.js";import"./Box-D0ehxfuJ.js";import"./styled-CZEjihDZ.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
