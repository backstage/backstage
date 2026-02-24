import{j as t}from"./iframe-C3xQ7KiW.js";import{H as i}from"./Header-DS_zCKsN.js";import{P as a}from"./Page-WUbosjMM.js";import{H as r}from"./HeaderLabel-Bz5EGMOz.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BQuTz6dX.js";import"./makeStyles-DBmVe0pu.js";import"./Box-B9jbdd7x.js";import"./styled-O7qqppix.js";import"./Grid-BxodhZCu.js";import"./Breadcrumbs-Bq3QTe81.js";import"./index-B9sM2jn7.js";import"./Popover-CqlnqcmX.js";import"./Modal-DSjq774m.js";import"./Portal-CUj0vCdE.js";import"./List-DDcVRd1X.js";import"./ListContext-D0L7xoNS.js";import"./ListItem-SHU5LmI7.js";import"./Link-Bn8sDEKN.js";import"./index-CiK-gQkJ.js";import"./lodash-x848OuuT.js";import"./index-DnV5JX1_.js";import"./useAnalytics-DTGy5db2.js";import"./useApp-ZEXXdbdt.js";import"./Page-oA1UkbMk.js";import"./useMediaQuery-DQa69Nua.js";import"./Tooltip-BZhLiA6X.js";import"./Popper-Bei7-2Ph.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
