import{j as e}from"./iframe-T196ztmH.js";import{C as t}from"./CodeSnippet-U9qw4ckE.js";import{I as o}from"./InfoCard-C3Jci5tY.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CHb-0WlO.js";import"./CardContent-PS5J1IKY.js";import"./ErrorBoundary-D9BLRWQY.js";import"./ErrorPanel-DWaS0ZBO.js";import"./WarningPanel-Css5OhBO.js";import"./ExpandMore-nDb0_CUc.js";import"./AccordionDetails-CI3aIhTi.js";import"./index-B9sM2jn7.js";import"./Collapse-DCAKfow3.js";import"./MarkdownContent-Bvn4luNB.js";import"./makeStyles-wXls5oBk.js";import"./Grid-tsQx5ZlT.js";import"./List-uBQ_jjoq.js";import"./ListContext-C26h6ShK.js";import"./ListItem-C46GhWUf.js";import"./ListItemText-BKGelt8m.js";import"./CopyTextButton-DkFPXC7w.js";import"./useCopyToClipboard-DHFE9qEU.js";import"./useMountedState-Csk1KXf2.js";import"./Tooltip-giAPcCGO.js";import"./useObjectRef-_dSsW1Fk.js";import"./useOverlayTriggerState-D9Xb0gJN.js";import"./utils-zm3gdQCr.js";import"./useFocusRing-DNtHiErB.js";import"./number-0emrtaiX.js";import"./I18nProvider-DNS4_F5r.js";import"./useControlledState-DuQaVgle.js";import"./animation-CpmNWIfH.js";import"./useHover-7-pgp0Ky.js";import"./ButtonIcon-r0XYIMXr.js";import"./Button-CrpaGjWm.js";import"./Label-sNbExByb.js";import"./Hidden-BBV6Ld8l.js";import"./useLabel-BnuV1o8f.js";import"./useLabels-Cvihbbwm.js";import"./useButton-vSodW6MB.js";import"./usePress-C69aPbO8.js";import"./textSelection-BG3cATkn.js";import"./getMetaValue-DwQluMyN.js";import"./index-WrKC2aIj.js";import"./LinkButton-BbAXZscA.js";import"./Link-CM7hnzwh.js";import"./lodash-CKeCnM0L.js";import"./useApp-BYWpjzsK.js";import"./index-DQMgTQ6t.js";import"./useAnalytics-hRuUiONW.js";import"./Button-Bg7hei9L.js";import"./CardHeader-BM2LurZ0.js";import"./Divider-C7Oe7uel.js";import"./CardActions-ztjGgc2e.js";import"./BottomLink-CUs6iEAP.js";import"./ArrowForward-BoTv7wjr.js";import"./Box-D0Hsb4cf.js";import"./styled-D8t9NQsp.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
