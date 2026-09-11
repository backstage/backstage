import{bQ as e}from"./iframe-JPiukB_R.js";import{C as t}from"./CodeSnippet-CtzanSn-.js";import{I as o}from"./InfoCard-CpWA96UB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D_sl5V-c.js";import"./CardContent-B-Im3wn4.js";import"./ErrorBoundary-sOb21j99.js";import"./ErrorPanel-D8xJcORe.js";import"./WarningPanel-omqd1JgS.js";import"./ExpandMore-BkSBOuu1.js";import"./AccordionDetails-ZblsgKn7.js";import"./index-B9sM2jn7.js";import"./Collapse-C9D40sA-.js";import"./MarkdownContent-CKtPazSD.js";import"./makeStyles-CRHqG-EO.js";import"./Link-C3f28ZV-.js";import"./lodash-6cxX-S9O.js";import"./useAnalytics-D8KrhC1p.js";import"./useApp-XQFXwPZE.js";import"./Grid-CNTu3jbM.js";import"./List-T_3_nzLY.js";import"./ListContext-DVVZhWT2.js";import"./ListItem-Bq2ZKbAR.js";import"./ListItemText-D-VVQSJ3.js";import"./CopyTextButton-CnsymFaI.js";import"./useCopyToClipboard-Cve9BWk7.js";import"./useMountedState-Do2NdkuI.js";import"./Tooltip-DAMzI_jU.js";import"./useObjectRef-DXVQTGA8.js";import"./useOverlayTriggerState-D8Agx5ZP.js";import"./utils-DDi5xxmN.js";import"./useFocusRing-DaX8_kMK.js";import"./openLink-0QZlDlxj.js";import"./number-G04hMwQn.js";import"./I18nProvider-DFp_bXrB.js";import"./useControlledState-BQx1jdRH.js";import"./animation-0YAkd_Wy.js";import"./useHover-BNLW-94k.js";import"./ButtonIcon-DQjFZlPD.js";import"./Button-DEJ5jMKU.js";import"./Label-IokeRjbO.js";import"./Hidden-B-d7XQtl.js";import"./useLabel-D_mWupuI.js";import"./useLabels-NEKiuqWd.js";import"./useButton-CuUkU0tZ.js";import"./usePress-BL8d4Qht.js";import"./textSelection-DFCD4j4A.js";import"./index-DFKLNzc2.js";import"./LinkButton-DRGPiad9.js";import"./Button-C7mx8u5A.js";import"./CardHeader-Cpnr9Zqx.js";import"./Divider-DtYbuN8a.js";import"./CardActions-CjXqtGN2.js";import"./BottomLink-DPJ_Qni3.js";import"./ArrowForward-DpEcs1ps.js";import"./Box-B2a9eHDH.js";import"./styled-DQnat59B.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
