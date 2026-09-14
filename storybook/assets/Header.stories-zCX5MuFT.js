import{bQ as e}from"./iframe-J3scbCK7.js";import{H as o}from"./Header-B6t806_S.js";import{P as p}from"./Page-EwgjKAP5.js";import{H as r}from"./HeaderLabel-BuIOUnfh.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CEdKpQ2z.js";import"./Box-CAvHx8RQ.js";import"./styled-VY2eV-L4.js";import"./Grid-BOYW9g7Y.js";import"./makeStyles-D29HlZax.js";import"./Breadcrumbs-lr7nDEQd.js";import"./index-B9sM2jn7.js";import"./Popover-PIq6Oea3.js";import"./Modal-BLXH_MhM.js";import"./Portal-BtoOzNCK.js";import"./List-CuJDX_kH.js";import"./ListContext-BFUyXz-d.js";import"./ListItem-B5Wpm8B5.js";import"./Link-B5rKxH23.js";import"./index-0GTWXkVd.js";import"./lodash-CTYyc8_x.js";import"./useAnalytics-B_NPlYH5.js";import"./useApp-BFoiUE5i.js";import"./Page-BazjeGnb.js";import"./useMediaQuery-BHPh5sw5.js";import"./Tooltip-CvWNA7lm.js";import"./Popper-Dg99f-ei.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,Q as default};
