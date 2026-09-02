import{bQ as e}from"./iframe-BiC6vzfc.js";import{C as t}from"./CodeSnippet-B3kU0HP_.js";import{I as o}from"./InfoCard-CL5zXNhl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-HANU7tPZ.js";import"./CardContent-Ch4OrtSx.js";import"./ErrorBoundary-IN5Uy4Wm.js";import"./ErrorPanel-C1h2VdJ6.js";import"./WarningPanel-eIVpFTHC.js";import"./ExpandMore-Dv72LSow.js";import"./AccordionDetails-CuhjeHp2.js";import"./index-B9sM2jn7.js";import"./Collapse-CdOLWtqx.js";import"./MarkdownContent-f-GJNKWd.js";import"./makeStyles-BTRKbQbn.js";import"./Link-BBWT3DGx.js";import"./lodash-CmicG8li.js";import"./useAnalytics-CWeTU5_6.js";import"./useApp-CsAmf1u2.js";import"./Grid-5kX5iYpE.js";import"./List-DJtEB1Fe.js";import"./ListContext-127C_KA8.js";import"./ListItem-Bm0RnmVU.js";import"./ListItemText-DbI1WcNJ.js";import"./CopyTextButton-fAT1swaV.js";import"./useCopyToClipboard-EtHc7wba.js";import"./useMountedState-rwLvoT14.js";import"./Tooltip-B5bHPnfj.js";import"./useObjectRef-rJAA83qf.js";import"./useOverlayTriggerState-CjTLIV8R.js";import"./utils-BQPJ15nW.js";import"./useFocusRing-CYz7DZLf.js";import"./openLink-fglnGFM4.js";import"./number-CQJyNM_c.js";import"./I18nProvider-DJaDCNar.js";import"./useControlledState-CjMsoNHV.js";import"./animation-89PtgvT4.js";import"./useHover-CRtjWjkD.js";import"./ButtonIcon-pfvj9qzl.js";import"./Button-CSCohGDT.js";import"./Label-Dt81RO29.js";import"./Hidden-DdtniuZ_.js";import"./useLabel-CfyoKpiQ.js";import"./useLabels-Kk8q7j9x.js";import"./useButton-EPm5NcFx.js";import"./usePress-Czxg5-q_.js";import"./textSelection-BLan3Cos.js";import"./index-BGy42kW1.js";import"./LinkButton--DeWtR8v.js";import"./Button-Bx7R07Pn.js";import"./CardHeader-C_YqkowW.js";import"./Divider-DflaO4gg.js";import"./CardActions-Bm1r94mB.js";import"./BottomLink-V_KB3sU_.js";import"./ArrowForward-BObKQ-lo.js";import"./Box-CGVVs5_5.js";import"./styled-BNPRS9hw.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
