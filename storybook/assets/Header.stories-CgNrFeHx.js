import{j as e}from"./iframe-BKMB85pu.js";import{H as o}from"./Header-DssZcFsG.js";import{P as p}from"./Page-DGF-nL6Q.js";import{H as r}from"./HeaderLabel-Bgyswl1k.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BTLIJzMH.js";import"./Box-BIjxIEHL.js";import"./styled-CmE3HJ3H.js";import"./Grid-viPz66aT.js";import"./makeStyles-BbaqMEn9.js";import"./Breadcrumbs-BM3AS8yt.js";import"./index-B9sM2jn7.js";import"./Popover-BvkEu1t7.js";import"./Modal-Bcg_cvPF.js";import"./Portal-Bb_XUwd2.js";import"./List-DE1EjvNy.js";import"./ListContext-CjUxhhLX.js";import"./ListItem-t7nuvK6y.js";import"./Link-fH8EKjwa.js";import"./index-CxKjejfY.js";import"./lodash-BeJ40VgY.js";import"./useApp-CJurmApE.js";import"./index-DT_vTdsS.js";import"./useAnalytics-Byp1p_wz.js";import"./Page-DRJBAbIh.js";import"./useMediaQuery-57AyIoyC.js";import"./Tooltip-CTz6qeoG.js";import"./Popper-DX2HzMQ9.js";const S={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const k=["Default"];export{t as Default,k as __namedExportsOrder,S as default};
