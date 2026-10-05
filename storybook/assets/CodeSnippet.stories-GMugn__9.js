import{j as e}from"./iframe-CbQECOPA.js";import{C as t}from"./CodeSnippet-CSKEK2Pc.js";import{I as o}from"./InfoCard-BvTXIrFe.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cfqd6aij.js";import"./CardContent-j3_1w1wE.js";import"./ErrorBoundary-KeY-zNof.js";import"./ErrorPanel-CpzE7wuI.js";import"./WarningPanel-DNhykJYy.js";import"./ExpandMore-w4okVAj9.js";import"./AccordionDetails-BdVBdXZ3.js";import"./index-B9sM2jn7.js";import"./Collapse-BUSt2Vy5.js";import"./MarkdownContent-XvVxLLbC.js";import"./makeStyles-HVqxQmkH.js";import"./Link-BBVA48MJ.js";import"./lodash-CAc9w3DN.js";import"./useAnalytics-DnyaSYZ-.js";import"./useApp-BfdMvggH.js";import"./Grid-cKtNofK9.js";import"./List-BstmsSO-.js";import"./ListContext-T-wjkpAE.js";import"./ListItem-CbvLjSw5.js";import"./ListItemText-BJDyICCz.js";import"./CopyTextButton-lthHUDdB.js";import"./useCopyToClipboard-Dku9BUnL.js";import"./useMountedState-Db37H698.js";import"./Tooltip-D0iixQsi.js";import"./useObjectRef-rAZvTeo9.js";import"./useOverlayTriggerState-CU1gdxD5.js";import"./utils-BjKqyDUC.js";import"./useFocusRing-BprGfwbh.js";import"./openLink-CkgyiaKP.js";import"./number-CbNxdcRk.js";import"./I18nProvider-X_rloAM9.js";import"./useControlledState-BYBhhx6m.js";import"./animation-LCLQa1wT.js";import"./useHover-C0zeuS3S.js";import"./ButtonIcon-CTFS9Glx.js";import"./Button-CqUujd7S.js";import"./Label-CmorgM_W.js";import"./Hidden-Cie_Gmgv.js";import"./useLabel-BlUgJ3a0.js";import"./useLabels-Hmk_0Efx.js";import"./useButton-hc7LOMzh.js";import"./usePress-C80y_bid.js";import"./textSelection-CTwx7Hd8.js";import"./index-CVJ_DY1z.js";import"./LinkButton-CwxoEf6R.js";import"./Button-B_EutPoV.js";import"./CardHeader-BVm4kNMZ.js";import"./Divider-DrKt6JCo.js";import"./CardActions-C9oZlra7.js";import"./BottomLink-DdHSrykB.js";import"./ArrowForward-WFFca3qk.js";import"./Box-DOhKBQ33.js";import"./styled-DdgLXSlU.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
