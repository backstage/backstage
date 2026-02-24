import{j as t}from"./iframe-BzU7-g6W.js";import{H as i}from"./Header-FJZdEtxX.js";import{P as a}from"./Page-D0KH3-II.js";import{H as r}from"./HeaderLabel-BMFKf6f-.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B2ZY82Yn.js";import"./makeStyles-S8VF_kfg.js";import"./Box-Buols8Z9.js";import"./styled-CKk5njoZ.js";import"./Grid-B3qBpLSb.js";import"./Breadcrumbs-Cp1GSnHY.js";import"./index-B9sM2jn7.js";import"./Popover-DWFOE5cT.js";import"./Modal-CBIhH-ZN.js";import"./Portal-CgRRNkEQ.js";import"./List-_WnCGckP.js";import"./ListContext-BaISySc_.js";import"./ListItem-Cdpwxzx8.js";import"./Link-CKRvx-Sg.js";import"./index-tkVjLpcC.js";import"./lodash-CgiI-b7o.js";import"./index-CgRTFS8p.js";import"./useAnalytics-CzoS-In4.js";import"./useApp-CYpMgEga.js";import"./Page-BMC0DIpM.js";import"./useMediaQuery-CFwYGRum.js";import"./Tooltip-DkbrsvZ9.js";import"./Popper-DYEx6Kul.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
