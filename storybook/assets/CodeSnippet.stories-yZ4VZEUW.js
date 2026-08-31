import{bQ as e}from"./iframe-D3gHomOk.js";import{C as t}from"./CodeSnippet-CVrhC5QD.js";import{I as o}from"./InfoCard-CN2bwniX.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CP6cbUjo.js";import"./CardContent-CRMLDtIJ.js";import"./ErrorBoundary-BG4h4gu7.js";import"./ErrorPanel-B0mYOaLc.js";import"./WarningPanel-BpUFRYf8.js";import"./ExpandMore-yHnPDXWT.js";import"./AccordionDetails-Bv_YAfR_.js";import"./index-B9sM2jn7.js";import"./Collapse-Bod_ULtb.js";import"./MarkdownContent-BfLKIc-z.js";import"./makeStyles-T-ZYABdB.js";import"./Link-2oVCQXKr.js";import"./lodash-D6bxT6gM.js";import"./useAnalytics-l6aR9y4o.js";import"./useApp-MRQbwWB5.js";import"./Grid-CyyBT709.js";import"./List-CAlmE_09.js";import"./ListContext-CQj0z8nE.js";import"./ListItem-CqA_znyK.js";import"./ListItemText-DP3tOgeZ.js";import"./CopyTextButton-B_AkJsCd.js";import"./useCopyToClipboard-e2Hpv1m7.js";import"./useMountedState-D4RFf6EC.js";import"./Tooltip-CdsBNNYj.js";import"./useObjectRef-hXxbhaat.js";import"./useOverlayTriggerState-BAAbOSKk.js";import"./utils--jiZfpYa.js";import"./useFocusRing-DHt_dYoo.js";import"./openLink-BpYvnjEr.js";import"./number-L24Dz_3k.js";import"./I18nProvider-Bras-Ck8.js";import"./useControlledState-fmlyVL5h.js";import"./animation-BtY6VQj9.js";import"./useHover-ZdERZDwl.js";import"./ButtonIcon-o_P6yo4U.js";import"./Button-Cu1Zpd0O.js";import"./Label-CAWIGhje.js";import"./Hidden-CXwBcFFN.js";import"./useLabel-W6Ub3U1-.js";import"./useLabels-DMTWiEER.js";import"./useButton-BQFf-KYE.js";import"./usePress-CVpxTLfU.js";import"./textSelection-NP_j1vUN.js";import"./index-CIObmbyT.js";import"./LinkButton-BlCt0Z0M.js";import"./Button-CertJPIG.js";import"./CardHeader-CPX-PcN3.js";import"./Divider-BpCVoIJb.js";import"./CardActions-uOSxC8iy.js";import"./BottomLink-b0yDhGKu.js";import"./ArrowForward-BS2nVRub.js";import"./Box-DrtPh2Ik.js";import"./styled-BVXiuVTX.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
