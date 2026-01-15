import{j as t}from"./iframe-CDMGjht1.js";import{H as i}from"./Header-DNHkG2Us.js";import{P as a}from"./Page-nHvt4RSJ.js";import{H as r}from"./HeaderLabel-miZXECFw.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CgN7KOz-.js";import"./Box-Dh0DgXaN.js";import"./styled-BhiXTegV.js";import"./Grid-BgC6P4wx.js";import"./Breadcrumbs-C5PUfm4H.js";import"./index-B9sM2jn7.js";import"./Popover-DdPwRKDV.js";import"./Modal-DiZS-g1t.js";import"./Portal-Dv12doci.js";import"./List-BZ3qqjn-.js";import"./ListContext-ak2gE-qF.js";import"./ListItem-CGpakNnt.js";import"./Link-D_ooISTq.js";import"./lodash-DLuUt6m8.js";import"./index-K4DNRamS.js";import"./useAnalytics-DNi1LI_h.js";import"./useApp-DP3Hy8Yt.js";import"./Page-CGSjvpq-.js";import"./useMediaQuery-DHHJ8_07.js";import"./Tooltip-CrUID85L.js";import"./Popper-CnWXkGYE.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
