import{j as e}from"./iframe-CEdcshkh.js";import{C as t}from"./CodeSnippet-DqEPYshT.js";import{I as o}from"./InfoCard-BaHEwcd3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CITjFLh0.js";import"./CardContent-Dh2YX1iS.js";import"./ErrorBoundary-Dji-tNMV.js";import"./ErrorPanel-CamVLn4e.js";import"./WarningPanel-Dmuu57Pn.js";import"./ExpandMore-SNQoBKIF.js";import"./AccordionDetails-BBPsCRMd.js";import"./index-B9sM2jn7.js";import"./Collapse-BngPqMFp.js";import"./MarkdownContent-Dn21_Bly.js";import"./makeStyles-1bD4tTRg.js";import"./Grid-Cg_-Bg10.js";import"./List-Sn2FWo5J.js";import"./ListContext-DS5F4hFB.js";import"./ListItem-G31fJH_u.js";import"./ListItemText-D2eIuV1L.js";import"./CopyTextButton-DZHfnr63.js";import"./useCopyToClipboard-kbvtY6SN.js";import"./useMountedState-ClsGneNr.js";import"./Tooltip-DfjSVAXc.js";import"./useObjectRef-Cea8mF9S.js";import"./useOverlayTriggerState-BX1potNy.js";import"./utils-B3z3rPQ3.js";import"./useFocusRing-CKR_B2iC.js";import"./number-tjQdiso3.js";import"./I18nProvider-GWcSS_jn.js";import"./useControlledState-CY36eiiU.js";import"./animation-NCXLQN6E.js";import"./useHover-C0ptGV0J.js";import"./ButtonIcon-Bk-ZEocg.js";import"./Button-Cztc6Ql0.js";import"./Label-9Olhdt6S.js";import"./Hidden-nn8Lz43U.js";import"./useLabel-BWFl0EGX.js";import"./useLabels-B11tK9ex.js";import"./useButton-DltJ2Eig.js";import"./usePress-CLU-UWu1.js";import"./textSelection-WSwNKXEc.js";import"./getMetaValue-BMvIIQYf.js";import"./index-Bowgs7Nu.js";import"./LinkButton-CaaXa6MO.js";import"./Link-D32Zgqnn.js";import"./lodash-DpFEZWQS.js";import"./useApp-Bnf2R7wN.js";import"./index-BMdILVLE.js";import"./useAnalytics-BKVYJGWd.js";import"./Button-C9p524-g.js";import"./CardHeader-CxLHmowS.js";import"./Divider-B9eEyIik.js";import"./CardActions-1rpsv-Zz.js";import"./BottomLink-BNKAy9Yt.js";import"./ArrowForward-edxfUtSB.js";import"./Box-U2ogRZ16.js";import"./styled-BnWtJPbf.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
