import{bR as e}from"./iframe-D690ZVKa.js";import{C as t}from"./CodeSnippet-CxNRGzQC.js";import{I as o}from"./InfoCard-Bmy3GniX.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DrXFpTpJ.js";import"./CardContent-BYIaPPCv.js";import"./ErrorBoundary-DAIAxUBQ.js";import"./ErrorPanel-sSWmcc6L.js";import"./WarningPanel-BAcnD7kk.js";import"./ExpandMore-7P9uOlxg.js";import"./AccordionDetails-Cc9F9Oiq.js";import"./index-B9sM2jn7.js";import"./Collapse-st5wW4EU.js";import"./MarkdownContent-DqF9sZOe.js";import"./makeStyles-CJxbGC76.js";import"./Link-DmZ9GlNp.js";import"./lodash-CaHtv1AU.js";import"./useAnalytics-kpSi9Kln.js";import"./useApp-RZivroMa.js";import"./Grid-DmtR5II5.js";import"./List-CzjBo6qt.js";import"./ListContext-Ckz_Cnm1.js";import"./ListItem-CPGGfXK8.js";import"./ListItemText-BIcwxM7j.js";import"./CopyTextButton-W47bcblk.js";import"./useCopyToClipboard-DCigtZZK.js";import"./useMountedState-DeFYtrKF.js";import"./Tooltip-DRJYQ9XX.js";import"./useObjectRef-BPqBfMfb.js";import"./useOverlayTriggerState-CBv8lv31.js";import"./utils-D1ifMOcR.js";import"./useFocusRing-CBblcblV.js";import"./openLink-DlPHZOe9.js";import"./number-CGXALLEc.js";import"./I18nProvider-D9TsogMC.js";import"./useControlledState-S0N1AjAP.js";import"./animation-C9FyvRVk.js";import"./useHover-Da9hkWGW.js";import"./ButtonIcon-D1vSayV3.js";import"./Button-DsupNxvN.js";import"./Label-CHMEqKLB.js";import"./Hidden--Qykx-Ic.js";import"./useLabel-Bv75J3A8.js";import"./useLabels-D2HAWa9S.js";import"./useButton-D0OzxRTD.js";import"./usePress-BTPot_r7.js";import"./textSelection-30hfHS5F.js";import"./index-Bm8BO3VD.js";import"./LinkButton-CsSa6TzU.js";import"./Button-BGl4BwiB.js";import"./CardHeader-Bh2khU8F.js";import"./Divider-BFUcZtpI.js";import"./CardActions-Dl51y1-z.js";import"./BottomLink-fp48WPfp.js";import"./ArrowForward-Cu4oYW_d.js";import"./Box-D2Fu4WUc.js";import"./styled-DacKj83C.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
