import{j as e}from"./iframe-D_sJ6DQq.js";import{C as t}from"./CodeSnippet-D4_0l468.js";import{I as o}from"./InfoCard-a8DWCg_h.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BdNqNG9A.js";import"./CardContent-xNCXi4GL.js";import"./ErrorBoundary-DR9-GWJ0.js";import"./ErrorPanel-C4e-wnbL.js";import"./WarningPanel-DC0apbI3.js";import"./ExpandMore-BPAQkCGI.js";import"./AccordionDetails-WN2ENuyD.js";import"./index-B9sM2jn7.js";import"./Collapse-iL-BhdWY.js";import"./MarkdownContent-l5npv1ih.js";import"./makeStyles-YbKVSigC.js";import"./Link-DK9bz3Wb.js";import"./lodash-CO9od4is.js";import"./useAnalytics-DuovMTEZ.js";import"./useApp-DU8gpE_8.js";import"./Grid-WyTZzD8J.js";import"./List-BTunbdig.js";import"./ListContext-B5K8tLHG.js";import"./ListItem-Bx10SaLX.js";import"./ListItemText-DWiwot-8.js";import"./CopyTextButton-DqizaOeP.js";import"./useCopyToClipboard-COHg6DWB.js";import"./useMountedState-CI2sWujd.js";import"./Tooltip-sRD7G72k.js";import"./useObjectRef-C71_ODYl.js";import"./useOverlayTriggerState-D-wAUn4a.js";import"./utils-rcqHDtde.js";import"./useFocusRing-DDwhFymc.js";import"./openLink-DVi3OW0T.js";import"./number-Dv4CgBIP.js";import"./I18nProvider-Bnu7qnYs.js";import"./useControlledState-F0ZESx8Q.js";import"./animation-uPm_hcT3.js";import"./useHover-CC1tHz-Y.js";import"./ButtonIcon-DMG0d2wX.js";import"./Button-B76pvApp.js";import"./Label-CqUgdJka.js";import"./Hidden-B0JsmZw6.js";import"./useLabel-JU3kQl_C.js";import"./useLabels-CtqB2Ot9.js";import"./useButton-BuKBKhUn.js";import"./usePress-LFrjKvgu.js";import"./textSelection-5Cu1iBDL.js";import"./getMetaValue-DT9wVw6b.js";import"./index-BDjCUC6F.js";import"./LinkButton-CQHX5Psd.js";import"./Button-DZ0LMJcJ.js";import"./CardHeader-sUfWQ8fQ.js";import"./Divider-_pvAg02y.js";import"./CardActions-DuIME4yO.js";import"./BottomLink-DLAlK4LM.js";import"./ArrowForward-CwGGgck8.js";import"./Box-DJ0NzJ3e.js";import"./styled-DG5hZJap.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
