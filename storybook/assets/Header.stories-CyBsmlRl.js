import{j as t}from"./iframe-D7hFsAHh.js";import{H as i}from"./Header-BSeHPSuJ.js";import{P as a}from"./Page-D0DmJCr2.js";import{H as r}from"./HeaderLabel-DMHqBqAy.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-rqv45Awz.js";import"./Box-D-wD6_7y.js";import"./styled-CbYuIyxW.js";import"./Grid-BBTPNutj.js";import"./Breadcrumbs-D3reOea4.js";import"./index-B9sM2jn7.js";import"./Popover-C2DlR72c.js";import"./Modal-DMtGtm-r.js";import"./Portal-8ZiP_Sqy.js";import"./List-CIMPRI7k.js";import"./ListContext-D0CqRlfT.js";import"./ListItem-CLTebMeN.js";import"./Link-JoAHle2P.js";import"./lodash-Czox7iJy.js";import"./index-CMWiNJrn.js";import"./useAnalytics-DEh4mfg6.js";import"./useApp-DH_b7x7P.js";import"./Page-Cvd6bNYg.js";import"./useMediaQuery-DY2CsapC.js";import"./Tooltip-5tHvVIiB.js";import"./Popper-DQ1szM6i.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
