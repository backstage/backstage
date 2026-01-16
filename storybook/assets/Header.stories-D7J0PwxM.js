import{j as t}from"./iframe-C6d4amxQ.js";import{H as i}from"./Header-Dml68EjR.js";import{P as a}from"./Page-DfVgUTND.js";import{H as r}from"./HeaderLabel-Dzam77ig.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-eqh2LwA3.js";import"./Box-yXRZ3Xp2.js";import"./styled-BGGy5Grm.js";import"./Grid-WtUylni-.js";import"./Breadcrumbs-DdQo9UZ9.js";import"./index-B9sM2jn7.js";import"./Popover-BUbOGoXS.js";import"./Modal-D1YXIVhd.js";import"./Portal-B6ENv45o.js";import"./List-qMmGjvCV.js";import"./ListContext-Baa1QRS6.js";import"./ListItem-CUGV6Izn.js";import"./Link-xhhwyYCu.js";import"./lodash-DLuUt6m8.js";import"./index-Bwu9Fyg1.js";import"./useAnalytics-CEJvE44e.js";import"./useApp-BUIf5wuk.js";import"./Page-CHu6BMKX.js";import"./useMediaQuery-CWOHA7aL.js";import"./Tooltip-5RhOkenH.js";import"./Popper-aoUur9H0.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
