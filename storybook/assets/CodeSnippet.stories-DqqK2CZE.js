import{j as e}from"./iframe-BteMx7zj.js";import{C as t}from"./CodeSnippet-j4NpQLPu.js";import{I as o}from"./InfoCard-BxPn0sC3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bgp4cglI.js";import"./CardContent-CQGGl7On.js";import"./ErrorBoundary-CHwhC-OP.js";import"./ErrorPanel-gYSSuqn2.js";import"./WarningPanel-PFKymQsA.js";import"./ExpandMore-CLriPX-N.js";import"./AccordionDetails-cmey2Utz.js";import"./index-B9sM2jn7.js";import"./Collapse-7fl1HXkq.js";import"./MarkdownContent-Cc7ZmKdx.js";import"./makeStyles-DGUes2su.js";import"./Link-DkdOcJD_.js";import"./lodash-DsduVVuc.js";import"./useAnalytics-CzrCeQK4.js";import"./useApp-CQY1dbvI.js";import"./Grid-D5ZyNHnh.js";import"./List-B42bmojS.js";import"./ListContext-C3evAAl8.js";import"./ListItem-DaGBUtFz.js";import"./ListItemText-9BhXH5Ta.js";import"./CopyTextButton-BBPy9XyY.js";import"./useCopyToClipboard-CzCPJLic.js";import"./useMountedState-CHelMk4j.js";import"./Tooltip-KfFi-nNX.js";import"./useObjectRef-Dv9hKxnj.js";import"./useOverlayTriggerState-jQQVBlrg.js";import"./utils-Csf2qqlx.js";import"./useFocusRing-Yxf_B4Dt.js";import"./openLink-8VSUUPMi.js";import"./number-B2HcLMyw.js";import"./I18nProvider-D7X1BqX1.js";import"./useControlledState-B_XVpnvb.js";import"./animation-HCfLZl62.js";import"./useHover-ZUHUyvdU.js";import"./ButtonIcon-BMdh_09p.js";import"./Button-DbBRcBsa.js";import"./Label-BS5nCX70.js";import"./Hidden-DJWYjR2p.js";import"./useLabel-CNCzQYRH.js";import"./useLabels-DAYEkzeR.js";import"./useButton-B0unMpfY.js";import"./usePress-Cuj1vnv1.js";import"./textSelection-pyBJCDu1.js";import"./getMetaValue-CM24UgTH.js";import"./index-Dfq8zbsI.js";import"./LinkButton-tbbRQSYJ.js";import"./Button-BVUf1Ne7.js";import"./CardHeader-Cf9V8ZTq.js";import"./Divider-DGB92JHx.js";import"./CardActions-HMA-HW2A.js";import"./BottomLink-BcS7q2Pj.js";import"./ArrowForward-DDv3MuiF.js";import"./Box-DCV742gE.js";import"./styled-DB7WYmRd.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
