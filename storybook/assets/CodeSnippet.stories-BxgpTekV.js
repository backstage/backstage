import{j as e}from"./iframe-BYYe_BET.js";import{C as t}from"./CodeSnippet-CZ2XO4Zf.js";import{I as o}from"./InfoCard-D3PbB2BL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C_fPlOPu.js";import"./CardContent-D5nWOQeR.js";import"./ErrorBoundary-BLXqS4cb.js";import"./ErrorPanel-DpueJr42.js";import"./WarningPanel-Bw52NOZl.js";import"./ExpandMore-CiDqCMb1.js";import"./AccordionDetails-CS7mUXMa.js";import"./index-B9sM2jn7.js";import"./Collapse-dimKAT4N.js";import"./MarkdownContent-WNB-yFQn.js";import"./makeStyles-BqAzHYwu.js";import"./Link-DQQIOfhH.js";import"./lodash-lhI2pBpB.js";import"./useAnalytics-DWxEYXCC.js";import"./useApp-C6DR3uil.js";import"./Grid-DwakReSX.js";import"./List-DdhsJ4F5.js";import"./ListContext-DCNSGU5g.js";import"./ListItem-t-HbrJXm.js";import"./ListItemText-Y-vaEivY.js";import"./CopyTextButton-Cug5hb1r.js";import"./useCopyToClipboard-Cn49hS36.js";import"./useMountedState-BJL-WLRQ.js";import"./Tooltip-B3Py3aUh.js";import"./useObjectRef-9OXtpzcu.js";import"./useOverlayTriggerState-B9znxEmb.js";import"./utils-CJSyyO3-.js";import"./useFocusRing-BRx5O8Da.js";import"./openLink-BON_CNZm.js";import"./number-CtW1NSkQ.js";import"./I18nProvider-rRNMaJeu.js";import"./useControlledState-DguQehpe.js";import"./animation-DtpQ2ZDK.js";import"./useHover-DawSjhGk.js";import"./ButtonIcon-I4aSAKuo.js";import"./Button-DEPxcD8C.js";import"./Label-Bs-x77sn.js";import"./Hidden-c60OiMP4.js";import"./useLabel-dcXziXhr.js";import"./useLabels-4i8ghj68.js";import"./useButton-f7nJByYc.js";import"./usePress-CdThG8-6.js";import"./textSelection-D5BzNUOh.js";import"./getMetaValue-Bn1etyTW.js";import"./index-COE7Jz9g.js";import"./LinkButton-eCo4PHSG.js";import"./Button-Cl-6XZWq.js";import"./CardHeader-Dt_1A6RJ.js";import"./Divider-pRXEZ2ju.js";import"./CardActions-BWZFOKi9.js";import"./BottomLink-Cnc50wsC.js";import"./ArrowForward-7tI5ROL2.js";import"./Box-0Ecv0mGg.js";import"./styled-D32qgjdu.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
