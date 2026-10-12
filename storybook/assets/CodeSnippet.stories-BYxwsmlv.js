import{j as e}from"./iframe-D5t0zV2Z.js";import{C as t}from"./CodeSnippet-Batl0Py4.js";import{I as o}from"./InfoCard-BaBe9ypk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BpFgTxyY.js";import"./CardContent-PIBUV3o-.js";import"./ErrorBoundary-3xY_W0yP.js";import"./ErrorPanel-CNSs2ZGd.js";import"./WarningPanel-DtoFS_C_.js";import"./ExpandMore-Cysl7Wnp.js";import"./AccordionDetails-B_jQxHeL.js";import"./index-B9sM2jn7.js";import"./Collapse-CVJ-cdWY.js";import"./MarkdownContent-IUJYAmjf.js";import"./makeStyles-C7L4K4uU.js";import"./Link-HVvnTl0w.js";import"./lodash-DUCm7Gp4.js";import"./useAnalytics-BxfmAkrD.js";import"./useApp-CSht05na.js";import"./Grid-i35IH7WF.js";import"./List-Ce0b0pZR.js";import"./ListContext-_YXk3x9k.js";import"./ListItem-_yy6hJX-.js";import"./ListItemText-C0xxtZwN.js";import"./CopyTextButton-CjdGmc-p.js";import"./useCopyToClipboard-CmN_LNR4.js";import"./useMountedState-CfWlui47.js";import"./Tooltip-BqXTcCpb.js";import"./useObjectRef-kGsiECgS.js";import"./useOverlayTriggerState-D9dRXQwO.js";import"./utils-C39--9xx.js";import"./useFocusRing-vtWZMyzl.js";import"./openLink-DJ_oJLh5.js";import"./number-DtQkEWx4.js";import"./I18nProvider-CnCaeKRg.js";import"./useControlledState-CWsOmoBN.js";import"./animation-COaRnszU.js";import"./useHover-CMgWw-jG.js";import"./ButtonIcon-B0ovJWIw.js";import"./Button-DnnkrgV8.js";import"./Label-DaItaSZn.js";import"./Hidden-Dsa08sWj.js";import"./useLabel-32i4SIb0.js";import"./useLabels-D8GfqFut.js";import"./useButton-DdkvoT6L.js";import"./usePress-Dmt7pnzP.js";import"./textSelection-FMDS3d8l.js";import"./getMetaValue-lPtVOvv4.js";import"./index-DvEtjejY.js";import"./LinkButton-CACDb8D2.js";import"./Button-fxkQkftD.js";import"./CardHeader-C0coa59q.js";import"./Divider-DjHAkBtb.js";import"./CardActions-CQEhjRVR.js";import"./BottomLink-B6UFd3BE.js";import"./ArrowForward-BQSNYA7q.js";import"./Box-DF_678xD.js";import"./styled-J0WIBf2g.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
