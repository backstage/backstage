import{bR as e}from"./iframe-Dzms4wRw.js";import{C as t}from"./CodeSnippet-Csq5GOND.js";import{I as o}from"./InfoCard-CFofOIBY.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DBBakqER.js";import"./CardContent-CTNp0vP9.js";import"./ErrorBoundary-9C3In5SY.js";import"./ErrorPanel-BcDhh3BV.js";import"./WarningPanel-dN1V6BvF.js";import"./ExpandMore-DFlqtRQ5.js";import"./AccordionDetails-CbTO_NVi.js";import"./index-B9sM2jn7.js";import"./Collapse-BYtfyYGR.js";import"./MarkdownContent-CKbwgw5B.js";import"./makeStyles-B1h1_YhU.js";import"./Link-cW_x_JDF.js";import"./lodash-Cb2Wy_9k.js";import"./useAnalytics-BA98r_JB.js";import"./useApp-BWXSTOil.js";import"./Grid-WTfAUw8g.js";import"./List-9JTk76WA.js";import"./ListContext-DIjUyL6C.js";import"./ListItem-Buq3cft7.js";import"./ListItemText-k3L9Vy_V.js";import"./CopyTextButton-T0gZU51y.js";import"./useCopyToClipboard-CNCZlV6X.js";import"./useMountedState-DAwMeOiL.js";import"./Tooltip-BCMj1SD1.js";import"./useObjectRef-Ca6VrkU_.js";import"./useOverlayTriggerState-Dii3Ei3W.js";import"./utils-BkRQYljw.js";import"./useFocusRing-DjtUFVh9.js";import"./openLink-t121PK8W.js";import"./number-GxmQ5IsF.js";import"./I18nProvider-C1u0qXWv.js";import"./useControlledState-DlMtRXuC.js";import"./animation-HA6bSjMC.js";import"./useHover-enCSdk4y.js";import"./ButtonIcon-DIyhhDx0.js";import"./Button-wALy7eva.js";import"./Label-2RfDNyJG.js";import"./Hidden-0sk5EwaH.js";import"./useLabel-Dbodnstf.js";import"./useLabels-F2kTV9EY.js";import"./useButton-D4mlbzSR.js";import"./usePress-Cxa0w_VA.js";import"./textSelection-D8br12C7.js";import"./index-D1xU2CUz.js";import"./LinkButton-CYcEgJ1y.js";import"./Button-BhQFgLk7.js";import"./CardHeader-Cl-f8ikm.js";import"./Divider-DDXBFSff.js";import"./CardActions-Dl2gcpK1.js";import"./BottomLink-CHuBPWGN.js";import"./ArrowForward-Dy87CAjS.js";import"./Box-BC3MKl-R.js";import"./styled-D_n4yIWo.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
