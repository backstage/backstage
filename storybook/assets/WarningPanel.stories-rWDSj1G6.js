import{j as e,d as o}from"./iframe-BuVoE93N.js";import{W as n}from"./WarningPanel-Bli1S96p.js";import{L as i}from"./Link-2efb-DF8.js";import{B as p}from"./Button-DitSkek8.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DhETGfMT.js";import"./AccordionDetails-hMDXQ06y.js";import"./index-B9sM2jn7.js";import"./Collapse-1RctBr9q.js";import"./MarkdownContent-Bml6DDvX.js";import"./CodeSnippet-Djqp3Beh.js";import"./Box-EG9f0Y8u.js";import"./styled-GwDWktgy.js";import"./CopyTextButton-DpoFWtPj.js";import"./useCopyToClipboard-B1o0Tb_t.js";import"./useMountedState-CTJrFvSG.js";import"./Tooltip-DeALkc8i.js";import"./Popper-CiIf8Skg.js";import"./Portal-C8Go-sfs.js";import"./Grid-BS_RmjCI.js";import"./lodash-Y_-RFQgK.js";import"./index-CLOs8FQP.js";import"./useAnalytics-CGq4Uj37.js";import"./useApp-CzP5PYac.js";const M={title:"Feedback/Warning Panel",component:n},s=()=>e.jsx(n,{title:"Entity missing annotation",message:e.jsxs(e.Fragment,{children:["This example entity is missing an annotation. If this is unexpected, please make sure you have set up everything correctly by following"," ",e.jsx(i,{to:"http://example.com",children:"this guide"}),"."]})}),t=()=>e.jsxs(n,{title:"Could not contact backend system",children:[e.jsxs(o,{children:["Supports custom children - for example these text elements. This can be used to hide/expose stack traces for warnings, like this example:",e.jsx("br",{}),"SyntaxError: Error transforming /home/user/github/backstage/packages/core-components/src/components/WarningPanel/WarningPanel.stories.tsx: Unexpected token (42:16) at unexpected (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/util.js:83:15) at tsParseMaybeAssignWithJSX (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1399:22) at tsParseMaybeAssign (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1373:12) at parseMaybeAssign (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:118:43) at parseExprListItem (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:969:5)"]}),e.jsx(p,{variant:"contained",children:"Learn More"})]}),r=()=>e.jsx(n,{title:"Could not contact backend system",message:"The backend system failed to respond. It is possible the service is down; please try again in a few minutes.",children:"HTTP 500 Bad Gateway response from https://usefulservice.mycompany.com/api/entity?44433"}),a=()=>e.jsx(n,{title:"Could not load data."});s.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"Children"};r.__docgenInfo={description:"",methods:[],displayName:"FullExample"};a.__docgenInfo={description:"",methods:[],displayName:"TitleOnly"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <WarningPanel title="Entity missing annotation" message={<>
        This example entity is missing an annotation. If this is unexpected,
        please make sure you have set up everything correctly by following{' '}
        <Link to="http://example.com">this guide</Link>.
      </>} />`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => <WarningPanel title="Could not contact backend system">
    <Typography>
      Supports custom children - for example these text elements. This can be
      used to hide/expose stack traces for warnings, like this example:
      <br />
      SyntaxError: Error transforming
      /home/user/github/backstage/packages/core-components/src/components/WarningPanel/WarningPanel.stories.tsx:
      Unexpected token (42:16) at unexpected
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/util.js:83:15)
      at tsParseMaybeAssignWithJSX
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1399:22)
      at tsParseMaybeAssign
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1373:12)
      at parseMaybeAssign
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:118:43)
      at parseExprListItem
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:969:5)
    </Typography>
    <Button variant="contained">Learn More</Button>
  </WarningPanel>`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => <WarningPanel title="Could not contact backend system" message="The backend system failed to respond. It is possible the service is down; please try again in a few minutes.">
    HTTP 500 Bad Gateway response from
    https://usefulservice.mycompany.com/api/entity?44433
  </WarningPanel>`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:'() => <WarningPanel title="Could not load data." />',...a.parameters?.docs?.source}}};const A=["Default","Children","FullExample","TitleOnly"];export{t as Children,s as Default,r as FullExample,a as TitleOnly,A as __namedExportsOrder,M as default};
