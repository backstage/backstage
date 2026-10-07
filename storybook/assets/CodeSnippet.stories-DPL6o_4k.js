import{j as e}from"./iframe-piw0-GWS.js";import{C as t}from"./CodeSnippet-MIwjo4lQ.js";import{I as o}from"./InfoCard-GbTsASxk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CH0FH9SW.js";import"./CardContent-BUQVavTO.js";import"./ErrorBoundary-CUUmrVZZ.js";import"./ErrorPanel-B_VBWO0I.js";import"./WarningPanel-BMhQU64z.js";import"./ExpandMore-Ba6tlNZS.js";import"./AccordionDetails-DJm3cjmM.js";import"./index-B9sM2jn7.js";import"./Collapse-vClSRMBX.js";import"./MarkdownContent-D_hbcDZ9.js";import"./makeStyles-DDl_fC1G.js";import"./Link-9LmnYNwl.js";import"./lodash-Bzqu9al6.js";import"./useAnalytics-CWHO13NO.js";import"./useApp-Buw1Idw2.js";import"./Grid-Bua32Pkj.js";import"./List-waPtU691.js";import"./ListContext-CZXGcFTa.js";import"./ListItem-DDitZ_mI.js";import"./ListItemText-CMhK63aE.js";import"./CopyTextButton-CyN1ozdc.js";import"./useCopyToClipboard-DAM1cjvF.js";import"./useMountedState-CTvcjAp4.js";import"./Tooltip-B2jaja2e.js";import"./useObjectRef-IkhajRyJ.js";import"./useOverlayTriggerState-CkdldBFn.js";import"./utils-wuzg6Gut.js";import"./useFocusRing-BpapEP6W.js";import"./openLink-BiQlZAwx.js";import"./number-gEdanb4Y.js";import"./I18nProvider-DMoCT0pg.js";import"./useControlledState-WBvh0vQ5.js";import"./animation-BJ7i84cK.js";import"./useHover-CBlM-Gvk.js";import"./ButtonIcon-BIt07zdx.js";import"./Button-Cm250GNY.js";import"./Label-BZuUhWGV.js";import"./Hidden-ChjLH5Dh.js";import"./useLabel-ETY-Wxlf.js";import"./useLabels-BulSWJbq.js";import"./useButton-Cruw1eRB.js";import"./usePress-Bwx27jrs.js";import"./textSelection-eCd97__a.js";import"./index-Co7WXYIc.js";import"./LinkButton-Dv13eeTZ.js";import"./Button-CiNhhtor.js";import"./CardHeader-DNkhWOYi.js";import"./Divider-EjBdR9pF.js";import"./CardActions-EU_PHsvk.js";import"./BottomLink-w-FYguUe.js";import"./ArrowForward--Jm9piIz.js";import"./Box-BadlU00i.js";import"./styled-EqtXE7BT.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
