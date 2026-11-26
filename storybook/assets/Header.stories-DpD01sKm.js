import{j as e}from"./iframe-CR1Jw9dV.js";import{H as o}from"./Header-C0pZXFx8.js";import{P as p}from"./Page-DNiR03kA.js";import{H as r}from"./HeaderLabel-CIEKgsYc.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DHzsVwNu.js";import"./Box-BaA-dv-7.js";import"./styled-BINEkVaE.js";import"./Grid-CxkI-J4A.js";import"./makeStyles-Blkp-8Vz.js";import"./Breadcrumbs-8xalYlnA.js";import"./index-B9sM2jn7.js";import"./Popover-CiksNMKT.js";import"./Modal-CTlLO77g.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-C2kblzhY.js";import"./List-DygGvees.js";import"./ListContext-C50iGKA5.js";import"./ListItem-C8ehtjyx.js";import"./Link-Dhqz-BCc.js";import"./index-CuqShzUV.js";import"./lodash-5fYZTyfB.js";import"./useApp-D4i_SxIG.js";import"./index-BBOHwEhV.js";import"./useAnalytics-iih8YEd4.js";import"./Page-8g3m80Rd.js";import"./useMediaQuery-BvfkDEXh.js";import"./Tooltip-CCYuJKdE.js";import"./Popper-Cy86Lo3a.js";const k={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const z=["Default"];export{t as Default,z as __namedExportsOrder,k as default};
