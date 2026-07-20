import{bR as e}from"./iframe-e_Pbc_6f.js";import{C as t}from"./CodeSnippet-DJIi0E0w.js";import{I as o}from"./InfoCard-D75tOwGy.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cz0En5uD.js";import"./CardContent-C8lrRup0.js";import"./ErrorBoundary-BcZgLfQ4.js";import"./ErrorPanel-nTkgmpv-.js";import"./WarningPanel-C7NOFBuP.js";import"./ExpandMore-CxlSY5ST.js";import"./AccordionDetails-Cs-LmZLY.js";import"./index-B9sM2jn7.js";import"./Collapse-BpLU1y6R.js";import"./MarkdownContent-C97dERNl.js";import"./makeStyles-Cp-EYjYJ.js";import"./Link-BPZInZpE.js";import"./lodash-DAwn35z1.js";import"./useAnalytics-ePNxNM33.js";import"./useApp-CjDlo0PH.js";import"./Grid-DKdjmz4g.js";import"./List-BGzrRdQR.js";import"./ListContext-BTgNrjgi.js";import"./ListItem-0H8wmvm_.js";import"./ListItemText-7UhNShIs.js";import"./CopyTextButton-B3n0ZUN-.js";import"./useCopyToClipboard-CCxT8mKm.js";import"./useMountedState-CKl4uDr9.js";import"./Tooltip-BvBLCeHz.js";import"./useObjectRef-DrJIir3F.js";import"./useOverlayTriggerState-CP5VgdLu.js";import"./utils-DxA9yzz1.js";import"./useFocusRing-KWUxPK8x.js";import"./openLink-DeVBsZVT.js";import"./number-CnABZTeS.js";import"./I18nProvider-CEYf4yN0.js";import"./useControlledState-DA3BLMuY.js";import"./animation-yDPRJL1t.js";import"./useHover-C40GJDws.js";import"./ButtonIcon-8ef_tIDz.js";import"./Button-D1InRcXf.js";import"./Label-C-UeOlhu.js";import"./Hidden-C1Rvfh0a.js";import"./useLabel-DuGYdeVZ.js";import"./useLabels-C5Sb3eQn.js";import"./useButton-B-tc2orz.js";import"./usePress-DUFujYJV.js";import"./textSelection-CmT3bbJB.js";import"./index-D1GUm7TG.js";import"./LinkButton-BXp_nsI-.js";import"./Button-CDCfDE-w.js";import"./CardHeader-DZVpINy1.js";import"./Divider-Crud06p9.js";import"./CardActions-Bg1_widv.js";import"./BottomLink-DVU_eRiR.js";import"./ArrowForward-B9v9kI8l.js";import"./Box-DMUgG59T.js";import"./styled-CxHJsi3Q.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
