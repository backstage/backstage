import{j as t}from"./iframe-CdLF-10Q.js";import{H as i}from"./Header-B7RNO6G_.js";import{P as a}from"./Page-AJwexYhQ.js";import{H as r}from"./HeaderLabel-DMbsVm23.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B-p8oAJG.js";import"./makeStyles-DHrBvqm9.js";import"./Box-BEpYmdO6.js";import"./styled-DKVD7tgY.js";import"./Grid-CH2eTvwA.js";import"./Breadcrumbs-B0_C1aLh.js";import"./index-B9sM2jn7.js";import"./Popover-BqH4VyXe.js";import"./Modal-BHOZm2fX.js";import"./Portal-6YsMjpwZ.js";import"./List-C4Q5M6UV.js";import"./ListContext-DDpewh2C.js";import"./ListItem-Ca20zprb.js";import"./Link-ChiTmoa9.js";import"./index-BdTZ39qe.js";import"./lodash-BVTqar6L.js";import"./index-llat7fUI.js";import"./useAnalytics-uwBj52oz.js";import"./useApp-B_Lst6SJ.js";import"./Page-DNEmlYTo.js";import"./useMediaQuery-HSNyejSw.js";import"./Tooltip-r72wdggD.js";import"./Popper-g8OlZzUX.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
