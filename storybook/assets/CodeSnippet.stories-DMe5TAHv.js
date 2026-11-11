import{j as e}from"./iframe-C7lYm63e.js";import{C as t}from"./CodeSnippet-D12vdhr-.js";import{I as o}from"./InfoCard--D6BbJdJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DRQcGEH_.js";import"./CardContent-CUZw5EW4.js";import"./ErrorBoundary-CUz3_QUX.js";import"./ErrorPanel-ulP0eNyU.js";import"./WarningPanel-DoV0Juvf.js";import"./ExpandMore-BlheU9Cw.js";import"./AccordionDetails-B6aFR-8U.js";import"./index-B9sM2jn7.js";import"./Collapse-DXEzvYJm.js";import"./MarkdownContent-DlTgNBDg.js";import"./makeStyles-CNdVE_9m.js";import"./Grid-Dx4lFWsU.js";import"./List--nqukECR.js";import"./ListContext-sxylWf-L.js";import"./ListItem-CPJiRmSN.js";import"./ListItemText-2jmGub62.js";import"./CopyTextButton-DKMB-Qhj.js";import"./useCopyToClipboard-DMQBGdJf.js";import"./useMountedState-Ci8ZHYTe.js";import"./Tooltip-BcqrA52i.js";import"./useObjectRef-aANnWHv4.js";import"./useOverlayTriggerState-BmV-E52M.js";import"./utils-BUzKzuKz.js";import"./useFocusRing-DBYmBdNX.js";import"./number-Ctxb0h4T.js";import"./I18nProvider-cMES1Ye-.js";import"./useControlledState-BNzUk4rc.js";import"./animation-DANnDqD6.js";import"./useHover-Dh_5CIee.js";import"./ButtonIcon-Ba0ONmbh.js";import"./Button-9cVhP8ym.js";import"./Label-BN9dytpW.js";import"./Hidden-C01qEBuY.js";import"./useLabel-CLnEY2ws.js";import"./useLabels-B_JIZiXA.js";import"./useButton-DYcDcyWL.js";import"./usePress-DfP9K6Oc.js";import"./textSelection-DvQ0zR-N.js";import"./getMetaValue-C1Arjnva.js";import"./index-YLMOL70x.js";import"./LinkButton-DH_LaefF.js";import"./Link-DKhx2tkV.js";import"./lodash-jlhHekdq.js";import"./useApp-Ds50W7L8.js";import"./index-FJv8Tr6k.js";import"./useAnalytics-QXmmoeIg.js";import"./Button-MDB6b_h5.js";import"./CardHeader-CNTPiHaH.js";import"./Divider-kHDmbGGk.js";import"./CardActions-C3Ej22lo.js";import"./BottomLink-8S7ZX6kW.js";import"./ArrowForward-D2VOGUix.js";import"./Box-DVl--OQ4.js";import"./styled-DFprPEWi.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
