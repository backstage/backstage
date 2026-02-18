import{j as t}from"./iframe-C97aGyUm.js";import{H as i}from"./Header-DgADr1Pp.js";import{P as a}from"./Page-BpJGSBz1.js";import{H as r}from"./HeaderLabel-Fkw_MuLg.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CI8w2N9n.js";import"./makeStyles-BH_X-duW.js";import"./Box-Df-ATJWc.js";import"./styled-BJz5j31a.js";import"./Grid-B4D-XE5H.js";import"./Breadcrumbs-DiiubZ6e.js";import"./index-B9sM2jn7.js";import"./Popover-C1p9-1lq.js";import"./Modal-Bz25sGJi.js";import"./Portal-CFNjbNqg.js";import"./List-BpxYOW0_.js";import"./ListContext-CrpBZA7K.js";import"./ListItem-wmZ5BRVq.js";import"./Link-CtyWu2T9.js";import"./index-J5_UG62z.js";import"./lodash-CjTo-pxC.js";import"./index-D3xivPOe.js";import"./useAnalytics-CPFwZTkm.js";import"./useApp-CJrMf8iL.js";import"./Page-Dnzw6I_N.js";import"./useMediaQuery-CQ4eyRKM.js";import"./Tooltip-BGk1OQyx.js";import"./Popper-B9Uqg6K1.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
