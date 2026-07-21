import{bR as e}from"./iframe-DmKIhSd4.js";import{C as t}from"./CodeSnippet-DHMDlIIT.js";import{I as o}from"./InfoCard-C5b21UuO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DJiMl0KJ.js";import"./CardContent-BRN38i3f.js";import"./ErrorBoundary-LNk1Xzkj.js";import"./ErrorPanel-DKz7aA6r.js";import"./WarningPanel-BCIQ1xuj.js";import"./ExpandMore-rew_O_m2.js";import"./AccordionDetails-ClJpmHIZ.js";import"./index-B9sM2jn7.js";import"./Collapse-DC9E5jJ1.js";import"./MarkdownContent-BHh30bfr.js";import"./makeStyles-BqK0q-gB.js";import"./Link-Dk9R5rXS.js";import"./lodash-TPrC5YUF.js";import"./useAnalytics-BU7cnARE.js";import"./useApp-DzXHRUhp.js";import"./Grid-A2BeQhfO.js";import"./List-C3tYQ8nk.js";import"./ListContext-B0FPCnG9.js";import"./ListItem-aei1NC_j.js";import"./ListItemText-1B3hY1s2.js";import"./CopyTextButton-DOaErw0y.js";import"./useCopyToClipboard-OUFPmm48.js";import"./useMountedState-NDYV-m0y.js";import"./Tooltip-BqIA_Hyn.js";import"./useObjectRef-DibnPYi9.js";import"./useOverlayTriggerState-B-0MWh2c.js";import"./utils-Bp1UFdf_.js";import"./useFocusRing-DrLz8-Tu.js";import"./openLink-Zk6hhSyn.js";import"./number-8YiafpBN.js";import"./I18nProvider-BA08ZmK6.js";import"./useControlledState-OVmM0QOa.js";import"./animation-i-bGx-PV.js";import"./useHover-CwSUiPfU.js";import"./ButtonIcon-CSuiwOk1.js";import"./Button--V2N_X5K.js";import"./Label-C46amIDy.js";import"./Hidden-B2CHbqyo.js";import"./useLabel-BhsNw667.js";import"./useLabels-B-OZcbcW.js";import"./useButton-DGptM25J.js";import"./usePress-DvOXzaHx.js";import"./textSelection-DOq0Tvnx.js";import"./index-BPEgRMek.js";import"./LinkButton-h96npD2T.js";import"./Button-BjGfb32U.js";import"./CardHeader-D2U8xA1n.js";import"./Divider-DqI-o82C.js";import"./CardActions-BcZjwxnS.js";import"./BottomLink-DvP7vpXZ.js";import"./ArrowForward-DSXFGD51.js";import"./Box-DUl4t4xa.js";import"./styled-CkYeEFkY.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
