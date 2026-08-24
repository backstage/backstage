import{bR as e}from"./iframe-BT856zKW.js";import{C as t}from"./CodeSnippet-DQQbvAWJ.js";import{I as o}from"./InfoCard-BpoVHYYn.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DQwWzZ9l.js";import"./CardContent-Cq5-IrME.js";import"./ErrorBoundary-BUFuzM2U.js";import"./ErrorPanel-Toi3e49m.js";import"./WarningPanel-C8IMyBHC.js";import"./ExpandMore-BfOktmc8.js";import"./AccordionDetails-BlOaekJ7.js";import"./index-B9sM2jn7.js";import"./Collapse-C5HLlfSB.js";import"./MarkdownContent-DWz31GUq.js";import"./makeStyles-BvvLmOsG.js";import"./Link-R-hp-ZLy.js";import"./lodash-BVPr3iau.js";import"./useAnalytics-DNoiAALH.js";import"./useApp-Cpkvybk9.js";import"./Grid-BxchgH-S.js";import"./List-IEeojV8D.js";import"./ListContext-SRmSumki.js";import"./ListItem-CB-Gvt6Y.js";import"./ListItemText-CU2-oZ6m.js";import"./CopyTextButton-DUrzruX8.js";import"./useCopyToClipboard-CkPuwwln.js";import"./useMountedState-8KNWpExT.js";import"./Tooltip-o3hefnT9.js";import"./useObjectRef-C9B7I4dA.js";import"./useOverlayTriggerState-jSPLUxR-.js";import"./utils-CpwCIt4g.js";import"./useFocusRing-BT_-10ZK.js";import"./openLink-cidOSJP4.js";import"./number-DEPRmkya.js";import"./I18nProvider-D0MkpVu-.js";import"./useControlledState-B8MFkE-b.js";import"./animation-D-E6JIW4.js";import"./useHover-qIfqE_w_.js";import"./ButtonIcon-D9H8Rxke.js";import"./Button-C7kwpLvK.js";import"./Label-DWhvkKMc.js";import"./Hidden-49UROW8g.js";import"./useLabel-4EIIh35K.js";import"./useLabels-mD4IPMLK.js";import"./useButton-BY1LIf6_.js";import"./usePress-D8DHmOrO.js";import"./textSelection-BbGtchwD.js";import"./index-DX-mGHlN.js";import"./LinkButton-BqMPiNki.js";import"./Button-cU_D15tW.js";import"./CardHeader-BvqmobTP.js";import"./Divider-BC_qSnbz.js";import"./CardActions-D5JV9nj7.js";import"./BottomLink-BbuTSXG3.js";import"./ArrowForward-kUY6OcIw.js";import"./Box-DRDGYh8a.js";import"./styled-CRVzAmQX.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
