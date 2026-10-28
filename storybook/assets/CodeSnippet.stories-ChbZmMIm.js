import{j as e}from"./iframe-BIybnMXI.js";import{C as t}from"./CodeSnippet-XmFwewW9.js";import{I as o}from"./InfoCard-D4PS0jdR.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C71EKvje.js";import"./CardContent-CBOdYv6D.js";import"./ErrorBoundary-BH2yBwvW.js";import"./ErrorPanel-CpAnlstS.js";import"./WarningPanel-1OyW3Mut.js";import"./ExpandMore-DngtdUVl.js";import"./AccordionDetails-DaKdjAtU.js";import"./index-B9sM2jn7.js";import"./Collapse-B_j-r4sF.js";import"./MarkdownContent-DVMKUHD_.js";import"./makeStyles-cGXTSjHb.js";import"./Link-DXi97D8o.js";import"./lodash-BF9MgLAH.js";import"./useAnalytics-Cee1mTCP.js";import"./useApp-B-DAdzWT.js";import"./Grid-CKJ_Bjce.js";import"./List-BskmEb7a.js";import"./ListContext-Dy9wnKpt.js";import"./ListItem-B-2MPIj6.js";import"./ListItemText-2j2zbfbt.js";import"./CopyTextButton-BjdDstQ0.js";import"./useCopyToClipboard-Dh7Hxa4Z.js";import"./useMountedState-Dhu05aIm.js";import"./Tooltip-DG-AcMGe.js";import"./useObjectRef-CbQSD8dp.js";import"./useOverlayTriggerState-Dl82bCOM.js";import"./utils-BNWuCLNS.js";import"./useFocusRing-14fD-rIq.js";import"./openLink-_nIoHyS5.js";import"./number-DllxhX9c.js";import"./I18nProvider-CQNLYzfm.js";import"./useControlledState-CPQ03ATl.js";import"./animation-ChJpkI5_.js";import"./useHover-S-WcK3-g.js";import"./ButtonIcon-B3TYP0eD.js";import"./Button-ejIqj8kn.js";import"./Label-DU9qK1mL.js";import"./Hidden-CFw0S2EP.js";import"./useLabel-DOK2Qr8p.js";import"./useLabels-BYUTWxfw.js";import"./useButton-DMoQoLuK.js";import"./usePress-BTAge9_g.js";import"./textSelection-Dxc81R1_.js";import"./getMetaValue-BRyplxPo.js";import"./index-DRRrr8Fx.js";import"./LinkButton-BiEwFaYZ.js";import"./Button-DKkXzZEj.js";import"./CardHeader-C6roOad7.js";import"./Divider-4hCZ9_lh.js";import"./CardActions-BRci6J8S.js";import"./BottomLink-Cx_Vy1X5.js";import"./ArrowForward-CPvsnBcS.js";import"./Box-DUmu2mdv.js";import"./styled-BLvF1qNR.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
