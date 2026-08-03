import{bR as e}from"./iframe-Bep9_wBM.js";import{C as t}from"./CodeSnippet-DuYu6kRQ.js";import{I as o}from"./InfoCard-oLylhRs1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CEGXvcpa.js";import"./CardContent-C6QYissk.js";import"./ErrorBoundary-Xk0CZxpV.js";import"./ErrorPanel-Be9D2jSk.js";import"./WarningPanel-Xpni7Uwn.js";import"./ExpandMore-81E6Sqib.js";import"./AccordionDetails-DZeyCTvf.js";import"./index-B9sM2jn7.js";import"./Collapse-Ddu_bpDm.js";import"./MarkdownContent-C8HeSLCC.js";import"./makeStyles-n7QD1cTQ.js";import"./Link-ltwtLIEX.js";import"./lodash-DlmSvGPN.js";import"./useAnalytics-BQV4eG0U.js";import"./useApp-DlngHpLU.js";import"./Grid-CSg20Lpu.js";import"./List-BDBMMAfU.js";import"./ListContext-B8pcQC18.js";import"./ListItem-BMjBWple.js";import"./ListItemText-CR9yFiV6.js";import"./CopyTextButton-7iMEdpUR.js";import"./useCopyToClipboard-BOzYRH1r.js";import"./useMountedState-CkGlRQBd.js";import"./Tooltip-CR5J2eBR.js";import"./useObjectRef-BMeF5lvf.js";import"./useOverlayTriggerState-Bb7OtJVc.js";import"./utils-DKKUPgM-.js";import"./useFocusRing-E1AuPNx9.js";import"./openLink-DRfzd4-2.js";import"./number-VxDrHCY-.js";import"./I18nProvider-7dRPeGho.js";import"./useControlledState-B2mYurZ2.js";import"./animation-DqvQk7gj.js";import"./useHover-DE1qWbCW.js";import"./ButtonIcon-D8UVM1JY.js";import"./Button-C3UUENf1.js";import"./Label-CXp4l2Zb.js";import"./Hidden-oYhCQ5Lr.js";import"./useLabel-BiWRb2jR.js";import"./useLabels-BH6rqbM3.js";import"./useButton-0kbhVXvj.js";import"./usePress-vAS4agaY.js";import"./textSelection-DySWx5du.js";import"./index-tx8xlZoJ.js";import"./LinkButton-Cdi2YQIA.js";import"./Button-Bf6RmDhY.js";import"./CardHeader-DQYMDK0o.js";import"./Divider-CvC6qSqk.js";import"./CardActions-5CKf2RRX.js";import"./BottomLink-BDRlDztO.js";import"./ArrowForward-D42vsUy-.js";import"./Box-CFxjkepC.js";import"./styled-BV5dnJ-_.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
