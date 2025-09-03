import{j as e}from"./jsx-runtime-hv06LKfz.js";import{C as t}from"./CodeSnippet-BYf8ynTR.js";import{I as o}from"./InfoCard-B-IwRwAM.js";import"./index-D8-PC79C.js";import"./iframe-B0lKZbgt.js";import"./defaultTheme-NkpNA350.js";import"./classCallCheck-MFKM5G8b.js";import"./inherits-CG-FC_6P.js";import"./useTheme-Dk0AiudM.js";import"./Box-dSpCvcz2.js";import"./typography-Mwc_tj4E.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./CopyTextButton-CNtIvRbE.js";import"./useCopyToClipboard-Bz0ScI6A.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./capitalize-fS9uM6tv.js";import"./withStyles-BsQ9H3bp.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D-gz-Nq7.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./useMountedState-YD35FCBK.js";import"./translation-BlsjZX4-.js";import"./TranslationApi-CV0OlCW4.js";import"./ApiRef-ByCJBjX1.js";import"./Tooltip-fGAyvfC5.js";import"./Popper-ErueZYbr.js";import"./Portal-yuzZovYw.js";import"./Grow-BOepmPk1.js";import"./utils-DMni-BWz.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./IconButton-tgA3biVt.js";import"./ButtonBase-DXo3xcpP.js";import"./useTranslationRef-DKy5gnX5.js";import"./index-DlxYA1zJ.js";import"./makeStyles-CJp8qHqH.js";import"./CardContent-BgHnYunW.js";import"./Paper-BiLxp0Cg.js";import"./ErrorBoundary-CFaWvej5.js";import"./ErrorPanel-BU6m2gEX.js";import"./WarningPanel-weqaMMm-.js";import"./ExpandMore-BGg9E8oN.js";import"./AccordionDetails-Cg_0dnVS.js";import"./toArray-D29G-OqT.js";import"./index-DnL3XN75.js";import"./Collapse-NRZqYfCr.js";import"./Typography-NhBf-tfS.js";import"./MarkdownContent-BV0IOTxf.js";import"./index-BKN9BsH4.js";import"./Grid-8Ap4jsYG.js";import"./List-Bi5n8Alr.js";import"./ListContext-Brz5ktZ2.js";import"./ListItem-CIr9U5k9.js";import"./ListItemText-B_U2MM_y.js";import"./LinkButton-DYRmglqW.js";import"./Button-aFPoPc-s.js";import"./Link-m8k68nLc.js";import"./lodash-D1GzKnrP.js";import"./index-B7KODvs-.js";import"./useApp-BOX1l_wP.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./CardHeader-BwM8TxO4.js";import"./Divider-Gy4Ua46w.js";import"./CardActions-DkGHgpI5.js";import"./BottomLink-CHNwKC1R.js";import"./ArrowForward-CE7WAE8k.js";const Re={title:"Data Display/CodeSnippet",component:t},l={width:300},r=`const greeting = "Hello";
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
