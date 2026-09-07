import{bQ as e}from"./iframe-DFSHFeCl.js";import{C as t}from"./CodeSnippet-DUkFX_ZG.js";import{I as o}from"./InfoCard-C7ur5JOV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CvTLTj8i.js";import"./CardContent-DTwuD_bV.js";import"./ErrorBoundary-BWq0CPXP.js";import"./ErrorPanel-I4ydYmuK.js";import"./WarningPanel-C1OFhfXh.js";import"./ExpandMore-WfYxPS6i.js";import"./AccordionDetails-D884LsCP.js";import"./index-B9sM2jn7.js";import"./Collapse-BcnKE1Tb.js";import"./MarkdownContent-D4USfLFk.js";import"./makeStyles--EHfQ_qo.js";import"./Link-CSkeAaLf.js";import"./lodash-DdiVqFUi.js";import"./useAnalytics-CCyVhjtr.js";import"./useApp-DuAavzIK.js";import"./Grid-Dmi5E4PF.js";import"./List-DvEl071k.js";import"./ListContext-D7g9KH0X.js";import"./ListItem-C0wLdb_u.js";import"./ListItemText-D2-U7fBC.js";import"./CopyTextButton-7cFO3oZD.js";import"./useCopyToClipboard-nwS2Pz9F.js";import"./useMountedState-C2HKs-XF.js";import"./Tooltip-DuKf4Bde.js";import"./useObjectRef-5J7-CqHL.js";import"./useOverlayTriggerState-DzKGkFGl.js";import"./utils-Br_KD21J.js";import"./useFocusRing-DK7tnvLa.js";import"./openLink-BDUtlzhT.js";import"./number-UEiGF2v3.js";import"./I18nProvider-DTAG6ziA.js";import"./useControlledState-CqWOEZ5B.js";import"./animation-BdzC1IqV.js";import"./useHover-DTeONGMq.js";import"./ButtonIcon-rBps8sWw.js";import"./Button-CHnTR83Q.js";import"./Label-5UBRWhey.js";import"./Hidden-Dx45ZTjH.js";import"./useLabel-DvxVy_uj.js";import"./useLabels--neREfox.js";import"./useButton-RXc6MuTs.js";import"./usePress-D5mzPi8R.js";import"./textSelection-Bpfa-ycw.js";import"./index-BHTbnh3H.js";import"./LinkButton-pHT9VucY.js";import"./Button-x_q5FLiR.js";import"./CardHeader-D2IjQLXS.js";import"./Divider-Di2VtmCH.js";import"./CardActions-P6Tvo25J.js";import"./BottomLink-Bi8L4UWn.js";import"./ArrowForward-BImtGqIf.js";import"./Box-DvZz7Df4.js";import"./styled-fSpPvENu.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
