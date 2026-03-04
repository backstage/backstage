import{j as t}from"./iframe-rmBlqmIJ.js";import{H as i}from"./Header-COuGK0DX.js";import{P as a}from"./Page-ujYabdOZ.js";import{H as r}from"./HeaderLabel-CIbJeAFa.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Ca4aombn.js";import"./makeStyles-C7NHQIjx.js";import"./Box-BJ8MGsCq.js";import"./styled-C1fNSXy6.js";import"./Grid-S-q4EpZp.js";import"./Breadcrumbs-zP7Nux05.js";import"./index-B9sM2jn7.js";import"./Popover-BULzLW-v.js";import"./Modal-BbaAKtj4.js";import"./Portal-Bh1pEuYq.js";import"./List-CmgMtYJn.js";import"./ListContext-Dr4uxIrN.js";import"./ListItem-DDDa0TMv.js";import"./Link-gdOZ6zM9.js";import"./index-74f52OEU.js";import"./lodash-jnxdCUG3.js";import"./index-BlsTvS7-.js";import"./useAnalytics-C7krV7MX.js";import"./useApp-DX7Pc2xI.js";import"./Page-BkjwglJP.js";import"./useMediaQuery-D4JCHD8I.js";import"./Tooltip-D6p3Ayxg.js";import"./Popper-B-v3u-hL.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
