import{bQ as e}from"./iframe-CZAQRplz.js";import{C as t}from"./CodeSnippet-B4Hyy7e_.js";import{I as o}from"./InfoCard-DsyGOK4Y.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DWX2uXpx.js";import"./CardContent-BXK9LcwR.js";import"./ErrorBoundary-C4_CuNrV.js";import"./ErrorPanel-C70WrcfX.js";import"./WarningPanel-jCLK6dLd.js";import"./ExpandMore-DGLt-LUh.js";import"./AccordionDetails-CmRMtsuC.js";import"./index-B9sM2jn7.js";import"./Collapse-D69rxmfn.js";import"./MarkdownContent-BBQs1Glt.js";import"./makeStyles-Cb2cCzWc.js";import"./Link-CvqIzusg.js";import"./lodash-CsxFj9lc.js";import"./useAnalytics-BlCfiJ5k.js";import"./useApp-BwYv7u9J.js";import"./Grid-DzCeEWhe.js";import"./List-DLb1QRd3.js";import"./ListContext-C7UxNvJ1.js";import"./ListItem-ZGqbZKXu.js";import"./ListItemText-CUI1aXOB.js";import"./CopyTextButton-ChiaW4rC.js";import"./useCopyToClipboard-DzIgqp7X.js";import"./useMountedState-CdIJTKGb.js";import"./Tooltip-BbrTD1_A.js";import"./useObjectRef-DwsoHqPD.js";import"./useOverlayTriggerState-BMaBp8bg.js";import"./utils-BddjkJjV.js";import"./useFocusRing-w6vd38rs.js";import"./openLink-CS4qCOfy.js";import"./number-BaLbbo2Y.js";import"./I18nProvider-Dmp-YX3j.js";import"./useControlledState-Cx450bSi.js";import"./animation-5CSH7QQO.js";import"./useHover-CrLHZKML.js";import"./ButtonIcon-wEBhiqto.js";import"./Button-ByHr54p0.js";import"./Label-Z5tvaBq7.js";import"./Hidden-nk8B1O_e.js";import"./useLabel-CveRpJyO.js";import"./useLabels-D2HB4ybw.js";import"./useButton-CKjpqyyh.js";import"./usePress-QNMEwl8q.js";import"./textSelection-DmuaJtMt.js";import"./index-D3WcWjUz.js";import"./LinkButton-BVDaaxoG.js";import"./Button-BWLkKngH.js";import"./CardHeader-DsF7c4GM.js";import"./Divider-D2m1Gpq4.js";import"./CardActions-DtSVEO9j.js";import"./BottomLink-RanllKLE.js";import"./ArrowForward-D_n2-yqt.js";import"./Box-BT6vekTm.js";import"./styled-D7sM8uiQ.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
