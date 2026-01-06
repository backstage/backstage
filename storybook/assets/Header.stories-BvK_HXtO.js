import{j as e}from"./iframe-DgkzaRcz.js";import{H as o}from"./Header-BZKrJSEZ.js";import{P as p}from"./Page-SRyZB_Hv.js";import{H as r}from"./HeaderLabel-C6enyIZk.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-t88x5hzm.js";import"./Box-CjF3f9rs.js";import"./styled-TNDgSIeW.js";import"./Grid-13HvIHxd.js";import"./Breadcrumbs-Bx1nKDfc.js";import"./index-B9sM2jn7.js";import"./Popover-BOhX_6l5.js";import"./Modal-BMl9YgIm.js";import"./Portal-DiyW3rHr.js";import"./List-UtDCRpiD.js";import"./ListContext-Bc5vGjYI.js";import"./ListItem-D-dCGJEh.js";import"./Link-CD76Rbm5.js";import"./lodash-Y_-RFQgK.js";import"./index-BovWTFKo.js";import"./useAnalytics-qnTiS8hb.js";import"./useApp-Dd6zMmOH.js";import"./Page-_qLX4kSd.js";import"./useMediaQuery-DilCgI2m.js";import"./Tooltip-eP5YooZ3.js";import"./Popper-D8NH0TjN.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
