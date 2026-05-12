import{j as e}from"./iframe-nLmXqEf7.js";import{H as o}from"./Header-RDBbira9.js";import{P as p}from"./Page-CEJkikL5.js";import{H as r}from"./HeaderLabel-CZbzjua-.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B95x5aTV.js";import"./Box-CyQmjUfD.js";import"./styled-Wwm-Ry3k.js";import"./Grid-DKuUeREw.js";import"./makeStyles-CuMWFimH.js";import"./Breadcrumbs-DuspQNL2.js";import"./index-B9sM2jn7.js";import"./Popover-vuQOXVJR.js";import"./Modal-BRV6JJqO.js";import"./Portal-v2HYj7Sb.js";import"./List-BIXTwaa6.js";import"./ListContext-C3nHO3D2.js";import"./ListItem-CNdv-BZq.js";import"./Link-CmMZkdgv.js";import"./index-BfzHIfnW.js";import"./lodash-BuFazukY.js";import"./useAnalytics-BnxG_la1.js";import"./useApp-CRwfijY3.js";import"./Page-vssKsFyV.js";import"./useMediaQuery-ec1Rzs1D.js";import"./Tooltip-B2Qas7pH.js";import"./Popper-Cxd_FbSD.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
