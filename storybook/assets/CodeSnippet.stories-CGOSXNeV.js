import{bQ as e}from"./iframe-CLUDVQ5J.js";import{C as t}from"./CodeSnippet-dQxR7JI3.js";import{I as o}from"./InfoCard-DuLBFNwM.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ceSBD9fz.js";import"./CardContent-BhhTxIfW.js";import"./ErrorBoundary-AgMOBiCD.js";import"./ErrorPanel-DZOoudER.js";import"./WarningPanel-B0VO6nyZ.js";import"./ExpandMore-JNID2q_8.js";import"./AccordionDetails-DOQ580-r.js";import"./index-B9sM2jn7.js";import"./Collapse-BCjN4UZr.js";import"./MarkdownContent-CXhXmNdS.js";import"./makeStyles-C-SzIQdx.js";import"./Link-BhsWtFDr.js";import"./lodash-CdFrZFKb.js";import"./useAnalytics-CzwPeQ36.js";import"./useApp-DKdDpZNp.js";import"./Grid-D50qQlpO.js";import"./List-iHDmihoL.js";import"./ListContext-NBUZM1XF.js";import"./ListItem-Dh8Rtio2.js";import"./ListItemText-CHRQEXCC.js";import"./CopyTextButton-WI5gcQHm.js";import"./useCopyToClipboard-DNcv9faM.js";import"./useMountedState-tSS_CzU1.js";import"./Tooltip-BgYCttf5.js";import"./useObjectRef-CQXTcWYX.js";import"./useOverlayTriggerState-CQGaE1Jp.js";import"./utils-CdHRLi7C.js";import"./useFocusRing-Cx5cCMJc.js";import"./openLink-lG-tuZVC.js";import"./number-CoCtNFQ5.js";import"./I18nProvider-s5nF7SKo.js";import"./useControlledState-CzVtswPQ.js";import"./animation-o_HaFoft.js";import"./useHover-DTy99tks.js";import"./ButtonIcon-oVA306rU.js";import"./Button-BmqzM9an.js";import"./Label-CNIOxAyj.js";import"./Hidden-DkhqOV0y.js";import"./useLabel-CjwBUe0X.js";import"./useLabels-q6j7b-So.js";import"./useButton-D_vL7KO0.js";import"./usePress-jgC8cslr.js";import"./textSelection-BVXh5k5C.js";import"./index-CCFrD1rS.js";import"./LinkButton-CwHNoABC.js";import"./Button-CM9r5XvR.js";import"./CardHeader-BI4uxrVr.js";import"./Divider-Bosz2hZb.js";import"./CardActions-CRKEHRjw.js";import"./BottomLink-Cn9nDnih.js";import"./ArrowForward-B3ldPF8A.js";import"./Box-DcD5c5-B.js";import"./styled-hgTb5-qM.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
