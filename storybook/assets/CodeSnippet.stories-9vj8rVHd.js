import{bR as e}from"./iframe-COykYx45.js";import{C as t}from"./CodeSnippet-XMznKSLI.js";import{I as o}from"./InfoCard-BEACkMb-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CS7sQkHC.js";import"./CardContent-HIXFl6EO.js";import"./ErrorBoundary-DvM2RvVS.js";import"./ErrorPanel-BWXYxd2G.js";import"./WarningPanel-CwfO6u39.js";import"./ExpandMore-BGkiTmW-.js";import"./AccordionDetails-B_CD0nxU.js";import"./index-B9sM2jn7.js";import"./Collapse-E9qJExDE.js";import"./MarkdownContent-TbO5Qkzz.js";import"./makeStyles-4LVf8ZW1.js";import"./Link-Bm3AlTT9.js";import"./lodash-B-tmFX5K.js";import"./useAnalytics-D6lRulOX.js";import"./useApp-OLJN8mL2.js";import"./Grid-BRcD6lxX.js";import"./List-D4wG1S98.js";import"./ListContext-CnRdieQg.js";import"./ListItem-MGSaNCae.js";import"./ListItemText-Cn4bfwC7.js";import"./CopyTextButton-DWVvtU-z.js";import"./useCopyToClipboard-fn2va9VA.js";import"./useMountedState-Bnm4--Gr.js";import"./Tooltip-BOZftJPl.js";import"./useObjectRef-CMiC6ke_.js";import"./useOverlayTriggerState-BkDz7Lrc.js";import"./utils-ijm_b3mJ.js";import"./useFocusRing-Bjvn0GS4.js";import"./openLink-DVwmAOKC.js";import"./number-B3izyAdU.js";import"./I18nProvider-DL1Ps6Ca.js";import"./useControlledState-CjsdyDjY.js";import"./animation-By8SMLky.js";import"./useHover-gDb7vOkJ.js";import"./ButtonIcon-DD_AnQDN.js";import"./Button-Bito0oFe.js";import"./Label--YQs_5DF.js";import"./Hidden-BsQlbI9F.js";import"./useLabel-PGKREU8T.js";import"./useLabels-Cpdv89rG.js";import"./useButton-rnhRQmzJ.js";import"./usePress-C3UrLlH7.js";import"./textSelection-BToKgSXC.js";import"./index-C2j_KLnZ.js";import"./LinkButton-j69OSM6g.js";import"./Button-_4O6aQrK.js";import"./CardHeader-3z96uFuv.js";import"./Divider-1peNkIEd.js";import"./CardActions-CFEHtitp.js";import"./BottomLink-BklS53Q5.js";import"./ArrowForward-B9aemkai.js";import"./Box-BZMsMDiJ.js";import"./styled-CwK1uEmG.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
