import{j as t}from"./iframe-DPEQU9sg.js";import{H as i}from"./Header-CsYdQ6NT.js";import{P as a}from"./Page-CRUnrINz.js";import{H as r}from"./HeaderLabel-BfKhIauJ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-A38lpAZE.js";import"./Box-DFPXS1uh.js";import"./styled-_ZhQ2JBl.js";import"./Grid-V2KC8DrR.js";import"./Breadcrumbs-Bw2LeV2W.js";import"./index-B9sM2jn7.js";import"./Popover-CRfqc1ul.js";import"./Modal-BY3dMB2D.js";import"./Portal-AonZoDqn.js";import"./List-DquDfnLJ.js";import"./ListContext-DyGfW3pa.js";import"./ListItem-C3tAmyko.js";import"./Link-DnuEQx-0.js";import"./lodash-Czox7iJy.js";import"./index-9w1oJKxU.js";import"./useAnalytics-odk5YTGP.js";import"./useApp-WY7YhADn.js";import"./Page-B0Mxy1-P.js";import"./useMediaQuery-C3e1AJ83.js";import"./Tooltip-1rkaBdpM.js";import"./Popper-BxGyCUHY.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
