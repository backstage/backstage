import{bQ as e}from"./iframe-wUGVZK80.js";import{C as t}from"./CodeSnippet-CJSpforj.js";import{I as o}from"./InfoCard-DfphftZz.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CGlIW_he.js";import"./CardContent-C7VkoQau.js";import"./ErrorBoundary-CXGg1cx4.js";import"./ErrorPanel-CMf-DS9w.js";import"./WarningPanel-Dfl2cZ4k.js";import"./ExpandMore-HnztnnpI.js";import"./AccordionDetails-DMgDUEr7.js";import"./index-B9sM2jn7.js";import"./Collapse-Cc1SHgxN.js";import"./MarkdownContent-DCzI_TJA.js";import"./makeStyles-Cw8l4FUa.js";import"./Link-Go23hbH8.js";import"./lodash-DyeR7AcE.js";import"./useAnalytics-Cx9_3Zxd.js";import"./useApp-YEoBNPcr.js";import"./Grid-B4FlnJ2g.js";import"./List-Ci0k_jrS.js";import"./ListContext-50b39xzR.js";import"./ListItem-DDigxjaw.js";import"./ListItemText-BucOZA4o.js";import"./CopyTextButton-kooOvTYQ.js";import"./useCopyToClipboard-Da3y2yaX.js";import"./useMountedState-CsruVelL.js";import"./Tooltip-CNr5I1VM.js";import"./useObjectRef-Cer6noLc.js";import"./useOverlayTriggerState-BMbSord3.js";import"./utils-mEgVZwEH.js";import"./useFocusRing-BC7vVkX4.js";import"./openLink-D6ixiiSG.js";import"./number-vyQ0g_EM.js";import"./I18nProvider-Ci8FoB4z.js";import"./useControlledState-BP7q2gJ8.js";import"./animation-CeCl3Lpx.js";import"./useHover-DRcNaDP5.js";import"./ButtonIcon-44wQ_emu.js";import"./Button-d6OZAENs.js";import"./Label-CZ0yGWTb.js";import"./Hidden-yseb-6tt.js";import"./useLabel-r6Cj49-v.js";import"./useLabels-CANwnRLq.js";import"./useButton-DkR_L0-r.js";import"./usePress-0P_K_iFV.js";import"./textSelection-C7djrXyy.js";import"./index-CxFlMd0n.js";import"./LinkButton-BfS6LATD.js";import"./Button-B95BEVva.js";import"./CardHeader-CCsxFUJX.js";import"./Divider-mp5Fqmk_.js";import"./CardActions-2yA0yX7F.js";import"./BottomLink-BBfAuJoh.js";import"./ArrowForward-BQJgjRx7.js";import"./Box-DE0sHIcK.js";import"./styled-BJSwmENK.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
