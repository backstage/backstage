import{j as e}from"./iframe-5xJVwFMl.js";import{C as t}from"./CodeSnippet-BZWkQwyH.js";import{I as o}from"./InfoCard-C_a4OjGS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Czerfnq4.js";import"./CardContent-YOnz6Jxe.js";import"./ErrorBoundary-CO045YjM.js";import"./ErrorPanel-CI5sriXk.js";import"./WarningPanel-ktz3ilhl.js";import"./ExpandMore-sg4o7ily.js";import"./AccordionDetails-CZoVaorG.js";import"./index-B9sM2jn7.js";import"./Collapse-DMPyoC4e.js";import"./MarkdownContent-C2xC5kkZ.js";import"./makeStyles-C6RKmEA9.js";import"./Link-nmwsyCsZ.js";import"./lodash-D_xO2xdO.js";import"./useAnalytics-wJCsvL7f.js";import"./useApp-CVTpPQ-8.js";import"./Grid-BGkHqCZb.js";import"./List-DbnZjmoN.js";import"./ListContext-0INxBid3.js";import"./ListItem-RgFWmdu3.js";import"./ListItemText-Dbv5pojD.js";import"./CopyTextButton-DkHZP1T5.js";import"./useCopyToClipboard-3gOgeNuG.js";import"./useMountedState-DsFokrm4.js";import"./Tooltip-B0IbZ4cB.js";import"./useObjectRef-COysk4Ng.js";import"./useOverlayTriggerState-D-pWsPKw.js";import"./utils-g1c0Kr3k.js";import"./useFocusRing-CL8Atm-X.js";import"./openLink-CN5IUfel.js";import"./number-Dp3Tfxh5.js";import"./I18nProvider-CF59bDP3.js";import"./useControlledState-DeUghDUN.js";import"./animation-DqGFbVcO.js";import"./useHover-0u_T0iEc.js";import"./ButtonIcon-Bmmodoee.js";import"./Button-B_04NqPW.js";import"./Label-xTQOkMYl.js";import"./Hidden-BbW38WTn.js";import"./useLabel-DMuCEq2v.js";import"./useLabels-ClOBW_ex.js";import"./useButton-aPTu4J1u.js";import"./usePress-Cd47Wv9a.js";import"./textSelection-TIBZk0b6.js";import"./getMetaValue-CQBj6zNl.js";import"./index-W19nKV8Q.js";import"./LinkButton-BxkbruSs.js";import"./Button-P3pbETDE.js";import"./CardHeader-D2USsff9.js";import"./Divider-Bl2mUSW_.js";import"./CardActions-XvdJDdlu.js";import"./BottomLink-DAZwdixr.js";import"./ArrowForward-C2ZVnRSx.js";import"./Box-qXNKoQfM.js";import"./styled-DY-6LqDt.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
