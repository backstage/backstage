import{bQ as e}from"./iframe-CJeP2vvm.js";import{C as t}from"./CodeSnippet-Drggz90x.js";import{I as o}from"./InfoCard-Ca9vnO2l.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BPSuVA-o.js";import"./CardContent-CD-N3QFX.js";import"./ErrorBoundary-DzYV8TQU.js";import"./ErrorPanel-D6j0V2Ak.js";import"./WarningPanel-B7xyxMmr.js";import"./ExpandMore-BvAXGe0b.js";import"./AccordionDetails-BMIMOQ7y.js";import"./index-B9sM2jn7.js";import"./Collapse-D3B3pAYG.js";import"./MarkdownContent-DMAI3FnV.js";import"./makeStyles-CtzsXOCL.js";import"./Link--Fc6A4Yf.js";import"./lodash-LkEJAKVD.js";import"./useAnalytics-De2cbPtm.js";import"./useApp-CK6pVRGl.js";import"./Grid-udHwzQNb.js";import"./List-CzxNgMf8.js";import"./ListContext-CAbC7OWa.js";import"./ListItem-Dr_x9euU.js";import"./ListItemText-8DdXN6RA.js";import"./CopyTextButton-Dmjgnv5K.js";import"./useCopyToClipboard-zy_unyJQ.js";import"./useMountedState-BT60qhs5.js";import"./Tooltip-DzyZsiuV.js";import"./useObjectRef-C-2dJx3K.js";import"./useOverlayTriggerState-Drctaywp.js";import"./utils-Ci9aOot6.js";import"./useFocusRing-o6_0h1DB.js";import"./openLink-Dw-jVqrV.js";import"./number-BSFxjcvW.js";import"./I18nProvider-C7P3l0dN.js";import"./useControlledState-CqCclfwn.js";import"./animation-CvMuFemQ.js";import"./useHover-Bg3BX-Db.js";import"./ButtonIcon-DHwAGLxp.js";import"./Button-BDYf5QxC.js";import"./Label-D4bUC6Na.js";import"./Hidden-BDNd3cL9.js";import"./useLabel-CmJz89mn.js";import"./useLabels-DRlool0j.js";import"./useButton-DUAdcx1U.js";import"./usePress-BBcvFLiN.js";import"./textSelection-C5htZZfI.js";import"./index-DyrFOjzE.js";import"./LinkButton-DUVpRYiL.js";import"./Button-CSNLLsaP.js";import"./CardHeader-CaIXL0J1.js";import"./Divider-DTCcGHVc.js";import"./CardActions-DMO-bpfe.js";import"./BottomLink-Bmg0IrQQ.js";import"./ArrowForward-DaT6rDj0.js";import"./Box-EvvPk6ng.js";import"./styled-CFBPwnSz.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
