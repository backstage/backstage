import{j as t}from"./iframe-n0fImp44.js";import{H as i}from"./Header--1AWg44M.js";import{P as a}from"./Page-D8t8LB3x.js";import{H as r}from"./HeaderLabel-BxJ3uQA8.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Do8C-GLs.js";import"./makeStyles-7xRdzCom.js";import"./Box-BHviuYFv.js";import"./styled-DPQIJJsa.js";import"./Grid-XRj5X-dC.js";import"./Breadcrumbs-BnBIVoN4.js";import"./index-B9sM2jn7.js";import"./Popover-CxSL2zjC.js";import"./Modal-BKH7lGiL.js";import"./Portal-DaF9Kh8d.js";import"./List-B1pnwKZO.js";import"./ListContext-BL95jnEy.js";import"./ListItem-DO8hDZSO.js";import"./Link-DvnU995K.js";import"./index-DX3gz7st.js";import"./lodash-W9bRznJ2.js";import"./index-DIbljhmp.js";import"./useAnalytics-Z90ozCE5.js";import"./useApp-8qQHYFVi.js";import"./Page-Dj5CNZ2p.js";import"./useMediaQuery-fckud5iW.js";import"./Tooltip-Ni_hV5_d.js";import"./Popper-D6PulSAE.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
