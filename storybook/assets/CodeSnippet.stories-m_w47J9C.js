import{bR as e}from"./iframe-B-XWDeDQ.js";import{C as t}from"./CodeSnippet-CW5DvjkE.js";import{I as o}from"./InfoCard-CgR9qQ3t.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BOP42mNO.js";import"./CardContent-CIgmDbqn.js";import"./ErrorBoundary-DDgaP-Oe.js";import"./ErrorPanel-CaxrQ0ad.js";import"./WarningPanel-r8Qqg8pm.js";import"./ExpandMore-D0m5rZPI.js";import"./AccordionDetails-BaZKIOPB.js";import"./index-B9sM2jn7.js";import"./Collapse-DrD8TQK7.js";import"./MarkdownContent-UDRC7-cM.js";import"./makeStyles-B-ovMmn3.js";import"./Link-CSdGXlEL.js";import"./lodash-B6QrYLNa.js";import"./useAnalytics-DVZxQzXL.js";import"./useApp-DQh8lVpI.js";import"./Grid-DlZWfQ-Q.js";import"./List-B2qp51Az.js";import"./ListContext-FIADtkdO.js";import"./ListItem-DoBNITuN.js";import"./ListItemText-Bzq1QA9U.js";import"./CopyTextButton-C1Tg5Cdg.js";import"./useCopyToClipboard-Bl9FFERX.js";import"./useMountedState-BukLh9ih.js";import"./Tooltip-D4Ye8L4j.js";import"./useObjectRef-BjeGjbpr.js";import"./useOverlayTriggerState-Bvm7VbjX.js";import"./utils-DALzhVoK.js";import"./useFocusRing-rcGClAZz.js";import"./openLink-m4-wtxGX.js";import"./number-CqHCUUB4.js";import"./I18nProvider-DDduGJCb.js";import"./useControlledState-BYvHYB8a.js";import"./animation-DroFJ5da.js";import"./useHover-CNCT38hS.js";import"./ButtonIcon-CLqLS6zp.js";import"./Button-Ce-wB0G_.js";import"./Label-D7GSmtfn.js";import"./Hidden-BedOfKsW.js";import"./useLabel-DttkFmAP.js";import"./useLabels-B3aofaea.js";import"./useButton-Br7mSKpa.js";import"./usePress-RR4GC8Vt.js";import"./textSelection-BxRq1vrn.js";import"./index-Bhxil5SO.js";import"./LinkButton-Ba4qECae.js";import"./Button-BgLQkX8D.js";import"./CardHeader-h6qNwJhC.js";import"./Divider-B6ZuA0Sw.js";import"./CardActions-B2QPS3bN.js";import"./BottomLink-DhnRswsH.js";import"./ArrowForward-D8Yp5peT.js";import"./Box-B2gdNV-U.js";import"./styled-BkxpGzDj.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
