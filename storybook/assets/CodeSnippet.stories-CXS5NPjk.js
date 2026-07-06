import{bR as e}from"./iframe-D-U3XCi_.js";import{C as t}from"./CodeSnippet-BCp1dgf9.js";import{I as o}from"./InfoCard-G3S64rUk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DUl2QbDn.js";import"./CardContent-B-xquE6F.js";import"./ErrorBoundary-ClylwWFV.js";import"./ErrorPanel-afGinZys.js";import"./WarningPanel-ChoLhM-U.js";import"./ExpandMore-DudBgA4X.js";import"./AccordionDetails-DHQKlz72.js";import"./index-B9sM2jn7.js";import"./Collapse-C3Lt1qny.js";import"./MarkdownContent-CrtvNdWY.js";import"./makeStyles-BHo2IBLU.js";import"./Link-BBOsyqXp.js";import"./lodash-KEAh9Gl1.js";import"./useAnalytics-B1tdSmq6.js";import"./useApp-CXgo0NWV.js";import"./Grid-3D9u4l8r.js";import"./List-Bt_VxheE.js";import"./ListContext-DMa2K4C7.js";import"./ListItem-BICUgtEX.js";import"./ListItemText-Ah0rTT0N.js";import"./CopyTextButton-BQQISJCS.js";import"./useCopyToClipboard-C8ecOTn7.js";import"./useMountedState-CnSySDzk.js";import"./Tooltip-ChAjjmE8.js";import"./useObjectRef-CPQl0FPH.js";import"./useOverlayTriggerState-BMh6qldU.js";import"./utils-BR4WWUPw.js";import"./useFocusRing-ChTmVwiQ.js";import"./openLink-CUqeOgDt.js";import"./number-v8QHaCn-.js";import"./I18nProvider-QDJG5ejG.js";import"./useControlledState-CXF1rY7r.js";import"./animation-DU5l6MIa.js";import"./useHover-C7AGz9RX.js";import"./ButtonIcon-CKZEErcO.js";import"./Button-CNFlQLM7.js";import"./Label-67Mz0DTG.js";import"./Hidden-BT-waPLA.js";import"./useLabel-D8B5Ekv6.js";import"./useLabels-CrgyuspR.js";import"./useButton-CtCvtk7k.js";import"./usePress-D5PsofWG.js";import"./textSelection-C16VXh1L.js";import"./index-1kifiLVj.js";import"./LinkButton-CMRfx4kt.js";import"./Button-BRd0DSzp.js";import"./CardHeader-C_rzVdy4.js";import"./Divider-CbGLj0gZ.js";import"./CardActions-Cd4SkCOb.js";import"./BottomLink-BV1E41nE.js";import"./ArrowForward-YldjUZVQ.js";import"./Box-CiofjXgh.js";import"./styled-B4F0dw99.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
