import{j as t}from"./iframe-Bnzrr9GJ.js";import{H as i}from"./Header-BNDkQwgX.js";import{P as a}from"./Page-DYON6Qni.js";import{H as r}from"./HeaderLabel-B-g2BkTC.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-1dUogHcC.js";import"./Box-_ldnD672.js";import"./styled-ECwvL4gF.js";import"./Grid-yfENroGK.js";import"./Breadcrumbs-CBFfIuUV.js";import"./index-B9sM2jn7.js";import"./Popover-Quj_W4ar.js";import"./Modal-C9035a_p.js";import"./Portal-7sPWK5aa.js";import"./List-C5zGpaSP.js";import"./ListContext-BS9Mebja.js";import"./ListItem-WNmrdDGe.js";import"./Link-B2CkVKPO.js";import"./lodash-Czox7iJy.js";import"./index-CYC8aWCi.js";import"./useAnalytics-0uTDec9U.js";import"./useApp-SixTcc6z.js";import"./Page-C2gBGsO4.js";import"./useMediaQuery-B6shqm4c.js";import"./Tooltip-BNoXxCwH.js";import"./Popper-xM2ICnpy.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
