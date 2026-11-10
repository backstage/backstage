import{j as e}from"./iframe-S5OJNhaE.js";import{H as o}from"./Header-DZ013kfx.js";import{P as p}from"./Page-BxJ3pLpW.js";import{H as r}from"./HeaderLabel-DehiY7kV.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DDV2wq_h.js";import"./Box-CLnYDjy1.js";import"./styled-V22BojXI.js";import"./Grid-DjboKT5l.js";import"./makeStyles-D0gbbC8R.js";import"./Breadcrumbs-XkIW97q2.js";import"./index-B9sM2jn7.js";import"./Popover-CSao0uf9.js";import"./Modal-TRNTDwAw.js";import"./Portal-BJL3RwoG.js";import"./List-DoT7Ftgb.js";import"./ListContext-DOVL_hFP.js";import"./ListItem-DgGNurAj.js";import"./Link-CBQOxjrI.js";import"./index-DWYBXtX6.js";import"./lodash-eKDtcgkj.js";import"./useAnalytics-a2pKeP17.js";import"./useApp-DxGdeyks.js";import"./Page-DTCt1KPk.js";import"./useMediaQuery-CZcGrMHH.js";import"./Tooltip-CaXoXNma.js";import"./Popper-BvGmEb9H.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,R as default};
