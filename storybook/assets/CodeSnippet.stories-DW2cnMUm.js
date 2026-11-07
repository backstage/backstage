import{j as e}from"./iframe-psIK5yLO.js";import{C as t}from"./CodeSnippet-DXcmFfDg.js";import{I as o}from"./InfoCard-DVF2XAHc.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DmDFDvYh.js";import"./CardContent-Gx2OjCpY.js";import"./ErrorBoundary-DTg-Mxtb.js";import"./ErrorPanel-C77gNZJI.js";import"./WarningPanel-BbmOJUMi.js";import"./ExpandMore-C7UmlSI-.js";import"./AccordionDetails-CqQf_glR.js";import"./index-B9sM2jn7.js";import"./Collapse-8SCsonqF.js";import"./MarkdownContent-CjzjczbN.js";import"./makeStyles-BO5raylp.js";import"./Link-CoeLOjL5.js";import"./lodash-DavWhvf8.js";import"./useAnalytics-DunOMgS-.js";import"./useApp-Dtg5HRbD.js";import"./Grid-CMGT3-M2.js";import"./List-CsoDoiW7.js";import"./ListContext-CW1RYZn6.js";import"./ListItem-CUlz7EaG.js";import"./ListItemText-Ohlq3yEc.js";import"./CopyTextButton-Be_Zq688.js";import"./useCopyToClipboard-Cx2KmM20.js";import"./useMountedState-JsdGtBh8.js";import"./Tooltip-CCeQ_uk9.js";import"./useObjectRef-JQhcLLWe.js";import"./useOverlayTriggerState-qoSrz_6x.js";import"./utils-CftV7EFJ.js";import"./useFocusRing-MLrPTLpZ.js";import"./openLink-CZeZ1U9d.js";import"./number-DZFckd1I.js";import"./I18nProvider-NMyyBc2c.js";import"./useControlledState-vYZGCggF.js";import"./animation-BSlcDtlM.js";import"./useHover-B93NGpPn.js";import"./ButtonIcon-DKFtXmkR.js";import"./Button-DCPejbPh.js";import"./Label-ChcPP0Iy.js";import"./Hidden-EyJpXoDf.js";import"./useLabel-C2F-sL7S.js";import"./useLabels-F6gridtO.js";import"./useButton-CXcOFXh4.js";import"./usePress-Bjjm_ouf.js";import"./textSelection-Df_eiIv9.js";import"./getMetaValue-Cq3cpixi.js";import"./index-Co8i19eP.js";import"./LinkButton-BGRUNKsc.js";import"./Button-Cxcr_IK2.js";import"./CardHeader-DqA3EHsu.js";import"./Divider-7jYIyKh_.js";import"./CardActions-DUb42x_P.js";import"./BottomLink-5ozkwl8d.js";import"./ArrowForward-B4afC3zM.js";import"./Box-R-XiqEG_.js";import"./styled-Bxm6pxZC.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
