import{j as e}from"./iframe-D5t0zV2Z.js";import{H as o}from"./Header-BHPX85VA.js";import{P as p}from"./Page-ZbbCYab-.js";import{H as r}from"./HeaderLabel-DNzT3bsi.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DOG-a-8V.js";import"./Box-DF_678xD.js";import"./styled-J0WIBf2g.js";import"./Grid-i35IH7WF.js";import"./makeStyles-C7L4K4uU.js";import"./Breadcrumbs-BbWVq3Bz.js";import"./index-B9sM2jn7.js";import"./Popover-CUv6Uz21.js";import"./Modal-DcpDkvWp.js";import"./Portal-B-PE47rq.js";import"./List-Ce0b0pZR.js";import"./ListContext-_YXk3x9k.js";import"./ListItem-_yy6hJX-.js";import"./Link-HVvnTl0w.js";import"./index-BpFgTxyY.js";import"./lodash-DUCm7Gp4.js";import"./useAnalytics-BxfmAkrD.js";import"./useApp-CSht05na.js";import"./Page-D4wPzHHQ.js";import"./useMediaQuery-BQv6DctI.js";import"./Tooltip-BZz_LENi.js";import"./Popper-Kp7j8bA-.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
