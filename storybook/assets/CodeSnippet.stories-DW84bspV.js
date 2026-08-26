import{bQ as e}from"./iframe-Zd-YI-2K.js";import{C as t}from"./CodeSnippet-BzBoveFT.js";import{I as o}from"./InfoCard-455Xysee.js";import"./preload-helper-PPVm8Dsz.js";import"./index-3zt1A_J2.js";import"./CardContent-DTP7M8AX.js";import"./ErrorBoundary-DQsaSCXb.js";import"./ErrorPanel-BKXaECNY.js";import"./WarningPanel-CnW_Ob0u.js";import"./ExpandMore-CzU3E1pb.js";import"./AccordionDetails-DtjUON2K.js";import"./index-B9sM2jn7.js";import"./Collapse-0UjtbnVD.js";import"./MarkdownContent-DBrdpxT4.js";import"./makeStyles-Bs9jLpYU.js";import"./Link-B1-7jmla.js";import"./lodash-qTrB2OqT.js";import"./useAnalytics-Dh88aAVh.js";import"./useApp-DB_FflUZ.js";import"./Grid-B5pNkdLG.js";import"./List-DUT6hMb6.js";import"./ListContext-C7VyENNE.js";import"./ListItem-CnCwlIuh.js";import"./ListItemText-CRo3TDEO.js";import"./CopyTextButton-CpR8fSbV.js";import"./useCopyToClipboard-n6dvNEJd.js";import"./useMountedState-CliImA98.js";import"./Tooltip-CfbQy97v.js";import"./useObjectRef-CSGev21E.js";import"./useOverlayTriggerState-B-jymaAe.js";import"./utils-B9HGNt0C.js";import"./useFocusRing-B2ToGNzb.js";import"./openLink-Bn8ArFiV.js";import"./number-DiAqIE8i.js";import"./I18nProvider-BhAOc9Ga.js";import"./useControlledState-DInYdsj6.js";import"./animation-BuTCjKPk.js";import"./useHover-BUmLyoKK.js";import"./ButtonIcon-8KnJDrRQ.js";import"./Button-BPK5A0ph.js";import"./Label-YhzAN0Eo.js";import"./Hidden-5-RKz3aG.js";import"./useLabel-CKKQW7cE.js";import"./useLabels-Qd-JAFm0.js";import"./useButton-BzU-QnhQ.js";import"./usePress-B_YcD4zB.js";import"./textSelection-P_IOG6mD.js";import"./index-CirsuCpW.js";import"./LinkButton-DXHqJ0JA.js";import"./Button-Bn38L6wT.js";import"./CardHeader-slh0YyJq.js";import"./Divider-QO7jX09J.js";import"./CardActions-Ck4xRT0s.js";import"./BottomLink-CRB9Ob2t.js";import"./ArrowForward-HIc9NWdY.js";import"./Box-DGJn4Sz7.js";import"./styled-DxJJRGJP.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
