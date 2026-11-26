import{j as e}from"./iframe-CR1Jw9dV.js";import{C as t}from"./CodeSnippet-CLkY7bPO.js";import{I as o}from"./InfoCard-C6zdU6nd.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CuqShzUV.js";import"./CardContent-MPhZHP_d.js";import"./ErrorBoundary-BwM5U5WZ.js";import"./ErrorPanel-Cy-zVRNg.js";import"./WarningPanel-Ch8DVuko.js";import"./ExpandMore-BPH7-hk8.js";import"./AccordionDetails-lcit3sf6.js";import"./index-B9sM2jn7.js";import"./Collapse-CNfkhbFo.js";import"./MarkdownContent-BnmsOE6s.js";import"./makeStyles-Blkp-8Vz.js";import"./Grid-CxkI-J4A.js";import"./List-DygGvees.js";import"./ListContext-C50iGKA5.js";import"./ListItem-C8ehtjyx.js";import"./ListItemText-PI8GFBOf.js";import"./CopyTextButton-DPmLXo4_.js";import"./useCopyToClipboard-RvuO4m91.js";import"./useMountedState-Dyynv26Z.js";import"./Tooltip-Cf2zXoVS.js";import"./useObjectRef-CxAJnmky.js";import"./useOverlayTriggerState-BrayxibY.js";import"./utils-f1XPU8sj.js";import"./useFocusRing-CCR0Dk_B.js";import"./number-CXcznxJS.js";import"./I18nProvider-CXlyEy0i.js";import"./useControlledState-BQLBMnzZ.js";import"./animation-reWawdWv.js";import"./useHover-COtbARlD.js";import"./ButtonIcon-B6UbfbyX.js";import"./Button-DzhTBfgP.js";import"./Label-C37_b03j.js";import"./Hidden-B3uAAl_R.js";import"./useLabel-B8RNTxDr.js";import"./useLabels-C65kEDvg.js";import"./useButton-HAI6nP2s.js";import"./usePress-BO_FqSCY.js";import"./textSelection-DRBuEoQO.js";import"./getMetaValue-QyE7lEVK.js";import"./index-CHKdAyZ9.js";import"./LinkButton-CujRUvF1.js";import"./Link-Dhqz-BCc.js";import"./lodash-5fYZTyfB.js";import"./useApp-D4i_SxIG.js";import"./index-BBOHwEhV.js";import"./useAnalytics-iih8YEd4.js";import"./Button-BWTngMKp.js";import"./CardHeader-BY0uCOEp.js";import"./Divider-Dk_1lvZ6.js";import"./CardActions-BFJtZwz4.js";import"./BottomLink-BN7eSHdl.js";import"./ArrowForward-Wuy3-8DN.js";import"./Box-BaA-dv-7.js";import"./styled-BINEkVaE.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
