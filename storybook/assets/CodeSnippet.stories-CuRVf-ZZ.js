import{bR as e}from"./iframe-DQtIir6_.js";import{C as t}from"./CodeSnippet-BTplX1ot.js";import{I as o}from"./InfoCard-CUzO7QG-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CEfocwCu.js";import"./CardContent-Bi2WkZHj.js";import"./ErrorBoundary-Bx4rEJIk.js";import"./ErrorPanel-ZL5mskZ0.js";import"./WarningPanel-DV06t-QB.js";import"./ExpandMore-Dx9L6UHV.js";import"./AccordionDetails-CEs8-W4z.js";import"./index-B9sM2jn7.js";import"./Collapse-ELObKcrO.js";import"./MarkdownContent-CCrH7sfU.js";import"./makeStyles-BGUJ1R1k.js";import"./Link-WvvQIOcL.js";import"./lodash-BeLSVBlD.js";import"./useAnalytics-Nt1lbfmh.js";import"./useApp-D0OeqPVb.js";import"./Grid-DtwO6FOq.js";import"./List-C72_ZxQh.js";import"./ListContext-f0KYlYlh.js";import"./ListItem-D7j56-L5.js";import"./ListItemText-CKhQJenL.js";import"./CopyTextButton-SBufMEt8.js";import"./useCopyToClipboard-iDN3WyYX.js";import"./useMountedState-DRMZFfHM.js";import"./Tooltip-zNdaS_lN.js";import"./useObjectRef-DXWxL9lA.js";import"./useOverlayTriggerState-BR5G58Ql.js";import"./utils-Bxehr4HY.js";import"./useFocusRing-C5ZfLx-L.js";import"./openLink-DLb8P_7j.js";import"./number-CQw8CDov.js";import"./I18nProvider-DPDmyrTN.js";import"./useControlledState-DM-B3g3-.js";import"./animation-BlVyC_Be.js";import"./useHover-Dsk-KXl4.js";import"./ButtonIcon-DlTdXCD7.js";import"./Button-hU1qrjNo.js";import"./Label-CAcSZgVu.js";import"./Hidden-BXNE10bz.js";import"./useLabel-mAp9Q6tE.js";import"./useLabels-DLIlGtBk.js";import"./useButton-yvh0BHKl.js";import"./usePress-T3jvNl8O.js";import"./textSelection-Nrcy7rMY.js";import"./index-DAbm8TV7.js";import"./LinkButton-ChAyKdbb.js";import"./Button-sx16262P.js";import"./CardHeader-D2GrR6BT.js";import"./Divider-D3NWx-U1.js";import"./CardActions-Br8YHs3S.js";import"./BottomLink-DmtFclF9.js";import"./ArrowForward-BNXN6f56.js";import"./Box-O4mveAiq.js";import"./styled-BhIgo9Dl.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
