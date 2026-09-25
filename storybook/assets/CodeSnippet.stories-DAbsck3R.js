import{j as e}from"./iframe-SQ-DrL5X.js";import{C as t}from"./CodeSnippet-DrVOOVLi.js";import{I as o}from"./InfoCard-DWykMckN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-hXrAf_FH.js";import"./CardContent-WV8P6ovB.js";import"./ErrorBoundary-DbbDToTc.js";import"./ErrorPanel-Ckzx14op.js";import"./WarningPanel-C1kgmh91.js";import"./ExpandMore-DJRaFll9.js";import"./AccordionDetails-jaK267eJ.js";import"./index-B9sM2jn7.js";import"./Collapse-jswZGveg.js";import"./MarkdownContent-DnTsAUwj.js";import"./makeStyles-CcvGO_cU.js";import"./Link-Bar4EQzr.js";import"./lodash-aVxBzF5u.js";import"./useAnalytics-CVS451d_.js";import"./useApp-BSyWMm0o.js";import"./Grid-HVfBHifM.js";import"./List-DB7A22uf.js";import"./ListContext-kEGsA8es.js";import"./ListItem-gDNiL9FP.js";import"./ListItemText-k6zwYryN.js";import"./CopyTextButton-DZCWb9mw.js";import"./useCopyToClipboard-C4mcqumo.js";import"./useMountedState-DACqQM7r.js";import"./Tooltip-pye6v7I6.js";import"./useObjectRef-BvCpdf-D.js";import"./useOverlayTriggerState-DEML2GX7.js";import"./utils-DS6PrpIl.js";import"./useFocusRing-BjVI5GO7.js";import"./openLink-DWLtw0ci.js";import"./number-CcK3WKXn.js";import"./I18nProvider-z6RUFbQd.js";import"./useControlledState-BLu3Mzk7.js";import"./animation-CoeCW5HE.js";import"./useHover-DHCGAdFi.js";import"./ButtonIcon-DSZd6VxV.js";import"./Button-ChyeSkQq.js";import"./Label-CZqZr_x1.js";import"./Hidden-ZDc1mtAl.js";import"./useLabel-w96aGTJB.js";import"./useLabels-X84YCiAH.js";import"./useButton-BSkNsead.js";import"./usePress-DMyM15Qa.js";import"./textSelection-B-fLBI4W.js";import"./index-CmVRNaDw.js";import"./LinkButton-6YJ1Jtpg.js";import"./Button-G5NaejVu.js";import"./CardHeader-BxO2RmfD.js";import"./Divider-DIkUV8fk.js";import"./CardActions-CJx96u-9.js";import"./BottomLink-DiUvTKKw.js";import"./ArrowForward-BXlAZHta.js";import"./Box-jO9atyci.js";import"./styled-1GO4OxeJ.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
