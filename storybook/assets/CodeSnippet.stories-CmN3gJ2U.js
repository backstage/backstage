import{bQ as e}from"./iframe-DXdR4xPj.js";import{C as t}from"./CodeSnippet-CN_ri0t1.js";import{I as o}from"./InfoCard-DcVURpDV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CvcAu-rV.js";import"./CardContent-DR2_sbt6.js";import"./ErrorBoundary-BgB8USAd.js";import"./ErrorPanel-PfozazXQ.js";import"./WarningPanel-dmdEkL6N.js";import"./ExpandMore-Cn9fsZkL.js";import"./AccordionDetails-CcwoEpnL.js";import"./index-B9sM2jn7.js";import"./Collapse-D3SHWrK_.js";import"./MarkdownContent-Ndc2BMHt.js";import"./makeStyles-BSWJde_H.js";import"./Link-CECNWZIJ.js";import"./lodash-CmjgS8yt.js";import"./useAnalytics-Bc97N_iw.js";import"./useApp-cePut29r.js";import"./Grid-DrAuN9Lo.js";import"./List-lTcp28bB.js";import"./ListContext-D9s9W3--.js";import"./ListItem-BOMvkCzo.js";import"./ListItemText-OsK-woHh.js";import"./CopyTextButton-aij2uRTA.js";import"./useCopyToClipboard-DxkyfMR3.js";import"./useMountedState-ONEV228w.js";import"./Tooltip-7f6CFq-V.js";import"./useObjectRef-CbSdwcnt.js";import"./useOverlayTriggerState-9MfyzaMp.js";import"./utils-C-HUDFAG.js";import"./useFocusRing-CYFxGxD_.js";import"./openLink-C1Sid2pZ.js";import"./number-YjzVCZ5M.js";import"./I18nProvider-C2KDHo4-.js";import"./useControlledState-BREXAMRj.js";import"./animation-CfYGLk_Q.js";import"./useHover-DQCkeZXu.js";import"./ButtonIcon-B4V4tS0o.js";import"./Button-lJ2CGbxt.js";import"./Label-Zek0cQNR.js";import"./Hidden-DEL9fdLN.js";import"./useLabel-BKLzxkTR.js";import"./useLabels-D61_ZlAV.js";import"./useButton-BvDLj8oC.js";import"./usePress-CnZ4gSLR.js";import"./textSelection-BYJbH9-e.js";import"./index-DBKaRO06.js";import"./LinkButton-DoccxYCV.js";import"./Button-BeSI4-i4.js";import"./CardHeader-dQQuoZMe.js";import"./Divider-Czk8sHFY.js";import"./CardActions-0Q40kSif.js";import"./BottomLink-CU8oL-Xw.js";import"./ArrowForward-LkgYca9S.js";import"./Box-BJkHSLqZ.js";import"./styled-CiGmUP6u.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
