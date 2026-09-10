import{bQ as e}from"./iframe-BjdV6pPy.js";import{C as t}from"./CodeSnippet-BGIHtbkn.js";import{I as o}from"./InfoCard-CgH4Mt1D.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DF9y2Kef.js";import"./CardContent-D8myDPQ4.js";import"./ErrorBoundary-C_Y4eT8Q.js";import"./ErrorPanel-ClIxziH4.js";import"./WarningPanel-k0bYlxSq.js";import"./ExpandMore-BtQI-HHY.js";import"./AccordionDetails-BUva2n36.js";import"./index-B9sM2jn7.js";import"./Collapse-C-HZGOOx.js";import"./MarkdownContent-BsLy_-C7.js";import"./makeStyles-PWq3kkan.js";import"./Link-q9zDyQ1s.js";import"./lodash-Diin1sQj.js";import"./useAnalytics-BS2qsBtP.js";import"./useApp-BEYDC2Xe.js";import"./Grid-ZTRqCXbs.js";import"./List-5AuHBILY.js";import"./ListContext-Cz3i0xyJ.js";import"./ListItem-CihulhwT.js";import"./ListItemText-CMQK_Tem.js";import"./CopyTextButton-Baj9whgw.js";import"./useCopyToClipboard-DunXi1VD.js";import"./useMountedState-D5k_dox-.js";import"./Tooltip-CBiKcEb6.js";import"./useObjectRef-BWm5y5ll.js";import"./useOverlayTriggerState-CHBpPTe6.js";import"./utils-DS91ArTN.js";import"./useFocusRing-BtM4iWFp.js";import"./openLink-2_8aeNBf.js";import"./number-DfMxFCvL.js";import"./I18nProvider-C9qy98Iq.js";import"./useControlledState-CC4OZRef.js";import"./animation-CUNcUTdh.js";import"./useHover-wrMqleU9.js";import"./ButtonIcon-DOguw-E3.js";import"./Button-BT4zDcIq.js";import"./Label-wgpa9Qzo.js";import"./Hidden-CWD5f7cO.js";import"./useLabel-rYSXIktO.js";import"./useLabels-BRtq5QIX.js";import"./useButton-Ds0I4pCp.js";import"./usePress-CbZGFUaz.js";import"./textSelection-Bw3EsPUC.js";import"./index-Bt664Isb.js";import"./LinkButton-DWCa-9vb.js";import"./Button-D4rD8o8i.js";import"./CardHeader-D9_0k96o.js";import"./Divider-4oCyrbP3.js";import"./CardActions-BBq-AClO.js";import"./BottomLink-B-Fib0DE.js";import"./ArrowForward-CfJQaEdB.js";import"./Box-CGkRuXu1.js";import"./styled-CGu5BtQw.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
