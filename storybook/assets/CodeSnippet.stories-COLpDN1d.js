import{j as e}from"./iframe-bgo7e1e-.js";import{C as t}from"./CodeSnippet-DeZGo3NR.js";import{I as o}from"./InfoCard-DBXngkq9.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D2QNSMaZ.js";import"./CardContent-CnbH0hOq.js";import"./ErrorBoundary-CDmivM45.js";import"./ErrorPanel-DKsFbCzx.js";import"./WarningPanel-A9_nMAfH.js";import"./ExpandMore-DMi4E4qK.js";import"./AccordionDetails-K3zL_z0F.js";import"./index-B9sM2jn7.js";import"./Collapse-BtIJITth.js";import"./MarkdownContent-Mz3gRmWj.js";import"./makeStyles-DoaRxWiQ.js";import"./Link-BuK2DZMN.js";import"./lodash-0Uigzlnj.js";import"./useAnalytics-7LMFMwsI.js";import"./useApp-DNALaMPe.js";import"./Grid-T6mBOXNr.js";import"./List-BMiwvO_T.js";import"./ListContext-C2MdW-s7.js";import"./ListItem-DenzP3x1.js";import"./ListItemText-D-uW3shL.js";import"./CopyTextButton-CxwV3EFK.js";import"./useCopyToClipboard-BXOsXiGg.js";import"./useMountedState-CuAJuRmG.js";import"./Tooltip-D_0Yqn9j.js";import"./useObjectRef-CabhlhRH.js";import"./useOverlayTriggerState-BqjmD4iR.js";import"./utils-JzHJCY_V.js";import"./useFocusRing-DOOJwv5m.js";import"./openLink-CoSKtbHP.js";import"./number-Du54yJ_D.js";import"./I18nProvider-8UDR-sqk.js";import"./useControlledState-D401CQPw.js";import"./animation-BxLvfosO.js";import"./useHover-C9083PQk.js";import"./ButtonIcon-DXmg7yM2.js";import"./Button-BsHltkoL.js";import"./Label-CxmmfCmf.js";import"./Hidden-DUW6jk9t.js";import"./useLabel--gwqzVgP.js";import"./useLabels-Bim8pLbU.js";import"./useButton-DHRbxGTd.js";import"./usePress-CGAKik1n.js";import"./textSelection-LFcdZiJl.js";import"./getMetaValue-BiI45Giv.js";import"./index-BgwxsXea.js";import"./LinkButton-DjCakYUw.js";import"./Button-BpgAAUYX.js";import"./CardHeader-NFqQGG1M.js";import"./Divider-DkajqoN4.js";import"./CardActions-CzoX1plE.js";import"./BottomLink-TOtNpJdB.js";import"./ArrowForward-Db5PrIvT.js";import"./Box-DGsFNqvi.js";import"./styled-D89UzqIM.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
