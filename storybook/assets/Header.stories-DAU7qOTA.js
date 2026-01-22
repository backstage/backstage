import{j as t}from"./iframe-QksS9oll.js";import{H as i}from"./Header-ByyZ_vg9.js";import{P as a}from"./Page-BU4DG1As.js";import{H as r}from"./HeaderLabel-CzZrLCe7.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Dt_fvfAA.js";import"./Box-4mwxRbT8.js";import"./styled-Dz3wLS-L.js";import"./Grid-D7XFfWKi.js";import"./Breadcrumbs-Cfl1lb8d.js";import"./index-B9sM2jn7.js";import"./Popover-D8Mf3ffv.js";import"./Modal-BVik2DkJ.js";import"./Portal-DNcXKhCz.js";import"./List-BifWF3Ny.js";import"./ListContext-BPnrPY1o.js";import"./ListItem-CjzOJyc8.js";import"./Link-vv3H9C9T.js";import"./lodash-Czox7iJy.js";import"./index-esiVI4gD.js";import"./useAnalytics-D3S6fnIb.js";import"./useApp-CB9Zi9mM.js";import"./Page-BQfwY7Rq.js";import"./useMediaQuery-CkJ47XHw.js";import"./Tooltip-DBYgA5-n.js";import"./Popper-BcJim0Sm.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
