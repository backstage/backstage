import{j as e}from"./iframe-7sCYbwMA.js";import{C as t}from"./CodeSnippet-BIJh80-V.js";import{I as o}from"./InfoCard-CLklFYSJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cwb1jpWy.js";import"./CardContent-BMrB1f67.js";import"./ErrorBoundary-DtnN6iAY.js";import"./ErrorPanel-DvSGfW-z.js";import"./WarningPanel-Bq0BQc0s.js";import"./ExpandMore-C9qCVIMs.js";import"./AccordionDetails-zY8vplAw.js";import"./index-B9sM2jn7.js";import"./Collapse-CKfycns5.js";import"./MarkdownContent-BNhYP9Tb.js";import"./makeStyles-B-ZbX8FI.js";import"./Grid-gVLrUN9k.js";import"./List-BiIsoLBQ.js";import"./ListContext-CefK0ZUa.js";import"./ListItem-tKAcflkD.js";import"./ListItemText-CjPOMK0o.js";import"./CopyTextButton-hdbp3tkM.js";import"./useCopyToClipboard-BATaifjc.js";import"./useMountedState-lQ-fXpOH.js";import"./Tooltip-Kh4-HhuL.js";import"./useObjectRef-B-PPvPC_.js";import"./useOverlayTriggerState-nkxvKS82.js";import"./utils-9GxVsiDp.js";import"./useFocusRing-DtQAi71R.js";import"./number-D8Tvkt0y.js";import"./I18nProvider-CNZdU0-i.js";import"./useControlledState-C8ScjM6r.js";import"./useTooltipTriggerState-BU8FIDCu.js";import"./animation-CpHqW5GJ.js";import"./useHover-Bvne2y_8.js";import"./ButtonIcon-BF7HTXom.js";import"./Button-DGrW_YAy.js";import"./Label-LRQoVPax.js";import"./Hidden-CI0OECmE.js";import"./useLabel-BFjYAAvj.js";import"./useLabels-BJlFaWLE.js";import"./useButton-Drv-lwD1.js";import"./usePress-CQso2Ktw.js";import"./textSelection-oDhLNlBr.js";import"./getMetaValue-BOiM-Q3U.js";import"./index-DXJUlwCm.js";import"./LinkButton-xbypP_bc.js";import"./Link-Bhg-T8Du.js";import"./lodash-CF3MOqf-.js";import"./useApp-BrC99Fm0.js";import"./index-CohR7ztA.js";import"./useAnalytics-5oGCkfyb.js";import"./Button-DgXLVYgc.js";import"./CardHeader-ERJXG85v.js";import"./Divider-DXTUocLH.js";import"./CardActions-CiBt-fEQ.js";import"./BottomLink-9m3oAoNr.js";import"./ArrowForward-D0TUXIoV.js";import"./Box-CDNKgggc.js";import"./styled-aCG7DPFc.js";const fe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
  </InfoCard>`,...m.parameters?.docs?.source}}};const he=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{m as CopyCode,i as Default,p as Languages,a as LineNumbers,s as MultipleLines,n as Overflow,he as __namedExportsOrder,fe as default};
