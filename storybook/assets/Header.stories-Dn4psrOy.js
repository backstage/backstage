import{j as e}from"./iframe-C0T-wj8W.js";import{H as o}from"./Header-C-sDdtW_.js";import{P as p}from"./Page-BbC3enpw.js";import{H as r}from"./HeaderLabel-Cv2ksSu4.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Cp1SClP7.js";import"./Box-zHlL_yoj.js";import"./styled-DP6UPB8s.js";import"./Grid-Kd3bNwE8.js";import"./makeStyles-DViRTVia.js";import"./Breadcrumbs-CCKggBnD.js";import"./index-B9sM2jn7.js";import"./Popover-CvJzuGky.js";import"./Modal-u1aPM6tr.js";import"./Portal-ChEPYBl8.js";import"./List-CHzHxHRI.js";import"./ListContext-C3ivO856.js";import"./ListItem-CnMPBa6o.js";import"./Link-Dh9Tk7z5.js";import"./index-DiT9MzNM.js";import"./lodash-ByAGuY73.js";import"./useAnalytics-C8hlcdRX.js";import"./useApp-CHDrtVuY.js";import"./Page-BkVovo2a.js";import"./useMediaQuery-CtkHlqjl.js";import"./Tooltip-Dvdk8_gO.js";import"./Popper-Vn_FLfwt.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
