import{j as t}from"./iframe-Bfb6es7h.js";import{H as i}from"./Header-CTzkA9-r.js";import{P as a}from"./Page-BaEbv32K.js";import{H as r}from"./HeaderLabel-BwLwfIq7.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DHbEm8mi.js";import"./Box-C8tWNgkw.js";import"./styled-DNaQ7xBF.js";import"./Grid-fOEQuWsY.js";import"./Breadcrumbs-CyZKkXqB.js";import"./index-B9sM2jn7.js";import"./Popover-BH0ZmLnx.js";import"./Modal-CMLC8fQ-.js";import"./Portal-DoGSafYV.js";import"./List-DdY4r3Qa.js";import"./ListContext-DK41gHFX.js";import"./ListItem-CdGfarMd.js";import"./Link-BXHXb0Ac.js";import"./lodash-Czox7iJy.js";import"./index-BH1Qp3-H.js";import"./useAnalytics-CVOFFuvg.js";import"./useApp-kTvTF_u-.js";import"./Page-F-BpEsaN.js";import"./useMediaQuery-BeWYv38j.js";import"./Tooltip-BIMvLisP.js";import"./Popper-C-IKLGjO.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
