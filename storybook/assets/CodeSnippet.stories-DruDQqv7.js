import{j as e}from"./iframe-Q4ctuRUv.js";import{C as t}from"./CodeSnippet-BgZLWOOx.js";import{I as o}from"./InfoCard-C_gn0D9e.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cnxeo_nc.js";import"./CardContent-EmXczoGm.js";import"./ErrorBoundary-B27y4n0f.js";import"./ErrorPanel-DR3m6DTl.js";import"./WarningPanel-DwHItehq.js";import"./ExpandMore-Dr2Ma9MR.js";import"./AccordionDetails-BV7hnhu5.js";import"./index-B9sM2jn7.js";import"./Collapse-Bd9PdCmJ.js";import"./MarkdownContent-gf_ontoF.js";import"./makeStyles-8oAJJB3q.js";import"./Grid-DcmUA9RW.js";import"./List-Duxw_2f-.js";import"./ListContext-CfWdnzwf.js";import"./ListItem-CXSBZTxW.js";import"./ListItemText-DnESw4AE.js";import"./CopyTextButton-XoBtjHXy.js";import"./useCopyToClipboard-Cd7gIejP.js";import"./useMountedState-DgPKhx6Y.js";import"./Tooltip-BbHBDYER.js";import"./useObjectRef-BFzgzp46.js";import"./useOverlayTriggerState-DcH1p3io.js";import"./utils-CTbYSeHd.js";import"./useFocusRing-DiENv1rk.js";import"./openLink-qs0UDoSy.js";import"./number-BhqHD8kO.js";import"./I18nProvider-Bsf8nutC.js";import"./useControlledState-CGLHX-Pe.js";import"./animation-Dqeq4_Vx.js";import"./useHover-B_-Qawkz.js";import"./ButtonIcon-CANv9WbN.js";import"./Button-j0bKjTfS.js";import"./Label-BJe5bXQU.js";import"./Hidden-BhGBloyx.js";import"./useLabel-UNvbR8sI.js";import"./useLabels-BPBTzwbg.js";import"./useButton-DgX1muWK.js";import"./usePress-Dnu9apiz.js";import"./textSelection-DMfLw1Y1.js";import"./getMetaValue-CITejevD.js";import"./index-B2PZBeFt.js";import"./LinkButton-CIZdp6K1.js";import"./Link-VoSzpIdj.js";import"./lodash-jLyg5rJ1.js";import"./useAnalytics-DuXqog2R.js";import"./useApp-DQVv0gHI.js";import"./Button-CMJ_jpKh.js";import"./CardHeader-BmgUoj1V.js";import"./Divider-Ccs22sxQ.js";import"./CardActions-DgTgFvqH.js";import"./BottomLink-Cx6Rp4Qg.js";import"./ArrowForward-MM2q06VO.js";import"./Box-CI4CWvmp.js";import"./styled-CRG88ni7.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
