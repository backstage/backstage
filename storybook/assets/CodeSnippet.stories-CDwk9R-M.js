import{bR as e}from"./iframe-C134ftd_.js";import{C as t}from"./CodeSnippet-C5qbT8cu.js";import{I as o}from"./InfoCard-BDYsnMrY.js";import"./preload-helper-PPVm8Dsz.js";import"./index-XQ83uw43.js";import"./CardContent-CSIgMbH9.js";import"./ErrorBoundary-Ch8cuCDe.js";import"./ErrorPanel-D9_O3Mb8.js";import"./WarningPanel-BEjel2_A.js";import"./ExpandMore-m646q1EQ.js";import"./AccordionDetails-B-tBpDuX.js";import"./index-B9sM2jn7.js";import"./Collapse-LIBH1A2u.js";import"./MarkdownContent-Dub0LeyB.js";import"./makeStyles-lroa90Fn.js";import"./Link-DnEb87hH.js";import"./lodash-C9xihbHM.js";import"./useAnalytics-DewmQACP.js";import"./useApp-aYIlvwkE.js";import"./Grid-CBiX0ZUm.js";import"./List-b2RWxkMS.js";import"./ListContext-XGHpPVu8.js";import"./ListItem-B0l09fOa.js";import"./ListItemText-Bb6qYYVt.js";import"./CopyTextButton-Bu25i5Q6.js";import"./useCopyToClipboard-NQjxIXEr.js";import"./useMountedState-1kmEE_UD.js";import"./Tooltip-tSI9KshH.js";import"./useObjectRef-CpAZkPjD.js";import"./useOverlayTriggerState-CWuf6Tnn.js";import"./utils-ZhLQjZIu.js";import"./useFocusRing-CEbL5n3V.js";import"./openLink-CXjQqT5j.js";import"./number-DOH9yOte.js";import"./I18nProvider-C3aQlN23.js";import"./useControlledState-BrUi6TrE.js";import"./animation-D0n23P1z.js";import"./useHover-crLX5QKB.js";import"./ButtonIcon-RiLYN9tl.js";import"./Button-DokUs05S.js";import"./Label-NvoSwhWO.js";import"./Hidden-Bciv724x.js";import"./useLabel-BlNKan1O.js";import"./useLabels-DE_o1GVW.js";import"./useButton-DhiKPbl2.js";import"./usePress-DEZzIpor.js";import"./textSelection-DpSIhvEg.js";import"./index-CFfinTmq.js";import"./LinkButton-BRVev1EF.js";import"./Button-Tx3RnmUd.js";import"./CardHeader-C7KDWAxj.js";import"./Divider-CUN2kH8H.js";import"./CardActions-C7PKkrDa.js";import"./BottomLink-DWuWkVpt.js";import"./ArrowForward-DwslhZwN.js";import"./Box-DOMgNM1H.js";import"./styled-Caou-WSS.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
