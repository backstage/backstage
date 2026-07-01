import{bR as e}from"./iframe-ttKo4f2F.js";import{C as t}from"./CodeSnippet-CRN9t-EZ.js";import{I as o}from"./InfoCard-cdCVEtz6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cl71yVqQ.js";import"./CardContent-CirP6e67.js";import"./ErrorBoundary-JmqHdtaG.js";import"./ErrorPanel-Bo1QWxsC.js";import"./WarningPanel-BqmdRMXg.js";import"./ExpandMore-CE-5iBpY.js";import"./AccordionDetails-Du8mEtk-.js";import"./index-B9sM2jn7.js";import"./Collapse-BsSU4bZp.js";import"./MarkdownContent-SDpsSPsJ.js";import"./makeStyles-uLqtFRhe.js";import"./Link-C16865Y8.js";import"./lodash-DfqH5_9w.js";import"./useAnalytics-Chjogz3C.js";import"./useApp-CYMzbzRt.js";import"./Grid-DLVq2uhF.js";import"./List-DUqrfDnj.js";import"./ListContext-D9QAtrI3.js";import"./ListItem-0Ck4kHM2.js";import"./ListItemText-DAh9CZXz.js";import"./CopyTextButton-JZH9Qp58.js";import"./useCopyToClipboard-B2bxJjV3.js";import"./useMountedState-BjEFKeC7.js";import"./Tooltip-BReNumtE.js";import"./useObjectRef-CK28UWWB.js";import"./useOverlayTriggerState-RAXhowei.js";import"./utils-C1HatmDL.js";import"./useFocusRing-DO5dfoZO.js";import"./openLink-DrXx31rJ.js";import"./number-BolYm4pY.js";import"./I18nProvider-CE77ZQhE.js";import"./useControlledState-Dm95DOze.js";import"./animation-B6X1Mob_.js";import"./useHover-zTEfdeKB.js";import"./ButtonIcon-CPXGpGBf.js";import"./Button-ByqwGc9h.js";import"./Label-CNpe8i9L.js";import"./Hidden-B19yG0l1.js";import"./useLabel-BtTJK2a0.js";import"./useLabels-BkKSc_yM.js";import"./useButton-Ca5r3393.js";import"./usePress-C-9nwvnr.js";import"./textSelection-Dxn0Zxb-.js";import"./index-B4b2aH3v.js";import"./LinkButton-CkdKj_Cc.js";import"./Button-C_Lw2vUR.js";import"./CardHeader-CMdxufMN.js";import"./Divider-DgaRd4Gx.js";import"./CardActions-DC_Sl_pj.js";import"./BottomLink-D8sjH2o-.js";import"./ArrowForward-C_dX3GEH.js";import"./Box-BLh1p0gC.js";import"./styled-BRZQaIhs.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
