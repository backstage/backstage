import{j as e,d as o}from"./iframe-hvh2aMf9.js";import{W as n}from"./WarningPanel-CJ_nUs4N.js";import{L as i}from"./Link-CHVET8I2.js";import{B as p}from"./Button-DCfJTuUb.js";import"./preload-helper-D9Z9MdNV.js";import"./ExpandMore-nelLsYHb.js";import"./AccordionDetails-DLZ6dsCT.js";import"./index-DnL3XN75.js";import"./Collapse-PeWKU6hc.js";import"./MarkdownContent-DCK-3Ric.js";import"./CodeSnippet-5nQo7gNl.js";import"./Box-BjIjXY28.js";import"./styled-CsVOCgfV.js";import"./CopyTextButton-FOvJ_Vam.js";import"./useCopyToClipboard-D9VM6fel.js";import"./useMountedState-CuwT9qKs.js";import"./Tooltip-Y5wSFqY4.js";import"./Popper-CHxzJWK6.js";import"./Portal-Bb9zcDOK.js";import"./Grid-DbJ44Ewx.js";import"./lodash-CwBbdt2Q.js";import"./index-7QU1_rFp.js";import"./useAnalytics-CVphDHTH.js";import"./useApp-CqXr_4Cz.js";const M={title:"Feedback/Warning Panel",component:n},s=()=>e.jsx(n,{title:"Entity missing annotation",message:e.jsxs(e.Fragment,{children:["This example entity is missing an annotation. If this is unexpected, please make sure you have set up everything correctly by following"," ",e.jsx(i,{to:"http://example.com",children:"this guide"}),"."]})}),t=()=>e.jsxs(n,{title:"Could not contact backend system",children:[e.jsxs(o,{children:["Supports custom children - for example these text elements. This can be used to hide/expose stack traces for warnings, like this example:",e.jsx("br",{}),"SyntaxError: Error transforming /home/user/github/backstage/packages/core-components/src/components/WarningPanel/WarningPanel.stories.tsx: Unexpected token (42:16) at unexpected (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/util.js:83:15) at tsParseMaybeAssignWithJSX (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1399:22) at tsParseMaybeAssign (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1373:12) at parseMaybeAssign (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:118:43) at parseExprListItem (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:969:5)"]}),e.jsx(p,{variant:"contained",children:"Learn More"})]}),r=()=>e.jsx(n,{title:"Could not contact backend system",message:"The backend system failed to respond. It is possible the service is down; please try again in a few minutes.",children:"HTTP 500 Bad Gateway response from https://usefulservice.mycompany.com/api/entity?44433"}),a=()=>e.jsx(n,{title:"Could not load data."});s.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"Children"};r.__docgenInfo={description:"",methods:[],displayName:"FullExample"};a.__docgenInfo={description:"",methods:[],displayName:"TitleOnly"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <WarningPanel title="Entity missing annotation" message={<>
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
