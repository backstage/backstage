import{j as e}from"./iframe-D_sJ6DQq.js";import{H as o}from"./Header-BadlSd9N.js";import{P as p}from"./Page-8N5lXnhB.js";import{H as r}from"./HeaderLabel-Cpy5D8IN.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DSxUn7E7.js";import"./Box-DJ0NzJ3e.js";import"./styled-DG5hZJap.js";import"./Grid-WyTZzD8J.js";import"./makeStyles-YbKVSigC.js";import"./Breadcrumbs-C8SZU54N.js";import"./index-B9sM2jn7.js";import"./Popover-BACQQKNI.js";import"./Modal-Il5jT_HY.js";import"./Portal-DW9hHrlW.js";import"./List-BTunbdig.js";import"./ListContext-B5K8tLHG.js";import"./ListItem-Bx10SaLX.js";import"./Link-DK9bz3Wb.js";import"./index-BdNqNG9A.js";import"./lodash-CO9od4is.js";import"./useAnalytics-DuovMTEZ.js";import"./useApp-DU8gpE_8.js";import"./Page-CvyexALp.js";import"./useMediaQuery-BVTc5bnm.js";import"./Tooltip-Bmz9tg2R.js";import"./Popper-Dip8lxhB.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
