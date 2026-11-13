import{j as e}from"./iframe-a5iorYt_.js";import{C as t}from"./CodeSnippet-Dz_bEVXA.js";import{I as o}from"./InfoCard-YGjzIeuk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B19-WIzK.js";import"./CardContent-B3gJe7HN.js";import"./ErrorBoundary-okCI6H6B.js";import"./ErrorPanel-DCIylhjP.js";import"./WarningPanel-dTLQC0wO.js";import"./ExpandMore-C4_a14Ka.js";import"./AccordionDetails-Di5rumEH.js";import"./index-B9sM2jn7.js";import"./Collapse-ex4-Upv2.js";import"./MarkdownContent-sAOjAFni.js";import"./makeStyles-C3e0W14-.js";import"./Grid-GKprjDXV.js";import"./List-DC5vfnmZ.js";import"./ListContext-Dj5C0Bx_.js";import"./ListItem-C_oFpBsa.js";import"./ListItemText-DPcnvc1K.js";import"./CopyTextButton-CGf0YRCN.js";import"./useCopyToClipboard-DGLK9DJc.js";import"./useMountedState-BQtZDAQ3.js";import"./Tooltip-Dhxyt2Bc.js";import"./useObjectRef-DomNprMl.js";import"./useOverlayTriggerState-oc_4bf5x.js";import"./utils-CKuAz2Wi.js";import"./useFocusRing-BW-GobYG.js";import"./number-Ccp2yLIm.js";import"./I18nProvider-Cha0UYwj.js";import"./useControlledState-x1Vpl6eH.js";import"./animation-CocdaLDQ.js";import"./useHover-D7-ycX7p.js";import"./ButtonIcon-CXYdBlUn.js";import"./Button-DH0afYUU.js";import"./Label-Orfe5toA.js";import"./Hidden-Bu-9bwhW.js";import"./useLabel-Bgchr9R9.js";import"./useLabels-BoVBLTQ5.js";import"./useButton-6YfvAB0s.js";import"./usePress-BUjc0uWv.js";import"./textSelection-C8mzHD_X.js";import"./getMetaValue-BDmRRgum.js";import"./index-DmAgGD7M.js";import"./LinkButton-BeBA7NQW.js";import"./Link-CkwOc38T.js";import"./lodash-Ba724kq_.js";import"./useApp-Ch2_fjtz.js";import"./index-CIXpXNvI.js";import"./useAnalytics-DCNn34Rq.js";import"./Button-ChBWl0sJ.js";import"./CardHeader-BW8PuxV9.js";import"./Divider-DGoABXJT.js";import"./CardActions-C4Qewv3T.js";import"./BottomLink-BY_OBjKF.js";import"./ArrowForward-Ca3S07fA.js";import"./Box-BeM7E2iG.js";import"./styled-D8mefoHX.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
