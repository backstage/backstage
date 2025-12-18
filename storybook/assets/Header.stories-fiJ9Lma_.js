import{j as e}from"./iframe-BY8lR-L8.js";import{H as o}from"./Header-Dzimdm9k.js";import{P as p}from"./Page-DxIIaTGR.js";import{H as r}from"./HeaderLabel-Crn70xNP.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CpnMSKfo.js";import"./Box-COui6GIh.js";import"./styled-Ckl9NdN2.js";import"./Grid-BjrJvsR3.js";import"./Breadcrumbs-6-YCmMSo.js";import"./index-B9sM2jn7.js";import"./Popover-C5Oe9S6O.js";import"./Modal-ob7ZinQq.js";import"./Portal-9M61fEx6.js";import"./List-Zd71n2FM.js";import"./ListContext-CBZm9pJe.js";import"./ListItem-CGZ3ypeU.js";import"./Link-CG56jGaN.js";import"./lodash-Y_-RFQgK.js";import"./index-BS6rRTnv.js";import"./useAnalytics-BVxeCBFY.js";import"./useApp-BvPEffuf.js";import"./Page-oy0Z3Ain.js";import"./useMediaQuery-DyfB6pyL.js";import"./Tooltip-CQzh8PM4.js";import"./Popper-CAf4oxXD.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
