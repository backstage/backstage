import{j as e}from"./iframe-BboAvpku.js";import{H as o}from"./Header-VEXcgOJm.js";import{P as p}from"./Page-B5MooMP-.js";import{H as r}from"./HeaderLabel-IXwk0om6.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Dj-9lKHb.js";import"./Box-AqVT1Pws.js";import"./styled-DoG2XfKF.js";import"./Grid-BGOrXcY9.js";import"./makeStyles-iFGDkJwR.js";import"./Breadcrumbs-CkfcM6Ba.js";import"./index-B9sM2jn7.js";import"./Popover-CgRHUBb5.js";import"./Modal-CbraGSLf.js";import"./Portal-CDVCSIuc.js";import"./List-OZSHlN34.js";import"./ListContext-BOEEedU_.js";import"./ListItem-Dkgy1Td7.js";import"./Link-js1uqTlL.js";import"./index-Bseu-KSo.js";import"./lodash-DkpW-IpZ.js";import"./useAnalytics-CgDc_Zie.js";import"./useApp-CGvPwDHO.js";import"./Page-BzGGqOBs.js";import"./useMediaQuery-kOBjvfD-.js";import"./Tooltip-C3crpqXc.js";import"./Popper-CZplJVpc.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
