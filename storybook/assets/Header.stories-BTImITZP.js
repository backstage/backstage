import{j as t}from"./iframe-ByNNXeiS.js";import{H as i}from"./Header-BAOig3Km.js";import{P as a}from"./Page-CS3jAVrm.js";import{H as r}from"./HeaderLabel-Cus_hof3.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BkwaIblI.js";import"./Box-bD4mu6aM.js";import"./styled-CuXflSyU.js";import"./Grid-COH9vICu.js";import"./Breadcrumbs-D3RCdsSK.js";import"./index-B9sM2jn7.js";import"./Popover-DtfOeBBz.js";import"./Modal-Sjev8ZKO.js";import"./Portal-0sot7Ylp.js";import"./List-Dw_wv5bM.js";import"./ListContext-CXkvT0sH.js";import"./ListItem-CKlTPKne.js";import"./Link-B8WLAU68.js";import"./lodash-Czox7iJy.js";import"./index-BTmRWwN6.js";import"./useAnalytics-BatNLUt2.js";import"./useApp-BIEPQg0g.js";import"./Page-9z0f7Kvu.js";import"./useMediaQuery-CvjcEiIW.js";import"./Tooltip-Cn9c8OtC.js";import"./Popper-jt-jzf2T.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
