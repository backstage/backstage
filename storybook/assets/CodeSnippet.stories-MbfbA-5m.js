import{j as e}from"./iframe-7FfCsjQc.js";import{C as t}from"./CodeSnippet-B1Tv83IK.js";import{I as o}from"./InfoCard-B946hmr0.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BdWgaOJu.js";import"./CardContent-BfAhwIdI.js";import"./ErrorBoundary-Brv-NM1i.js";import"./ErrorPanel-DbsyPFF1.js";import"./WarningPanel-KGG04xz-.js";import"./ExpandMore-D0mcfHZ6.js";import"./AccordionDetails-BQc_Nqep.js";import"./index-B9sM2jn7.js";import"./Collapse-CnCjcwDz.js";import"./MarkdownContent-BSWeQpuf.js";import"./makeStyles-fanaowPd.js";import"./Link-CR1IFN0P.js";import"./lodash-B-Q41laV.js";import"./useAnalytics-CMEgtwPm.js";import"./useApp-BEreIqLV.js";import"./Grid-4Dhxv3KP.js";import"./List-CifNXf4w.js";import"./ListContext-B5kCYP2n.js";import"./ListItem-D6qnPicY.js";import"./ListItemText-BDJNaQk2.js";import"./CopyTextButton-QQGU9L4l.js";import"./useCopyToClipboard-3tVIyyKA.js";import"./useMountedState-C1PGHi0r.js";import"./Tooltip-MpmPsIMR.js";import"./useObjectRef-CsTMWTDw.js";import"./useOverlayTriggerState-8g9hD9p5.js";import"./utils-DkNeRnP6.js";import"./useFocusRing-CHKTV0kp.js";import"./openLink-Ce5UoBQT.js";import"./number-DWRq-mjd.js";import"./I18nProvider-s8LwHCKO.js";import"./useControlledState-By3FW3bK.js";import"./animation-Drt1ngHL.js";import"./useHover-Br5T7sDg.js";import"./ButtonIcon-P8R9Bow_.js";import"./Button-nF4s0KaT.js";import"./Label-CfvtIL-W.js";import"./Hidden-DWfTAcXo.js";import"./useLabel-CcTyycKi.js";import"./useLabels-D-zjlwnt.js";import"./useButton-CTCTOTVx.js";import"./usePress-DKLyQD2V.js";import"./textSelection-D55lhVzK.js";import"./getMetaValue-DunJaaKa.js";import"./index-BXkdWngf.js";import"./LinkButton-p4Qq45de.js";import"./Button-EMNjW8nd.js";import"./CardHeader-CTNo4TOW.js";import"./Divider-Agfz3MBu.js";import"./CardActions-sjGdLSD2.js";import"./BottomLink-BbdlNIzH.js";import"./ArrowForward-DkTMLGEZ.js";import"./Box-w0QrgRGB.js";import"./styled-DKVMqnor.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
