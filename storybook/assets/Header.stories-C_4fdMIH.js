import{j as t}from"./iframe-DA79yDb5.js";import{H as i}from"./Header-BQRwh_lN.js";import{P as a}from"./Page-DjSJbwYd.js";import{H as r}from"./HeaderLabel-DxSAHbs8.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-c6HUneFx.js";import"./Box-BVQ5Vy1y.js";import"./styled-BjxYaA7M.js";import"./Grid-BPnxYFEE.js";import"./Breadcrumbs-UeupKxt1.js";import"./index-B9sM2jn7.js";import"./Popover-BhwuORe9.js";import"./Modal-B60MXtNN.js";import"./Portal-C0jNS9Vb.js";import"./List-nEGPw4NA.js";import"./ListContext-kCBY5dMI.js";import"./ListItem-BvihMH8Z.js";import"./Link-QsBbL45G.js";import"./lodash-DGzVoyEp.js";import"./index-Yr_6lw0r.js";import"./useAnalytics-C702rZt-.js";import"./useApp-PXZC3w6P.js";import"./Page-BYqNdESC.js";import"./useMediaQuery-BBYo_eUR.js";import"./Tooltip-DjxuUc5H.js";import"./Popper-Vz_SQ7W_.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...e.parameters?.docs?.source}}};const R=["Default"];export{e as Default,R as __namedExportsOrder,N as default};
