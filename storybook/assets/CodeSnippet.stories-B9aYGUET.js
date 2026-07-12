import{bR as e}from"./iframe-CO97OZwt.js";import{C as t}from"./CodeSnippet-Sjzdfltv.js";import{I as o}from"./InfoCard-C4iZih-L.js";import"./preload-helper-PPVm8Dsz.js";import"./index-WcG_3lsx.js";import"./CardContent-BmJO27tQ.js";import"./ErrorBoundary-jcH8eCpZ.js";import"./ErrorPanel-SeHJyHUg.js";import"./WarningPanel-CzFB5iMj.js";import"./ExpandMore-BPL1AP4S.js";import"./AccordionDetails-isw3SQ-c.js";import"./index-B9sM2jn7.js";import"./Collapse-Bk71s8EA.js";import"./MarkdownContent-d_ySqMKo.js";import"./makeStyles-D4DMJmUw.js";import"./Link-O5NcaLAx.js";import"./lodash-C0Z7IJvU.js";import"./useAnalytics-CapUeVSL.js";import"./useApp-BiPO03hI.js";import"./Grid-DtNjfmqt.js";import"./List-BRt47y1k.js";import"./ListContext-u5bCLc6V.js";import"./ListItem-BYIb0fOi.js";import"./ListItemText-CmNK8CDO.js";import"./CopyTextButton-CcQ1RajZ.js";import"./useCopyToClipboard-D9GNPYkW.js";import"./useMountedState-Bmld38NN.js";import"./Tooltip-B6Od5mh9.js";import"./useObjectRef-BjR_AUMv.js";import"./useOverlayTriggerState-NEjJCFrQ.js";import"./utils-2TV2V9Pm.js";import"./useFocusRing-DpTaIKKT.js";import"./openLink-DjHgJdx-.js";import"./number-CjvqZMqN.js";import"./I18nProvider-D_UQ682O.js";import"./useControlledState-BEju7Fey.js";import"./animation-ChIICKgy.js";import"./useHover-DfkDjIau.js";import"./ButtonIcon-CwIjbb2m.js";import"./Button-iLMA8lft.js";import"./Label-k8w2r2dv.js";import"./Hidden-BxbxCXE4.js";import"./useLabel-Bfjkj2_o.js";import"./useLabels-DeJJCjaB.js";import"./useButton-CXBhsRKD.js";import"./usePress-fdXfQbXd.js";import"./textSelection-d1OV0NFv.js";import"./index-B3bIYSdF.js";import"./LinkButton-CVUf_GSr.js";import"./Button-Cemodz2L.js";import"./CardHeader-DsuQefIb.js";import"./Divider-MAnmQ6L8.js";import"./CardActions-CblqpKgj.js";import"./BottomLink-HPKF-hc4.js";import"./ArrowForward-CpWC3dnd.js";import"./Box-DzvTQIqR.js";import"./styled-B2KOhJlR.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
