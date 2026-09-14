import{bQ as e}from"./iframe-C1Du46eF.js";import{C as t}from"./CodeSnippet-DhHZhmcj.js";import{I as o}from"./InfoCard-eWXfDyse.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CMoliSBC.js";import"./CardContent-Oov0vYyj.js";import"./ErrorBoundary-akMjG2qg.js";import"./ErrorPanel-BTpb21PM.js";import"./WarningPanel-DXHtQ2IX.js";import"./ExpandMore-BWuE-7hQ.js";import"./AccordionDetails-CSzlYiZ9.js";import"./index-B9sM2jn7.js";import"./Collapse-BcGM4pdS.js";import"./MarkdownContent-GsgyxCqe.js";import"./makeStyles-tNrkWhA3.js";import"./Link-BV4tUmIi.js";import"./lodash-Dvbzgryf.js";import"./useAnalytics-C9i1P1xg.js";import"./useApp-O4d2mQzz.js";import"./Grid-DNU8Z8x6.js";import"./List-BNs0QNsL.js";import"./ListContext-D4W1XVLG.js";import"./ListItem-CdzCtbN9.js";import"./ListItemText-Ml-aOV6O.js";import"./CopyTextButton-DV_-9GPA.js";import"./useCopyToClipboard-B8foAEFP.js";import"./useMountedState-DkfAqiXU.js";import"./Tooltip-CbbOey0w.js";import"./useObjectRef-DOq-huoO.js";import"./useOverlayTriggerState-MXUE1IGe.js";import"./utils-hkspyz06.js";import"./useFocusRing-C0uj4VUP.js";import"./openLink-CByF1g0c.js";import"./number-DRYzdm3i.js";import"./I18nProvider-B27jmHNy.js";import"./useControlledState-BHe0N0Aq.js";import"./animation-Cp8UTTIv.js";import"./useHover-CFEPcSqQ.js";import"./ButtonIcon-CDLdhfta.js";import"./Button-kKzp0Xb2.js";import"./Label-CPEk2ZbI.js";import"./Hidden-BsQwcHXl.js";import"./useLabel-C8HhkV7I.js";import"./useLabels-CQnXJWhI.js";import"./useButton-DUAO8AkZ.js";import"./usePress-CiBw4CLk.js";import"./textSelection-DIl4JRXM.js";import"./index-C0MspUWn.js";import"./LinkButton-D2lZXhRZ.js";import"./Button-CaEZTTUC.js";import"./CardHeader-DDgQcYlK.js";import"./Divider-DaXw5YH4.js";import"./CardActions-CDsW0wUk.js";import"./BottomLink-IDXXKBVm.js";import"./ArrowForward-v-LHFKXb.js";import"./Box-ClfRlZ9E.js";import"./styled-CZd-VRab.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
