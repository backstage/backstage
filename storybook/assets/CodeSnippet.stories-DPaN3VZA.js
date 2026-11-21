import{j as e}from"./iframe-81VbGqYS.js";import{C as t}from"./CodeSnippet-C9Qd9eKE.js";import{I as o}from"./InfoCard-DUDam3xk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CUwVFkQ3.js";import"./CardContent-CdXGJVJ5.js";import"./ErrorBoundary-cLoktDtH.js";import"./ErrorPanel-BUE9WhgI.js";import"./WarningPanel-C4UqJ8qc.js";import"./ExpandMore-BNqiNRNH.js";import"./AccordionDetails-Zz6eKI1V.js";import"./index-B9sM2jn7.js";import"./Collapse-BjQrsG8d.js";import"./MarkdownContent-zENPN7ya.js";import"./makeStyles-CLUNqzBM.js";import"./Grid-DMrlSwZy.js";import"./List-DIoifV4W.js";import"./ListContext-CiutZ7F_.js";import"./ListItem-BwaGLIri.js";import"./ListItemText-BJVQ0grI.js";import"./CopyTextButton-Bzoc_Gy2.js";import"./useCopyToClipboard-D-VyiVhb.js";import"./useMountedState-aviZ0bSe.js";import"./Tooltip-C6UWXmVf.js";import"./useObjectRef-CnOD3daG.js";import"./useOverlayTriggerState-CQqx4yUK.js";import"./utils-Bc3qSy6a.js";import"./useFocusRing-DYHYlv_4.js";import"./number-CXfm_f_X.js";import"./I18nProvider-DxzKOluv.js";import"./useControlledState-DitDneEU.js";import"./animation-DeGzi18H.js";import"./useHover-BliW0Nnt.js";import"./ButtonIcon-Dr7UhB0P.js";import"./Button-C-RbpSFH.js";import"./Label-Dd3OarLH.js";import"./Hidden-Cb1mFWSL.js";import"./useLabel-DNA1h8U7.js";import"./useLabels-DvwPDbuz.js";import"./useButton-D4MYDvTL.js";import"./usePress-Ck2OcU07.js";import"./textSelection-Dc2ic2y7.js";import"./getMetaValue-CCa-nVAs.js";import"./index-CoR4Ep33.js";import"./LinkButton-Asrs6arc.js";import"./Link-DgC69_CC.js";import"./lodash-BPAWgrT_.js";import"./useApp-Bu-r3o5K.js";import"./index-BTbib15M.js";import"./useAnalytics-CopnWV3T.js";import"./Button-Dqr-Z-RQ.js";import"./CardHeader-GTM5GDqv.js";import"./Divider-C6TLtV4P.js";import"./CardActions-BMXcmTTj.js";import"./BottomLink-CWw7Zke-.js";import"./ArrowForward-BdbIPDQO.js";import"./Box-BgoSIZ4q.js";import"./styled-eVahdZR4.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
