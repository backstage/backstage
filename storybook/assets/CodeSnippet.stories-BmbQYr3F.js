import{j as e}from"./iframe-S5OJNhaE.js";import{C as t}from"./CodeSnippet-1ebhFtOF.js";import{I as o}from"./InfoCard-cDPz8qlT.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DWYBXtX6.js";import"./CardContent-Bf5Sx_Uy.js";import"./ErrorBoundary-DaghfqCZ.js";import"./ErrorPanel-DCdgLj-2.js";import"./WarningPanel-D9u8_8HV.js";import"./ExpandMore-CGf1XY_q.js";import"./AccordionDetails-BpzEffNr.js";import"./index-B9sM2jn7.js";import"./Collapse-BaPNDIaS.js";import"./MarkdownContent-BuRsAd7C.js";import"./makeStyles-D0gbbC8R.js";import"./Link-CBQOxjrI.js";import"./lodash-eKDtcgkj.js";import"./useAnalytics-a2pKeP17.js";import"./useApp-DxGdeyks.js";import"./Grid-DjboKT5l.js";import"./List-DoT7Ftgb.js";import"./ListContext-DOVL_hFP.js";import"./ListItem-DgGNurAj.js";import"./ListItemText-BABNhi8i.js";import"./CopyTextButton-BvKVUL2b.js";import"./useCopyToClipboard-B5eLvTIH.js";import"./useMountedState-BxmbnEIC.js";import"./Tooltip-CkWomL7j.js";import"./useObjectRef-Ce7Pg0IE.js";import"./useOverlayTriggerState-C-PPUK0B.js";import"./utils-Bf43CEqe.js";import"./useFocusRing-DrNn4w0v.js";import"./openLink-gCGEI6Hl.js";import"./number-DPETitzY.js";import"./I18nProvider-B9PKsfTQ.js";import"./useControlledState-sjWVeRbh.js";import"./animation-D5KQd_1z.js";import"./useHover-DRBklp1Y.js";import"./ButtonIcon-Chc3svF-.js";import"./Button-C2Hm-9-t.js";import"./Label-Dm19jsZB.js";import"./Hidden-bbdHFmyf.js";import"./useLabel-D6KUrPXz.js";import"./useLabels-lt4DDiFl.js";import"./useButton-ZsuQVD8S.js";import"./usePress-BKUcGSaX.js";import"./textSelection-C5XFxsbn.js";import"./getMetaValue-DfvZTkcg.js";import"./index-BC5M37nw.js";import"./LinkButton-BWt_dn38.js";import"./Button-BMip90M3.js";import"./CardHeader-CRB0Mu5L.js";import"./Divider-KuOpsNRp.js";import"./CardActions-zE3QrgUv.js";import"./BottomLink-C3zQxDLT.js";import"./ArrowForward-BqeeTjTx.js";import"./Box-CLnYDjy1.js";import"./styled-V22BojXI.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
