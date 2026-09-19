import{bQ as e}from"./iframe-CPZQIdXt.js";import{C as t}from"./CodeSnippet-Bxn0lfi8.js";import{I as o}from"./InfoCard-Ce1R923W.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXQvl2XS.js";import"./CardContent-Ci8oBxVb.js";import"./ErrorBoundary-HyefDHiJ.js";import"./ErrorPanel-BAtvdbMT.js";import"./WarningPanel-K9ASzi_e.js";import"./ExpandMore-DHuJCxyS.js";import"./AccordionDetails-DpWxXEAF.js";import"./index-B9sM2jn7.js";import"./Collapse-Bzi-HN_Q.js";import"./MarkdownContent-CXk7iyhY.js";import"./makeStyles-CN7e-MA3.js";import"./Link-DMX8IYMY.js";import"./lodash-KLTtZyUl.js";import"./useAnalytics-C8QM1kJh.js";import"./useApp-CcYHjusD.js";import"./Grid-C3zT8bmo.js";import"./List-iZvogWce.js";import"./ListContext-DwCGjIB-.js";import"./ListItem-yhm31bzm.js";import"./ListItemText-Cr1QbIDd.js";import"./CopyTextButton-CiGyfyhR.js";import"./useCopyToClipboard-Dfy8vgMi.js";import"./useMountedState-CaKUSiYe.js";import"./Tooltip-DBkhfNVt.js";import"./useObjectRef-Bd12eOMu.js";import"./useOverlayTriggerState-CAB3T-Hz.js";import"./utils-DfS0MLG1.js";import"./useFocusRing--8mLVlO1.js";import"./openLink-C87naxyd.js";import"./number-VnPE9G7J.js";import"./I18nProvider--qafPNbZ.js";import"./useControlledState-C1C-unW2.js";import"./animation-ClFfzpbX.js";import"./useHover-CNFNn4CS.js";import"./ButtonIcon-7FFea3sd.js";import"./Button-DbyB3ML5.js";import"./Label-CBzuLVn0.js";import"./Hidden-DOapgqgb.js";import"./useLabel-NKDByoxa.js";import"./useLabels-j_pZQhad.js";import"./useButton-NJXPyhR_.js";import"./usePress-Oa17hApX.js";import"./textSelection-Comt_RX9.js";import"./index-DvySIO-N.js";import"./LinkButton-DKXMuWML.js";import"./Button-DNvlPXid.js";import"./CardHeader-BiFRUnpU.js";import"./Divider-WzcnoeYd.js";import"./CardActions-PXjjM3Rj.js";import"./BottomLink-KaExGh6L.js";import"./ArrowForward-CVWUnqT3.js";import"./Box-BOusxFj4.js";import"./styled-CIRZa-Bo.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
