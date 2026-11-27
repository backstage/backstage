import{j as e}from"./iframe-BLrGTSaW.js";import{C as t}from"./CodeSnippet-YD6y7umc.js";import{I as o}from"./InfoCard-CHACpNVw.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dp1J5c3v.js";import"./CardContent-SuRFy6QZ.js";import"./ErrorBoundary-b1SGZm1v.js";import"./ErrorPanel-COGKSxFN.js";import"./WarningPanel-DMN2jsxP.js";import"./ExpandMore-BuGI4WBo.js";import"./AccordionDetails-C8i5_inN.js";import"./index-B9sM2jn7.js";import"./Collapse-8iH-yJHO.js";import"./MarkdownContent-DWhqPdba.js";import"./makeStyles-vgIFYWcM.js";import"./Grid-njQ-TjUb.js";import"./List-DXjprzcI.js";import"./ListContext-zWPrJgIH.js";import"./ListItem-CqPT8Adv.js";import"./ListItemText-Bdj1tlwf.js";import"./CopyTextButton-CFLvRCX8.js";import"./useCopyToClipboard-Dwyq30yz.js";import"./useMountedState-DtifuCZ1.js";import"./Tooltip-guwHEmuy.js";import"./useObjectRef-ZSOSKmjG.js";import"./useOverlayTriggerState-BbSgKNtq.js";import"./utils-DY5RBqiV.js";import"./useFocusRing-BB9hpzXx.js";import"./number-y3IrGTZu.js";import"./I18nProvider-q6Gkr_5S.js";import"./useControlledState-DB6Fhmvl.js";import"./useTooltipTriggerState-CzFxnGQ-.js";import"./animation-BTuqI_dB.js";import"./useHover-SA74TXF1.js";import"./ButtonIcon-KOwfGuV9.js";import"./Button-DRJWcbqL.js";import"./Label-CubIRV2P.js";import"./Hidden-mL7bCk3G.js";import"./useLabel-CLI3Xr7r.js";import"./useLabels-CSSt0rmf.js";import"./useButton-DzeSStJg.js";import"./usePress-DBe51dZ5.js";import"./textSelection-DRK0jW1V.js";import"./getMetaValue-CAHBYg8p.js";import"./index-Csl_cXug.js";import"./LinkButton-BDZUrC6D.js";import"./Link-Lv4PpJLO.js";import"./lodash-DzUEr9HT.js";import"./useApp-CYEN5pYN.js";import"./index-CAEKkElr.js";import"./useAnalytics-BEvcg19j.js";import"./Button-BQ8DTl7J.js";import"./CardHeader-CH7M_pyb.js";import"./Divider-Bz-KunCn.js";import"./CardActions-Ddo3opRy.js";import"./BottomLink-BTcY1Ger.js";import"./ArrowForward-BRjD1hq6.js";import"./Box-Dre9Kf-d.js";import"./styled-C9flu1SF.js";const fe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
  </InfoCard>`,...m.parameters?.docs?.source}}};const he=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{m as CopyCode,i as Default,p as Languages,a as LineNumbers,s as MultipleLines,n as Overflow,he as __namedExportsOrder,fe as default};
