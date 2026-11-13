import{j as e}from"./iframe-jnmYTFb3.js";import{C as t}from"./CodeSnippet-BwHAf_s7.js";import{I as o}from"./InfoCard-BfXPxrfd.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CdOJX-9o.js";import"./CardContent-BpNOkdyP.js";import"./ErrorBoundary-B2DaKNiV.js";import"./ErrorPanel-B_TITbIF.js";import"./WarningPanel-Dg3CiKPr.js";import"./ExpandMore-CA8sV17M.js";import"./AccordionDetails-Cr-qO6HI.js";import"./index-B9sM2jn7.js";import"./Collapse-DTDzxOj5.js";import"./MarkdownContent-DJmkymU6.js";import"./makeStyles-BpJnXHFG.js";import"./Grid-DHhCW-Yl.js";import"./List-DNNk4mb1.js";import"./ListContext-DcU_gvQM.js";import"./ListItem-BO9RXUpG.js";import"./ListItemText-BnRAJA86.js";import"./CopyTextButton-gYqzu9p-.js";import"./useCopyToClipboard-Dr9NpXhu.js";import"./useMountedState-zcJIkXnT.js";import"./Tooltip-B1tKDHkx.js";import"./useObjectRef-FWUTxVt4.js";import"./useOverlayTriggerState-B51CCYAg.js";import"./utils-CKg7Fv9H.js";import"./useFocusRing-BdOMpJmy.js";import"./number-C6hsbYZL.js";import"./I18nProvider-CZql2cBv.js";import"./useControlledState-CrGsVDTu.js";import"./animation-CVivYYSw.js";import"./useHover-uknbF-p6.js";import"./ButtonIcon-sVT7F_2-.js";import"./Button-DgXb-SRY.js";import"./Label-B1pLoO_3.js";import"./Hidden-xHEnn_eG.js";import"./useLabel-0FUhOvtV.js";import"./useLabels-BVz1Fy9t.js";import"./useButton-CukdYqmR.js";import"./usePress-0a27YkJt.js";import"./textSelection-BFpEW1JG.js";import"./getMetaValue-vz9tQ4MU.js";import"./index-C6hgsZfa.js";import"./LinkButton-C3rzieqs.js";import"./Link-DMTmhcL8.js";import"./lodash-DMwpKwqE.js";import"./useApp-BB1JgkaP.js";import"./index-C7-0R-zP.js";import"./useAnalytics-BuCMBFsG.js";import"./Button-B0YoQGzG.js";import"./CardHeader-C98tvif3.js";import"./Divider-Cc2XeNV9.js";import"./CardActions-7VKJMdmt.js";import"./BottomLink-D9_78dwf.js";import"./ArrowForward-DgidlQv-.js";import"./Box-C2sZFW6J.js";import"./styled-DtEigLlW.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
