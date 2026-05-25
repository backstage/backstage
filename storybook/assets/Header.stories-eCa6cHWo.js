import{j as e}from"./iframe-COehFrpL.js";import{H as o}from"./Header-C8bdX1aT.js";import{P as p}from"./Page-DLgd2_hn.js";import{H as r}from"./HeaderLabel-CK3spUmT.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CisB_Ug6.js";import"./Box-B7PQop3d.js";import"./styled-CHPGtv4W.js";import"./Grid-BJ0wK3FV.js";import"./makeStyles-D7As8WbR.js";import"./Breadcrumbs-CJy7pk29.js";import"./index-B9sM2jn7.js";import"./Popover-BdwdwPwj.js";import"./Modal-MCEmRc8K.js";import"./Portal-BDUo5n07.js";import"./List-CiizdJ3F.js";import"./ListContext-BRvGbkkj.js";import"./ListItem-KCvGwAe0.js";import"./Link-B7XO7g3U.js";import"./index-a-YDJ9fl.js";import"./lodash-FtczDCAx.js";import"./useAnalytics-MdDpEXUp.js";import"./useApp-B2bmOZiO.js";import"./Page-vPLmE_tC.js";import"./useMediaQuery-iJ9ch_1_.js";import"./Tooltip-D5cXJRas.js";import"./Popper-Dg2-j-PV.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
