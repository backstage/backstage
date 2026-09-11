import{bQ as e}from"./iframe-DwtLqRd0.js";import{C as t}from"./CodeSnippet-d_5XlQdb.js";import{I as o}from"./InfoCard-BwxkzCkL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-5hB1atvh.js";import"./CardContent-D9MNqYc-.js";import"./ErrorBoundary-BQo0howy.js";import"./ErrorPanel-CT1n2_ZK.js";import"./WarningPanel-DRno-0iq.js";import"./ExpandMore-D33EVsRn.js";import"./AccordionDetails-BJnR58rH.js";import"./index-B9sM2jn7.js";import"./Collapse-hzPe5c6V.js";import"./MarkdownContent-BO8s6WkT.js";import"./makeStyles-61D4HnMF.js";import"./Link-DWcyScs4.js";import"./lodash-B5HI3AG3.js";import"./useAnalytics-DP-R2foX.js";import"./useApp-CwD5tnbo.js";import"./Grid-CYWjZ88i.js";import"./List-78xudjL7.js";import"./ListContext-DHZNjXO9.js";import"./ListItem-CZsOW-2D.js";import"./ListItemText-cHlJFKh4.js";import"./CopyTextButton-DE8yBP_S.js";import"./useCopyToClipboard-2YTYmtJX.js";import"./useMountedState-BdNpbXH7.js";import"./Tooltip-DaCyvBEk.js";import"./useObjectRef-C3WIJKuW.js";import"./useOverlayTriggerState-tkyO9oaJ.js";import"./utils-CTdfKX7K.js";import"./useFocusRing-Br9K8cEf.js";import"./openLink-Chp0fPN0.js";import"./number-Bm7tKJss.js";import"./I18nProvider-nGJGLiEq.js";import"./useControlledState-kobszWOc.js";import"./animation-WaI6kgjy.js";import"./useHover-BPNWkg3J.js";import"./ButtonIcon-DLANXsyX.js";import"./Button-CN2KE0n5.js";import"./Label-CnMUtZHy.js";import"./Hidden-Bs1ekBhh.js";import"./useLabel-csUjoQn4.js";import"./useLabels-DBBGWQnZ.js";import"./useButton-A_NfRVcv.js";import"./usePress-C5TgjZ1H.js";import"./textSelection-DEZhmmiP.js";import"./index-BnPMaZ6y.js";import"./LinkButton-B-IPB8wv.js";import"./Button-1NJaILB9.js";import"./CardHeader-BTHxp3p2.js";import"./Divider-JeuTwy37.js";import"./CardActions-BkfsfENj.js";import"./BottomLink-BSil33Wh.js";import"./ArrowForward-BRcrivOl.js";import"./Box-7z3gKpft.js";import"./styled-2OXr0LLp.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
