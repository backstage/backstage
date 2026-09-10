import{bQ as e}from"./iframe-B771vieD.js";import{C as t}from"./CodeSnippet-BtUGVTYs.js";import{I as o}from"./InfoCard-B2yiqYrS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DUu8846e.js";import"./CardContent-BLO5SKmR.js";import"./ErrorBoundary-Bx7dCEDe.js";import"./ErrorPanel-Dat7fwYv.js";import"./WarningPanel-CUhE3sHm.js";import"./ExpandMore-DPCBtgki.js";import"./AccordionDetails-DDxhgN0L.js";import"./index-B9sM2jn7.js";import"./Collapse-DfPbUesN.js";import"./MarkdownContent-BpqNXrKd.js";import"./makeStyles-C1hpTmTF.js";import"./Link-Rn7tZilw.js";import"./lodash-BCHMAmg_.js";import"./useAnalytics-Di36h0wy.js";import"./useApp-CmxPLI0J.js";import"./Grid-CkxOXqgi.js";import"./List-BIqut_Cj.js";import"./ListContext-DWmDADWg.js";import"./ListItem-CGxMT5ro.js";import"./ListItemText-BZSANmap.js";import"./CopyTextButton-CIf5o04I.js";import"./useCopyToClipboard-9J0wh51n.js";import"./useMountedState-dJd1Klgy.js";import"./Tooltip-X4bjTRJ1.js";import"./useObjectRef-B_q1TfVk.js";import"./useOverlayTriggerState-e3hiHQi-.js";import"./utils-piiChbE4.js";import"./useFocusRing-C2ykLkBs.js";import"./openLink-AzCo47yl.js";import"./number-b5ov0AaU.js";import"./I18nProvider-B3qRoePR.js";import"./useControlledState-xxmVxo9Z.js";import"./animation-CfBUvVtR.js";import"./useHover-B_jF8Yhh.js";import"./ButtonIcon-DMq-EbIm.js";import"./Button-B8TxKSC7.js";import"./Label-CJhGoTGL.js";import"./Hidden-DiCVpsT2.js";import"./useLabel-CXc7CDh8.js";import"./useLabels-2XgX8oa0.js";import"./useButton-CAudcQRr.js";import"./usePress-CNqwnYXg.js";import"./textSelection-Dajp4U4D.js";import"./index-DGRdaIIA.js";import"./LinkButton-CnwzL9X7.js";import"./Button-D3a0S_Gx.js";import"./CardHeader-BMr5cN6q.js";import"./Divider-loRxfWr4.js";import"./CardActions-CetyEzeY.js";import"./BottomLink-DWv9Y_Sl.js";import"./ArrowForward-Z1bOdrEJ.js";import"./Box-DejrWpfY.js";import"./styled-DTppfcCN.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
