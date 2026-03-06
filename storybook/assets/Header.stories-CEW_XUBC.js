import{j as t}from"./iframe-DsSIhbnH.js";import{H as i}from"./Header-MgnUattJ.js";import{P as a}from"./Page-D6LyKJE3.js";import{H as r}from"./HeaderLabel-CAXWkO-A.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-4CqXO397.js";import"./makeStyles-BTdK2mva.js";import"./Box-CLIZZYjM.js";import"./styled-B9BbiYac.js";import"./Grid-DCNbb8Yd.js";import"./Breadcrumbs-CUCEiaOC.js";import"./index-B9sM2jn7.js";import"./Popover-C10icIW0.js";import"./Modal-jFWOd40w.js";import"./Portal-BImzt5t3.js";import"./List-CxhAFISx.js";import"./ListContext-B0w45w1v.js";import"./ListItem-CaDFxyiK.js";import"./Link-eFTMg8Ng.js";import"./index-C37t8kC7.js";import"./lodash-Cg6PKVQd.js";import"./index-DGCaJysn.js";import"./useAnalytics-DEZMyLWf.js";import"./useApp-ByARTA3Z.js";import"./Page-DWwVgphw.js";import"./useMediaQuery-CUAoQyxB.js";import"./Tooltip-Cs7i-ltk.js";import"./Popper-BoqtvTN5.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
