import{bQ as e}from"./iframe-CdNUyns1.js";import{C as t}from"./CodeSnippet-DQpn4qYh.js";import{I as o}from"./InfoCard-BEBS06No.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cn4V3qtH.js";import"./CardContent-CK4ALQnz.js";import"./ErrorBoundary-BSQbVijS.js";import"./ErrorPanel-BEqNr6KB.js";import"./WarningPanel-C4FRvUub.js";import"./ExpandMore-CAqCuZZf.js";import"./AccordionDetails-wdruAoAq.js";import"./index-B9sM2jn7.js";import"./Collapse--EAsaz9T.js";import"./MarkdownContent-CDZMdAKe.js";import"./makeStyles-CHAgNhAt.js";import"./Link-NLVSI6WU.js";import"./lodash-LaLztEdN.js";import"./useAnalytics-uPHW0hxD.js";import"./useApp-B1xNj-di.js";import"./Grid-CuUKwjma.js";import"./List-DcrVr_XM.js";import"./ListContext-BojgFJwk.js";import"./ListItem-DgRPj49U.js";import"./ListItemText-0KNl44ZE.js";import"./CopyTextButton-ByOwGKR1.js";import"./useCopyToClipboard-D3Ajb6Br.js";import"./useMountedState-CtNbdOCx.js";import"./Tooltip-DtfFdx8E.js";import"./useObjectRef-CFuPSG1M.js";import"./useOverlayTriggerState-CxgiGkff.js";import"./utils-B3O2Yp_M.js";import"./useFocusRing-BuKVGuQV.js";import"./openLink-DihNKPlJ.js";import"./number-CzhiuJx7.js";import"./I18nProvider-B6FBVrT9.js";import"./useControlledState-BN5fLvZ3.js";import"./animation-Dtm5YrM0.js";import"./useHover-Cn5cU9qj.js";import"./ButtonIcon-ZRgf0k-E.js";import"./Button-Cb98tIb7.js";import"./Label-D16an-mE.js";import"./Hidden-CS8th6sD.js";import"./useLabel-BERv6pEw.js";import"./useLabels-uizblfZx.js";import"./useButton-BtcENp-V.js";import"./usePress-_7EGmIU1.js";import"./textSelection-SXrH1sR5.js";import"./index-C5_u8aRu.js";import"./LinkButton-CQifx43J.js";import"./Button-DbqKKbvo.js";import"./CardHeader-BWrG8fBK.js";import"./Divider-C8Hu2NoW.js";import"./CardActions-e5Qj4zZx.js";import"./BottomLink-BKyKpu91.js";import"./ArrowForward-Crk0lUkz.js";import"./Box-DFc3IFyj.js";import"./styled-_ZZ8vobE.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
