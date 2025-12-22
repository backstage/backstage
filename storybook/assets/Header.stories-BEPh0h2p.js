import{j as e}from"./iframe-DZkam7Bj.js";import{H as o}from"./Header-CXXffqwZ.js";import{P as p}from"./Page-CVY30iie.js";import{H as r}from"./HeaderLabel-SZT4DiZX.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-3ZyT5gkJ.js";import"./Box-DChwE7Ki.js";import"./styled-RI4GT_4U.js";import"./Grid-DBMZs7np.js";import"./Breadcrumbs-CNT9Yj_g.js";import"./index-B9sM2jn7.js";import"./Popover-H9d7tLDo.js";import"./Modal-Dli2H9pG.js";import"./Portal-mqL5KVNN.js";import"./List-Ca4J4jzY.js";import"./ListContext-D7S-zqsj.js";import"./ListItem-DNrM1AYn.js";import"./Link-BoLwiIPW.js";import"./lodash-Y_-RFQgK.js";import"./index-BYedHEZ0.js";import"./useAnalytics-RqWf-jVc.js";import"./useApp-CAfcC71X.js";import"./Page-CQ8nzwAx.js";import"./useMediaQuery-Chsf4aBi.js";import"./Tooltip-D0UPjqYE.js";import"./Popper-CT_phagK.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
