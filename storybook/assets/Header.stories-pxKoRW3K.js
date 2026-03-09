import{j as t}from"./iframe-DyesWYDr.js";import{H as i}from"./Header-tAgoHthj.js";import{P as a}from"./Page-BXBKokbt.js";import{H as r}from"./HeaderLabel-DccbIwrp.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CoTFfJFb.js";import"./makeStyles-qFKHfDO-.js";import"./Box-km7zlvMw.js";import"./styled-Dfa_ap0s.js";import"./Grid-BVpgiwP1.js";import"./Breadcrumbs-DJDb_6Hv.js";import"./index-B9sM2jn7.js";import"./Popover-Dcp5jBjk.js";import"./Modal-EBxf97A6.js";import"./Portal-rWyDgme_.js";import"./List-CxzFB0_1.js";import"./ListContext-f5RS08Ml.js";import"./ListItem-CPW55C5k.js";import"./Link-hxVkChoh.js";import"./index-FhOPq4Td.js";import"./lodash-CU-eNkSq.js";import"./index-Cs_UWgtM.js";import"./useAnalytics-C5Z3C1Xs.js";import"./useApp-C7maoOfG.js";import"./Page-Xww77KL5.js";import"./useMediaQuery-DwK3YrQh.js";import"./Tooltip-BTxoZZD7.js";import"./Popper-CEy5HCpt.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { type } = args;

  return (
    <Page themeId={type}>
      <Header type="home" title="This is a title" subtitle="This is a subtitle">
        {labels}
      </Header>
    </Page>
  );
};
`,...e.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(args: {
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
}`,...e.parameters?.docs?.source}}};const k=["Default"];export{e as Default,k as __namedExportsOrder,S as default};
