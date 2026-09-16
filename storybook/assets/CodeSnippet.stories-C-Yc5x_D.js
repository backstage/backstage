import{bQ as e}from"./iframe-Bkld27Xv.js";import{C as t}from"./CodeSnippet-BAb-CPDN.js";import{I as o}from"./InfoCard-C3sh8F5Z.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CzJgrKEb.js";import"./CardContent-DZwWBQX2.js";import"./ErrorBoundary-C7ya_u4g.js";import"./ErrorPanel-BT-PQSDE.js";import"./WarningPanel-CQmY_mE9.js";import"./ExpandMore-9E7NU3_r.js";import"./AccordionDetails-CNTtopAw.js";import"./index-B9sM2jn7.js";import"./Collapse-Ly35HTAO.js";import"./MarkdownContent-CBD_YzTz.js";import"./makeStyles-c8tM0-Si.js";import"./Link-Gb2zw1eg.js";import"./lodash-B0aJYi5c.js";import"./useAnalytics-DgzNfNA8.js";import"./useApp-BeXbzCkx.js";import"./Grid-NPf6_mtF.js";import"./List-B2gY9KR3.js";import"./ListContext-whwYHu0a.js";import"./ListItem-Df-rkWNj.js";import"./ListItemText-BqtvaA3J.js";import"./CopyTextButton-60X9q-dG.js";import"./useCopyToClipboard-CXeRQixX.js";import"./useMountedState-tSzLaBrI.js";import"./Tooltip-BUUG8-Nl.js";import"./useObjectRef-hOSdhRq8.js";import"./useOverlayTriggerState-D0ayscvr.js";import"./utils-DEGlt2_H.js";import"./useFocusRing-Sg8Yc6Zc.js";import"./openLink-Dls5t0TL.js";import"./number-CQltgpBt.js";import"./I18nProvider-CcjFgoxB.js";import"./useControlledState-BDm5gUq3.js";import"./animation-CJ47w7Fx.js";import"./useHover-BTVKyR5u.js";import"./ButtonIcon-BmtQzhOx.js";import"./Button-Dq2R9N9l.js";import"./Label-CzzbJTkN.js";import"./Hidden-CJz8ByQd.js";import"./useLabel-D1T8LrYx.js";import"./useLabels-DgACLhvG.js";import"./useButton-CPwh7t0a.js";import"./usePress-Bi6q7Yb-.js";import"./textSelection-BI78VxK7.js";import"./index--5rDCIj_.js";import"./LinkButton-Dj2VQraC.js";import"./Button-Bp869BTN.js";import"./CardHeader-yWLFVQsv.js";import"./Divider-Ct__Pu1F.js";import"./CardActions-7Zp7Os8E.js";import"./BottomLink-BndWWpsy.js";import"./ArrowForward-DFBfOsou.js";import"./Box-U7ly1rzl.js";import"./styled-Ckr-4rIS.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
