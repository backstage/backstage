import{bR as e}from"./iframe-BSg6SOip.js";import{C as t}from"./CodeSnippet-DW5XccKG.js";import{I as o}from"./InfoCard-DdnxxvDM.js";import"./preload-helper-PPVm8Dsz.js";import"./index-dK8gvQuo.js";import"./CardContent-BMIDIwI4.js";import"./ErrorBoundary-D8jNmpEW.js";import"./ErrorPanel-WMw6y118.js";import"./WarningPanel-DKs-5Vaa.js";import"./ExpandMore-8C4UjAYc.js";import"./AccordionDetails-CXyiCTvC.js";import"./index-B9sM2jn7.js";import"./Collapse-BJVCn04m.js";import"./MarkdownContent-CmLkBzxa.js";import"./makeStyles-eJb4jbID.js";import"./Link-DlJ370hJ.js";import"./lodash-D2GC-5Cr.js";import"./useAnalytics-BZjevC_t.js";import"./useApp-B5sJzxPh.js";import"./Grid-BN_wjj9Y.js";import"./List-KWBrKoXi.js";import"./ListContext-CyjS2JBq.js";import"./ListItem-B4NbXtSx.js";import"./ListItemText-D9MPLIxl.js";import"./CopyTextButton-DPkQ8KAp.js";import"./useCopyToClipboard-C_1CJVEc.js";import"./useMountedState-BpNNfauc.js";import"./Tooltip-YKPXWgKl.js";import"./useObjectRef-DBlAjOUP.js";import"./useOverlayTriggerState-BjxIi2GR.js";import"./utils-DeLUZGx2.js";import"./useFocusRing-DGKZUDqT.js";import"./openLink-DxYjWf7G.js";import"./number-iU0vIrtR.js";import"./I18nProvider-C5Ed87oL.js";import"./useControlledState-CaozfHK9.js";import"./animation-C65meOdJ.js";import"./useHover-BKKglU9f.js";import"./ButtonIcon-BZq12D5a.js";import"./Button-OzTainv7.js";import"./Label-Bsgi-8sx.js";import"./Hidden-4PpluWSp.js";import"./useLabel-xLEOMe10.js";import"./useLabels-C_VR0tdY.js";import"./useButton-BIeTy3DX.js";import"./usePress-DhUqF1zw.js";import"./textSelection-aDFvxn9c.js";import"./index-Dlj3HaWF.js";import"./LinkButton-CNZo4KeR.js";import"./Button-BPX2nYr-.js";import"./CardHeader-CReHfEmZ.js";import"./Divider-ChDphxmm.js";import"./CardActions-C-V6iS_D.js";import"./BottomLink-BkMOd6J6.js";import"./ArrowForward-D-LKWx37.js";import"./Box-DbXzz4Cf.js";import"./styled-DmIK-8cq.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
