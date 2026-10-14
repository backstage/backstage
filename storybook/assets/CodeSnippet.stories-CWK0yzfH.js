import{j as e}from"./iframe-osqb7I7f.js";import{C as t}from"./CodeSnippet-C8aH3ukT.js";import{I as o}from"./InfoCard-DGM0bo8f.js";import"./preload-helper-PPVm8Dsz.js";import"./index-EzFaxwLK.js";import"./CardContent-CDCYPRBv.js";import"./ErrorBoundary--_ZXXM_W.js";import"./ErrorPanel-uNRBiwbF.js";import"./WarningPanel-BVgSCT-q.js";import"./ExpandMore-B58VoRbx.js";import"./AccordionDetails-BEb85tr6.js";import"./index-B9sM2jn7.js";import"./Collapse-ByRTR707.js";import"./MarkdownContent-CSxCRSzF.js";import"./makeStyles-B-29AVkS.js";import"./Link-Bmt0jb7o.js";import"./lodash-CanoRRwR.js";import"./useAnalytics-tPbxjeba.js";import"./useApp-DYfjB2yk.js";import"./Grid-C2Kxiu2a.js";import"./List-CTyrNFUW.js";import"./ListContext-DC4QtHJ6.js";import"./ListItem-sSMaatws.js";import"./ListItemText-DovWF1mR.js";import"./CopyTextButton-lmz3qr7H.js";import"./useCopyToClipboard-qcdQ1MNk.js";import"./useMountedState-CQlD_3Nl.js";import"./Tooltip-DqfZ8k9F.js";import"./useObjectRef-BZCAlVk9.js";import"./useOverlayTriggerState-dYbDbyry.js";import"./utils-C6BeXBHQ.js";import"./useFocusRing-CQWExipe.js";import"./openLink-Dy9KSOrl.js";import"./number-RCfGZXCh.js";import"./I18nProvider-CsDtc1Vo.js";import"./useControlledState-DMCdQE-I.js";import"./animation-BsqcNdGe.js";import"./useHover-C6cSG5OI.js";import"./ButtonIcon-CB0cn2Eb.js";import"./Button-BIQxkz6R.js";import"./Label-Dc6bt0j8.js";import"./Hidden-BoP2pNUM.js";import"./useLabel-CwKyruxE.js";import"./useLabels-U9TV3Uv2.js";import"./useButton-BK3KpZgP.js";import"./usePress-Dn790MAk.js";import"./textSelection-jaE6bIEi.js";import"./getMetaValue-4uTB8c1-.js";import"./index-DwIBA9cq.js";import"./LinkButton-btp0Axh6.js";import"./Button-BTwk3FOG.js";import"./CardHeader-CkxqfNhS.js";import"./Divider-UAsCw4se.js";import"./CardActions-C_m_rWRo.js";import"./BottomLink-Bc-J6zH0.js";import"./ArrowForward-BsnrEbh5.js";import"./Box-BSaftFXH.js";import"./styled-xLLFXlcD.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
