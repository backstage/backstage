import{bR as e}from"./iframe-CHEWuc0v.js";import{H as o}from"./Header-DemjgPtm.js";import{P as p}from"./Page-BRtxKQbJ.js";import{H as r}from"./HeaderLabel-DArEWrkn.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Buq0T23N.js";import"./Box-CA5r6KPw.js";import"./styled-B0xaf2Nd.js";import"./Grid-DIzjM6gG.js";import"./makeStyles-CcHkTlxf.js";import"./Breadcrumbs-BmH0wRDx.js";import"./index-B9sM2jn7.js";import"./Popover-D1Qvnejf.js";import"./Modal-BrlKAJmB.js";import"./Portal-CXDFFVA9.js";import"./List-Htl-iPuO.js";import"./ListContext-Db_fj7kn.js";import"./ListItem-Djh9MDE8.js";import"./Link-DiivKN7j.js";import"./index-D8aRAqEX.js";import"./lodash-WdvZzfTd.js";import"./useAnalytics-BWLaGjRK.js";import"./useApp-ezEKjyT8.js";import"./Page-COP2zd30.js";import"./useMediaQuery-QlczwV2o.js";import"./Tooltip-D_wlfMrX.js";import"./Popper-DpXbhq_0.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
  type: string;
  title: string;
  subtitle: string;
}) => {
  const {
    type
  } = args;
  return <Page themeId={type}>
      <Header {...args}>{labels}</Header>
    </Page>;
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,N as default};
