import{j as e}from"./iframe-GY9q4FO8.js";import{C as t}from"./CodeSnippet-DWYcITvw.js";import{I as o}from"./InfoCard-DXftCzzT.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C3IUYLj9.js";import"./CardContent-DHMfeHPH.js";import"./ErrorBoundary-CEJ0Wbo8.js";import"./ErrorPanel-B2usRCC0.js";import"./WarningPanel-BKcSoPj-.js";import"./ExpandMore-mPh2u-wz.js";import"./AccordionDetails-DlHqPWZU.js";import"./index-B9sM2jn7.js";import"./Collapse-BzXHHZIv.js";import"./MarkdownContent-DNX1ANkJ.js";import"./makeStyles-2U49SRly.js";import"./Link-C7aPd1jE.js";import"./lodash-DzeDbzRd.js";import"./useAnalytics-ChuvGTuC.js";import"./useApp-KPq2D3WO.js";import"./Grid-B0Qn3Dnm.js";import"./List-WDJE0HvX.js";import"./ListContext-Dnh-YOBQ.js";import"./ListItem-ChY-Ftn4.js";import"./ListItemText-Bk-2uhgD.js";import"./CopyTextButton-DlLc650l.js";import"./useCopyToClipboard-YyT6YTC8.js";import"./useMountedState-Dc2o9XUu.js";import"./Tooltip-Cl5tUfxA.js";import"./useObjectRef-DlPyeYly.js";import"./useOverlayTriggerState-6qevt50p.js";import"./utils-UG8wIxPz.js";import"./useFocusRing-BlRt_wPT.js";import"./openLink-CFz-JK3Y.js";import"./number-B5JXBwAu.js";import"./I18nProvider-BhiwSHej.js";import"./useControlledState-BK9RR_T7.js";import"./animation-CJ3qHqN2.js";import"./useHover-BHwy1G7-.js";import"./ButtonIcon-CnthuoFG.js";import"./Button-gV3JsRfd.js";import"./Label-Bc_GMvnu.js";import"./Hidden-nquVvtJw.js";import"./useLabel-uMVcdOMo.js";import"./useLabels-DnIs0d0f.js";import"./useButton-CUs3xyC6.js";import"./usePress-CTng4HyG.js";import"./textSelection-DeC98-eF.js";import"./getMetaValue-XB_wrXKe.js";import"./index-CbkTlW2S.js";import"./LinkButton-ZTSH9wuY.js";import"./Button-Bm-Lau1a.js";import"./CardHeader-BHuSEaYk.js";import"./Divider-D09MS3Wy.js";import"./CardActions-HKyfyXxK.js";import"./BottomLink-D9yd9JKn.js";import"./ArrowForward-somBccHw.js";import"./Box-BD1hfHK_.js";import"./styled-gNaRwUS_.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
