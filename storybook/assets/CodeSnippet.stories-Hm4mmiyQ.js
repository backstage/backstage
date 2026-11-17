import{j as e}from"./iframe-BS0xFXlr.js";import{C as t}from"./CodeSnippet-Chslpo80.js";import{I as o}from"./InfoCard-bUWqoDJ6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DC7FuYq9.js";import"./CardContent-D0HKYH9z.js";import"./ErrorBoundary-DqGROnbV.js";import"./ErrorPanel-bQ-UrNen.js";import"./WarningPanel-ocZowaRi.js";import"./ExpandMore-BJk8aIJ8.js";import"./AccordionDetails-38LltlXO.js";import"./index-B9sM2jn7.js";import"./Collapse-BMt5zQG_.js";import"./MarkdownContent-CvGzwc1y.js";import"./makeStyles-BLXzgJv8.js";import"./Grid-BC-GErrP.js";import"./List-3z7MBLVl.js";import"./ListContext-D9vaJRo5.js";import"./ListItem-BV0lDcKg.js";import"./ListItemText-DrTF3v8k.js";import"./CopyTextButton-DcDFfQKz.js";import"./useCopyToClipboard-Cq600UYw.js";import"./useMountedState-7-fWW0Pc.js";import"./Tooltip-BKQmVUTS.js";import"./useObjectRef-DUcg5Ry6.js";import"./useOverlayTriggerState-BmqdnQuv.js";import"./utils-Cm8LN8Qs.js";import"./useFocusRing-DN0Vfw2w.js";import"./number-BpBkSV7H.js";import"./I18nProvider-PG7J6CX1.js";import"./useControlledState--_QEZGZM.js";import"./animation-C8VQ-2r7.js";import"./useHover-CBc8HZSH.js";import"./ButtonIcon-CkaKpehC.js";import"./Button-CEQzuGsm.js";import"./Label-CYKe4XnV.js";import"./Hidden-B4kfQ2c4.js";import"./useLabel-BuvGyTAc.js";import"./useLabels-BEdhgbVu.js";import"./useButton-AcAPGB9_.js";import"./usePress-DqAt-yTJ.js";import"./textSelection-CBFVLC_r.js";import"./getMetaValue-gNZTl7Dq.js";import"./index-DiKBASFX.js";import"./LinkButton-BFk3LDyS.js";import"./Link-CIfFi95r.js";import"./lodash-diAnziC6.js";import"./useApp-DZ3AraTi.js";import"./index-BJ65rCJn.js";import"./useAnalytics-BnNCqh3j.js";import"./Button-DoYq-HNR.js";import"./CardHeader-HCYAjsgW.js";import"./Divider-DPIySf_q.js";import"./CardActions-CYgIvCFZ.js";import"./BottomLink-COf2eYSW.js";import"./ArrowForward-BIWD6UWJ.js";import"./Box-CLuirzLp.js";import"./styled-DTU31MMc.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
