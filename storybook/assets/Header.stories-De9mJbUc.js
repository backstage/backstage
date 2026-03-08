import{j as t}from"./iframe-C7l5P2_I.js";import{H as i}from"./Header-BPSoXrOD.js";import{P as a}from"./Page-DQ0rapqM.js";import{H as r}from"./HeaderLabel-sYdLwiQi.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D4sLzKOe.js";import"./makeStyles-DO0dhQTG.js";import"./Box-CnwfTMBK.js";import"./styled-BQ5_1fzN.js";import"./Grid-3Bz-t9Mk.js";import"./Breadcrumbs-t7NYEu_Q.js";import"./index-B9sM2jn7.js";import"./Popover-B2wLjBT4.js";import"./Modal-irLIXdct.js";import"./Portal-YwRf0OFq.js";import"./List-C_Ju4KCi.js";import"./ListContext-Dobuofun.js";import"./ListItem-DkGdhH3Z.js";import"./Link-DErIwACF.js";import"./index-DlhmoIZL.js";import"./lodash-C_n5Ni0i.js";import"./index-Ct-Fv-qt.js";import"./useAnalytics-DvfsJVgo.js";import"./useApp-B0ylAoYl.js";import"./Page-DTuwIqbR.js";import"./useMediaQuery-DZhcWUcO.js";import"./Tooltip-DXtsjz2q.js";import"./Popper-CuIlqdpq.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
