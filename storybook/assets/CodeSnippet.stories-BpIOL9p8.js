import{j as e}from"./jsx-runtime-hv06LKfz.js";import{C as t}from"./CodeSnippet-DxtDtE5K.js";import{I as o}from"./InfoCard-B63Xa-Zh.js";import"./index-D8-PC79C.js";import"./iframe-DOZJ2UjZ.js";import"./defaultTheme-HGKtGPzz.js";import"./classCallCheck-MFKM5G8b.js";import"./inherits-ClCjHRuI.js";import"./useTheme-Cllnm7xZ.js";import"./Box-DggyAouF.js";import"./typography-CPNtfiQW.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./CopyTextButton-BpN2sfp8.js";import"./useCopyToClipboard-l1GdeqeE.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-DoLugWkO.js";import"./capitalize-CaJ9t4LC.js";import"./withStyles-B13qPX67.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CPc4HhrD.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./useMountedState-YD35FCBK.js";import"./translation-BlsjZX4-.js";import"./TranslationApi-CV0OlCW4.js";import"./ApiRef-ByCJBjX1.js";import"./Tooltip-CeRVkBxz.js";import"./Popper-DxTJbPZX.js";import"./Portal-yuzZovYw.js";import"./Grow-D7k_h4MK.js";import"./utils-CshA_SyI.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./IconButton-BpVpc_TB.js";import"./ButtonBase-BzQRPjNc.js";import"./useTranslationRef-DKy5gnX5.js";import"./index-DlxYA1zJ.js";import"./makeStyles-_0rcpTC-.js";import"./CardContent-CMMuzj2k.js";import"./Paper-CdpPKFDY.js";import"./ErrorBoundary-Cd8q-ar_.js";import"./ErrorPanel-CkaDPYvB.js";import"./WarningPanel-RE4xZHoZ.js";import"./ExpandMore-DEl9sFIR.js";import"./AccordionDetails-BHa5WbHN.js";import"./toArray-CSB0RLEp.js";import"./index-DnL3XN75.js";import"./Collapse-mS3Z96ZF.js";import"./Typography-DGbghBbX.js";import"./MarkdownContent-BnTVG1ji.js";import"./index-BKN9BsH4.js";import"./Grid-BRLm1BjO.js";import"./List-D_wsJPAr.js";import"./ListContext-Brz5ktZ2.js";import"./ListItem-BGl-rwdL.js";import"./ListItemText-CI7VbFK0.js";import"./LinkButton-CA-9jlzN.js";import"./Button-oJMKRAJt.js";import"./Link-Dz1KAoW-.js";import"./lodash-D1GzKnrP.js";import"./index-B7KODvs-.js";import"./useApp-BOX1l_wP.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./CardHeader-CGrPxbNT.js";import"./Divider-B3_0S7po.js";import"./CardActions-DxUaJvLR.js";import"./BottomLink-COi5bhh4.js";import"./ArrowForward-CUP4CW8h.js";const Re={title:"Data Display/CodeSnippet",component:t},l={width:300},r=`const greeting = "Hello";
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
`,i=()=>e.jsx(o,{title:"JavaScript example",children:e.jsx(t,{text:"const hello = 'World';",language:"javascript"})}),s=()=>e.jsx(o,{title:"JavaScript multi-line example",children:e.jsx(t,{text:r,language:"javascript"})}),p=()=>e.jsx(o,{title:"Show line numbers",children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})}),a=()=>e.jsxs(o,{title:"Overflow",children:[e.jsx("div",{style:l,children:e.jsx(t,{text:r,language:"javascript"})}),e.jsx("div",{style:l,children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})})]}),n=()=>e.jsxs(o,{title:"Multiple languages",children:[e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0}),e.jsx(t,{text:d,language:"typescript",showLineNumbers:!0}),e.jsx(t,{text:c,language:"python",showLineNumbers:!0})]}),m=()=>e.jsx(o,{title:"Copy Code",children:e.jsx(t,{text:r,language:"javascript",showCopyCodeButton:!0})});i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"MultipleLines"};p.__docgenInfo={description:"",methods:[],displayName:"LineNumbers"};a.__docgenInfo={description:"",methods:[],displayName:"Overflow"};n.__docgenInfo={description:"",methods:[],displayName:"Languages"};m.__docgenInfo={description:"",methods:[],displayName:"CopyCode"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript example">
    <CodeSnippet text="const hello = 'World';" language="javascript" />
  </InfoCard>`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript multi-line example">
    <CodeSnippet text={JAVASCRIPT} language="javascript" />
  </InfoCard>`,...s.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => <InfoCard title="Show line numbers">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
  </InfoCard>`,...p.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <InfoCard title="Overflow">
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" />
    </div>
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    </div>
  </InfoCard>`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => <InfoCard title="Multiple languages">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    <CodeSnippet text={TYPESCRIPT} language="typescript" showLineNumbers />
    <CodeSnippet text={PYTHON} language="python" showLineNumbers />
  </InfoCard>`,...n.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => <InfoCard title="Copy Code">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showCopyCodeButton />
  </InfoCard>`,...m.parameters?.docs?.source}}};const Oe=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{m as CopyCode,i as Default,n as Languages,p as LineNumbers,s as MultipleLines,a as Overflow,Oe as __namedExportsOrder,Re as default};
