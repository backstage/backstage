import{j as e}from"./iframe-SO2aIStn.js";import{C as t}from"./CodeSnippet-DrOcwf2_.js";import{I as o}from"./InfoCard-CyjMiOqT.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DPwzdWYf.js";import"./CardContent-_YcVLeok.js";import"./ErrorBoundary-BuR9px6p.js";import"./ErrorPanel-r0FOF1ZM.js";import"./WarningPanel-CrThLmgv.js";import"./ExpandMore-B4GmBpcF.js";import"./AccordionDetails-h4hVdFJB.js";import"./index-B9sM2jn7.js";import"./Collapse-BFN2NOaJ.js";import"./MarkdownContent-z2y9ctJg.js";import"./makeStyles-DqgeW26M.js";import"./Grid-DyKyVuYQ.js";import"./List-OkrJGNXg.js";import"./ListContext-C8Vr105q.js";import"./ListItem-Bat2RRg4.js";import"./ListItemText-DcPsx7kL.js";import"./CopyTextButton-BccbBSmb.js";import"./useCopyToClipboard-B9vry376.js";import"./useMountedState-DKv1wuOp.js";import"./Tooltip-DwIQbKbb.js";import"./useObjectRef-C4fVgNdG.js";import"./useOverlayTriggerState-Ck3aLq9p.js";import"./utils-CwhAgYFH.js";import"./useFocusRing-DHTQT_lC.js";import"./number-pMJydGgE.js";import"./I18nProvider-BWEEs8VU.js";import"./useControlledState-BBNR5rbN.js";import"./animation-CUxQyO9K.js";import"./useHover-BwVq8lt0.js";import"./ButtonIcon-05b3-25k.js";import"./Button-BGvlfnXd.js";import"./Label-DQRKBs9u.js";import"./Hidden-DBz78_xE.js";import"./useLabel-BqXJUdIq.js";import"./useLabels-Cfrddupv.js";import"./useButton-CWlVdGLP.js";import"./usePress-BBc3t8hk.js";import"./textSelection-BFKOQOEH.js";import"./getMetaValue-DQETedN7.js";import"./index-B1nmLjVU.js";import"./LinkButton-x12wTeZh.js";import"./Link-sQvaDLc-.js";import"./lodash-DNFIy4FG.js";import"./useApp-BZeBLv5x.js";import"./index-B44vhErU.js";import"./useAnalytics-Dglv9EKv.js";import"./Button-DHtO172l.js";import"./CardHeader-3gWNdbO7.js";import"./Divider-Bat-i2TT.js";import"./CardActions-DxwNBRrM.js";import"./BottomLink-DHXkwuaO.js";import"./ArrowForward-feQArYFJ.js";import"./Box-DWYmvqFk.js";import"./styled-AHWGCPSK.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
