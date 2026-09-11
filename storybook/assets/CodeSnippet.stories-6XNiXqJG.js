import{bQ as e}from"./iframe-DgMUslzK.js";import{C as t}from"./CodeSnippet-IpMZSFLD.js";import{I as o}from"./InfoCard-CAf70LUl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CvMNCDS_.js";import"./CardContent-CDtX70Zb.js";import"./ErrorBoundary-BbyFu1wJ.js";import"./ErrorPanel-CG7MoIKd.js";import"./WarningPanel-DwBSOHRq.js";import"./ExpandMore-BUQTRYwG.js";import"./AccordionDetails-CGc0qdC8.js";import"./index-B9sM2jn7.js";import"./Collapse-BP8K-4gs.js";import"./MarkdownContent-CXy7dU3f.js";import"./makeStyles-Df7PmhVI.js";import"./Link-COy2ek7E.js";import"./lodash-C5szjeEy.js";import"./useAnalytics-BFdM291c.js";import"./useApp-KaRpWMSR.js";import"./Grid-aIkVCW8j.js";import"./List-C-zQfqUQ.js";import"./ListContext-hXedtGND.js";import"./ListItem-Bc79FKQe.js";import"./ListItemText-Bbi0SDLM.js";import"./CopyTextButton-CFPN3wxG.js";import"./useCopyToClipboard-Bbf4P5Ai.js";import"./useMountedState-C1sLF66g.js";import"./Tooltip-BLYW7H2X.js";import"./useObjectRef-XeGD6VQX.js";import"./useOverlayTriggerState-BQASwI2b.js";import"./utils-DhxbSGHl.js";import"./useFocusRing-B4qSrPyS.js";import"./openLink-CV_TcEkD.js";import"./number-BYuAoFwI.js";import"./I18nProvider-CGCG23Ya.js";import"./useControlledState-BXceL1Ef.js";import"./animation-CkKjJK8U.js";import"./useHover-D4699e1A.js";import"./ButtonIcon-CQGcwODg.js";import"./Button-Ce1GzKNk.js";import"./Label-RJPM6nLR.js";import"./Hidden-BAVkFQWw.js";import"./useLabel-Cp4A-_gp.js";import"./useLabels-B0EqUNWZ.js";import"./useButton-DTMzfS5e.js";import"./usePress-CnualNnF.js";import"./textSelection-XO3NdvnZ.js";import"./index-CQmiOcmz.js";import"./LinkButton-DrCyPL9q.js";import"./Button-3kKv2_eC.js";import"./CardHeader-yuQztdzz.js";import"./Divider-DGLYC4n9.js";import"./CardActions-DFqUdN4p.js";import"./BottomLink-CY6BX_Aw.js";import"./ArrowForward-BgNJuNWP.js";import"./Box-BJxowxBS.js";import"./styled-BfrhGEg9.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
