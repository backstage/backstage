import{j as e}from"./iframe-CixUC8j1.js";import{C as t}from"./CodeSnippet-COxgCtHQ.js";import{I as o}from"./InfoCard-BOmCx5AL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D8S5QgdP.js";import"./CardContent-BA-IZLol.js";import"./ErrorBoundary-Dbr3pfwq.js";import"./ErrorPanel-DiCZrcEY.js";import"./WarningPanel-BAeDjmsv.js";import"./ExpandMore-3jioOoyt.js";import"./AccordionDetails-NyKf8Xo-.js";import"./index-B9sM2jn7.js";import"./Collapse-DQ3rQ8cQ.js";import"./MarkdownContent-MSOZfQfF.js";import"./makeStyles-Cp3IDLB-.js";import"./Grid-CcKL163D.js";import"./List-DhQPLXmh.js";import"./ListContext-Cbu1p0g4.js";import"./ListItem-DErUsc_W.js";import"./ListItemText-DV7i0mx3.js";import"./CopyTextButton-wonpWAmi.js";import"./useCopyToClipboard-n7e7qasm.js";import"./useMountedState-lFO_PUS8.js";import"./Tooltip-CCX8ZUgp.js";import"./useObjectRef-ZdsVGe-3.js";import"./useOverlayTriggerState-qIPRLIZl.js";import"./utils-C0RYu6E0.js";import"./useFocusRing-CitxrkAs.js";import"./openLink-D1LWGCtX.js";import"./number-CoVgoHrl.js";import"./I18nProvider-BvzqfVc8.js";import"./useControlledState-BB9FqNcJ.js";import"./animation-D2Z_ye8z.js";import"./useHover-BFydUWI5.js";import"./ButtonIcon-Dzi62hqC.js";import"./Button-CeKECDlo.js";import"./Label-C5NXX0n-.js";import"./Hidden-BWMUkUTp.js";import"./useLabel-D_XETIfd.js";import"./useLabels-Dy-UjWsQ.js";import"./useButton-4XVXMs9M.js";import"./usePress-DrmMjR9D.js";import"./textSelection-BvqPUlaX.js";import"./getMetaValue-B3Np7h3R.js";import"./index-CMV6OJRm.js";import"./LinkButton-Q7iDhahs.js";import"./Link-DUMwxCe0.js";import"./lodash-NKDvZXjW.js";import"./useAnalytics-BNURDc1p.js";import"./useApp-CjKAgEMO.js";import"./Button-DvH76Tkn.js";import"./CardHeader-Bq3vnjjR.js";import"./Divider-BRRI1BXY.js";import"./CardActions-BNxwCLU1.js";import"./BottomLink-BXUJ6Qwj.js";import"./ArrowForward-D-UM9je5.js";import"./Box-D1RsNjpj.js";import"./styled-CqIv_so7.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
