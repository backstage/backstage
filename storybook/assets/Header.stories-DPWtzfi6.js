import{j as t}from"./iframe-M9O-K8SB.js";import{H as i}from"./Header-Bu45bg61.js";import{P as a}from"./Page-CZ1sok9e.js";import{H as r}from"./HeaderLabel-Dj7RUNcf.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BMcyM-lh.js";import"./Box-DrVgjJoD.js";import"./styled-Ddkk_tuK.js";import"./Grid-DxciBpqo.js";import"./Breadcrumbs-4nHYHgIN.js";import"./index-B9sM2jn7.js";import"./Popover-9y8CeMZr.js";import"./Modal-Bu63BRBX.js";import"./Portal-B9990TVI.js";import"./List-DFXlWgcm.js";import"./ListContext-CQy2fJuy.js";import"./ListItem-CccU-wMK.js";import"./Link-Btc0GL0z.js";import"./lodash-Czox7iJy.js";import"./index-CuiKZooy.js";import"./useAnalytics-8ya555GT.js";import"./useApp-Citse85p.js";import"./Page-ofKNp1l9.js";import"./useMediaQuery-BeVqOIt1.js";import"./Tooltip-Bg-nqDOZ.js";import"./Popper-BxqJldSX.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
