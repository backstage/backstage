import{j as e}from"./jsx-runtime-hv06LKfz.js";import{C as t}from"./CodeSnippet-CwnJG0Qr.js";import{I as o}from"./InfoCard-Dl0M9qDn.js";import"./index-D8-PC79C.js";import"./iframe-JtOi6x8T.js";import"./defaultTheme-BZ7Q3aB1.js";import"./classCallCheck-MFKM5G8b.js";import"./inherits-DJtd4kF-.js";import"./useTheme-CwtcVVC7.js";import"./Box-Cdmuh-oH.js";import"./typography-Bv5XhOtM.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./CopyTextButton-BCz9_uHM.js";import"./useCopyToClipboard-BbhvFSBi.js";import"./createSvgIcon-968fIvf3.js";import"./capitalize-Cx0lXINv.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-Bqo-niQy.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./useMountedState-YD35FCBK.js";import"./translation-D3I0K77E.js";import"./TranslationApi-CV0OlCW4.js";import"./ApiRef-ByCJBjX1.js";import"./Tooltip-D0vwVUxP.js";import"./Popper-CMl6z5qo.js";import"./Portal-yuzZovYw.js";import"./Grow-CJaQTCqR.js";import"./utils--Do46zhV.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./IconButton-Bo_KmUI8.js";import"./ButtonBase-C97Mu9vz.js";import"./useTranslationRef-DKy5gnX5.js";import"./index-DlxYA1zJ.js";import"./makeStyles-DNGcMHuZ.js";import"./CardContent-BSTS5EFy.js";import"./Paper-g-2P_2fo.js";import"./ErrorBoundary-BQdyrs03.js";import"./ErrorPanel-CG35a2uh.js";import"./WarningPanel-BD4X1S6V.js";import"./ExpandMore-CjC13_XR.js";import"./AccordionDetails-MA8ABENV.js";import"./toArray-DBEVWI-m.js";import"./index-DnL3XN75.js";import"./Collapse-DypQNfvv.js";import"./Typography-BvnmTcFn.js";import"./MarkdownContent-Dfl-Bsr1.js";import"./index-BKN9BsH4.js";import"./Grid-B5_CkpxN.js";import"./List-BRD79VOL.js";import"./ListContext-Brz5ktZ2.js";import"./ListItem-1Gp_c_kg.js";import"./ListItemText-hnjP-Wi1.js";import"./LinkButton-BQ_gU9WM.js";import"./Button-CEmE9XRa.js";import"./Link-DATBiw5a.js";import"./lodash-D1GzKnrP.js";import"./index-B7KODvs-.js";import"./useApp-BOX1l_wP.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./CardHeader-FmDU_li2.js";import"./Divider-tNHB8jev.js";import"./CardActions-Bx-ZKJ1D.js";import"./BottomLink-ByUsY-tT.js";import"./ArrowForward-Cro0Hf3m.js";const Te={title:"Data Display/CodeSnippet",component:t},l={width:300},r=`const greeting = "Hello";
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
  </InfoCard>`,...m.parameters?.docs?.source}}};const Je=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{m as CopyCode,i as Default,n as Languages,p as LineNumbers,s as MultipleLines,a as Overflow,Je as __namedExportsOrder,Te as default};
