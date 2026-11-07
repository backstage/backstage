import{j as e}from"./iframe-DxHtOo4h.js";import{C as t}from"./CodeSnippet-f0qJWQ8O.js";import{I as o}from"./InfoCard-CpjUU_4L.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CAPgTbWL.js";import"./CardContent-7c1s-azq.js";import"./ErrorBoundary-DaPlGVqb.js";import"./ErrorPanel-B559rGLk.js";import"./WarningPanel-C5rJCy3f.js";import"./ExpandMore-qdEe6k8B.js";import"./AccordionDetails-BqRBZ8Ld.js";import"./index-B9sM2jn7.js";import"./Collapse-CYvnrGna.js";import"./MarkdownContent-DZTaG7Yx.js";import"./makeStyles-B7nUh3vz.js";import"./Link-Bm6GKZly.js";import"./lodash-B7zTZt0L.js";import"./useAnalytics-5JWmj_TX.js";import"./useApp-fIwTxcF-.js";import"./Grid-BZqH7GD7.js";import"./List-Ddwma2A2.js";import"./ListContext-DvRxGEhI.js";import"./ListItem-B7wjmJPK.js";import"./ListItemText-BWTiMM1K.js";import"./CopyTextButton-Bo_3Krq8.js";import"./useCopyToClipboard-JS5eRxMH.js";import"./useMountedState-CCrts7qQ.js";import"./Tooltip-Ckxq85bP.js";import"./useObjectRef-D6AnwJdq.js";import"./useOverlayTriggerState-DW7Yz7pQ.js";import"./utils-CAdw532L.js";import"./useFocusRing-DGlhroDz.js";import"./openLink-DpClGL1h.js";import"./number-CI02LZgf.js";import"./I18nProvider-CE0E7M0k.js";import"./useControlledState-BOC0pUVV.js";import"./animation-BiNajT-w.js";import"./useHover-CHigp1TN.js";import"./ButtonIcon-BqQ6_ttV.js";import"./Button-CI1wjYfp.js";import"./Label-JZuHlYG-.js";import"./Hidden-C-73n3sF.js";import"./useLabel-D3L5WW2z.js";import"./useLabels-DjvWLG0Y.js";import"./useButton-DqQwDYXZ.js";import"./usePress-Du1TfnjE.js";import"./textSelection-BtPkczBw.js";import"./getMetaValue-Its-2R3E.js";import"./index-DmHLeUzN.js";import"./LinkButton-if716wd4.js";import"./Button-Bu_GuVWD.js";import"./CardHeader-D4lruEF9.js";import"./Divider-CDENPayv.js";import"./CardActions-DxYE2apE.js";import"./BottomLink-BPBOP6Ml.js";import"./ArrowForward-BcDKqN9P.js";import"./Box-D4AmoVSQ.js";import"./styled-MrIf0eXW.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
