import{bR as e}from"./iframe-B8uJzJnC.js";import{C as t}from"./CodeSnippet-DNlCYf73.js";import{I as o}from"./InfoCard-D3oGeyfR.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CrkExXws.js";import"./CardContent-D4pakK3Q.js";import"./ErrorBoundary-kk7Vys7z.js";import"./ErrorPanel-DILd_YuW.js";import"./WarningPanel-BGtN9eHQ.js";import"./ExpandMore-h74Mv7eG.js";import"./AccordionDetails-LfQ1yJlW.js";import"./index-B9sM2jn7.js";import"./Collapse-Dyw97_4a.js";import"./MarkdownContent-8tODnh51.js";import"./makeStyles-CENq9NVb.js";import"./Link-p9F1wzce.js";import"./lodash-D9y7SekR.js";import"./useAnalytics-DmS_ziXv.js";import"./useApp-Crzm4FAT.js";import"./Grid-oRgMNHPR.js";import"./List-jJMlgd41.js";import"./ListContext-DB1EvxRt.js";import"./ListItem-BUvXVTsE.js";import"./ListItemText-dB0fGlEm.js";import"./CopyTextButton-Dj8SLSVe.js";import"./useCopyToClipboard-COvIt86Q.js";import"./useMountedState-kS2pBaHK.js";import"./Tooltip-Gmp_C_i_.js";import"./useObjectRef-B58w8bQG.js";import"./useOverlayTriggerState-DCu5HTgY.js";import"./utils-C9WtHl0n.js";import"./useFocusRing-uHGre-No.js";import"./openLink-BUwh7SN8.js";import"./number-Cc-kUzHo.js";import"./I18nProvider-BAFWouLl.js";import"./useControlledState-Bsv8jzCO.js";import"./animation-DAXhfvHs.js";import"./useHover-CGBJrmnR.js";import"./ButtonIcon-DXDifQ2F.js";import"./Button-9hcql9Z1.js";import"./Label-B8rV63W8.js";import"./Hidden--CtbbQAG.js";import"./useLabel-DuQ-sB8F.js";import"./useLabels-vvtSY4r8.js";import"./useButton-B84fiS4B.js";import"./usePress-z5JJKJO5.js";import"./textSelection-COVkqnKL.js";import"./index-C3TndV9r.js";import"./LinkButton-BuyTV1pl.js";import"./Button-CEjLdivj.js";import"./CardHeader-CxyyaewN.js";import"./Divider-CPt0w2jx.js";import"./CardActions-DSIIO7Hl.js";import"./BottomLink-DrpuoWs4.js";import"./ArrowForward-DlGFsYNX.js";import"./Box-C1vqOm76.js";import"./styled-BF0ejy4K.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
