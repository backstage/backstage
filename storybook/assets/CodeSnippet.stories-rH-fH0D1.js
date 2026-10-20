import{j as e}from"./iframe-B3Qnvxa_.js";import{C as t}from"./CodeSnippet-BM51OYKd.js";import{I as o}from"./InfoCard-DdpkH81U.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C3qdUgQ1.js";import"./CardContent-lQJoKpwU.js";import"./ErrorBoundary-B8se3Yt9.js";import"./ErrorPanel-BCMfOXEH.js";import"./WarningPanel-DlErjIr0.js";import"./ExpandMore-CgJbyJ5r.js";import"./AccordionDetails-tpTnfm89.js";import"./index-B9sM2jn7.js";import"./Collapse-BrZ4y2IA.js";import"./MarkdownContent-o6HeTxuT.js";import"./makeStyles-CKJzIE9W.js";import"./Link-xSsqqjq2.js";import"./lodash-BpdBJ3tT.js";import"./useAnalytics-9bqjDfWa.js";import"./useApp-D5j1Erf4.js";import"./Grid-TGje1sD4.js";import"./List-BLwAGsov.js";import"./ListContext-CNPil1Lk.js";import"./ListItem-Ccoxgxd1.js";import"./ListItemText-a8r1gKrP.js";import"./CopyTextButton-BL5Dz0DI.js";import"./useCopyToClipboard-BPFczjZW.js";import"./useMountedState-JU61B273.js";import"./Tooltip-D2IZ3a6Y.js";import"./useObjectRef-BLUGjhTS.js";import"./useOverlayTriggerState-eGmwqTEM.js";import"./utils-If5ksnAe.js";import"./useFocusRing-kY9ZCJul.js";import"./openLink-DUBrf5Vo.js";import"./number-IY6oxrwY.js";import"./I18nProvider-w0p5O94b.js";import"./useControlledState-Bz4IB1Ec.js";import"./animation-zPNoS82u.js";import"./useHover-CMuPDAG4.js";import"./ButtonIcon-Djr17d_F.js";import"./Button-D7TKPyRW.js";import"./Label-Z8qmlos3.js";import"./Hidden-D0v5Fd-T.js";import"./useLabel-DtpxzJ5z.js";import"./useLabels-bYYWYrus.js";import"./useButton-D8THw0ar.js";import"./usePress-DS_kkfX7.js";import"./textSelection-C-KNkP-o.js";import"./getMetaValue-Bfb9dALM.js";import"./index-CymDSTkJ.js";import"./LinkButton-DtV1Pvqj.js";import"./Button-Bum_6CMR.js";import"./CardHeader-DoSi1QtF.js";import"./Divider-9gr3AqUY.js";import"./CardActions-DwKFUfjE.js";import"./BottomLink-jB1lPO-W.js";import"./ArrowForward-CiYNeKp3.js";import"./Box-PnVGeCt7.js";import"./styled-CANxBVf5.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
