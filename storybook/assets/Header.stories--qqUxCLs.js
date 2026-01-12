import{j as t}from"./iframe-C8yOC2Gz.js";import{H as i}from"./Header-Bv4nYmZG.js";import{P as a}from"./Page-D_9gv9RE.js";import{H as r}from"./HeaderLabel-3OG4NdIT.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CfXlE53z.js";import"./Box-CBcWlLgQ.js";import"./styled-Ci681tPu.js";import"./Grid-CFxNiZTj.js";import"./Breadcrumbs-C9_NDB42.js";import"./index-B9sM2jn7.js";import"./Popover-BRQt0jP-.js";import"./Modal-D0M0Hit_.js";import"./Portal-CjckT897.js";import"./List-BjKqLdFh.js";import"./ListContext-6MZEPlz1.js";import"./ListItem-BMFOx_2Q.js";import"./Link-CUs49TGY.js";import"./lodash-DLuUt6m8.js";import"./index-CL1m9NR9.js";import"./useAnalytics-CGjIDoIa.js";import"./useApp-_O_9FYmx.js";import"./Page-_N_KtytX.js";import"./useMediaQuery-DfxMb9sA.js";import"./Tooltip-BmRm86HZ.js";import"./Popper-DqIt_wBv.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
