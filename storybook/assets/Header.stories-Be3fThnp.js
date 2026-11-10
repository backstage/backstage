import{j as e}from"./iframe-DxBRWUiK.js";import{H as o}from"./Header-fuTxuzJq.js";import{P as p}from"./Page-BosRoXaz.js";import{H as r}from"./HeaderLabel-BbgWm3BR.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BwxVqID6.js";import"./Box-ZChtCTCt.js";import"./styled-DbZYE8_6.js";import"./Grid-Dnrsaaez.js";import"./makeStyles-CpnAmrz_.js";import"./Breadcrumbs-CCoR_-_c.js";import"./index-B9sM2jn7.js";import"./Popover-BxhHRbyM.js";import"./Modal-0h4bDHIq.js";import"./Portal-B0HOd5e1.js";import"./List-M_b7JZxV.js";import"./ListContext-BOD_g-hg.js";import"./ListItem-CJmzm5qP.js";import"./Link-DCSer0-z.js";import"./index-CvQne7Xm.js";import"./lodash-DkCje28P.js";import"./useAnalytics-DhjjGYXj.js";import"./useApp-nhNhp-L5.js";import"./Page-CVLtlWgn.js";import"./useMediaQuery-Dk_QOKc1.js";import"./Tooltip-_AhTUWau.js";import"./Popper-Bo0NFLq-.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
