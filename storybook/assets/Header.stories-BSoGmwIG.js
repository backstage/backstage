import{j as e}from"./iframe-Ca7Z-L4G.js";import{H as o}from"./Header-DXlbAj7R.js";import{P as p}from"./Page-MqRBkEik.js";import{H as r}from"./HeaderLabel-CuReq4vk.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-BG9Am0Tv.js";import"./Box-BAIj98gt.js";import"./styled-C18e2gIS.js";import"./Grid-auHuq8r2.js";import"./Breadcrumbs-DGUnmaqr.js";import"./index-DnL3XN75.js";import"./Popover-CcKmVttI.js";import"./Modal-DgmZg7sP.js";import"./Portal-BioI0xEQ.js";import"./List-CZA5eH2K.js";import"./ListContext-B_Im9Dn6.js";import"./ListItem-C9nJC85u.js";import"./Link-D6f9g5gT.js";import"./lodash-CwBbdt2Q.js";import"./index-BJKCiffA.js";import"./useAnalytics-B4tVP_DV.js";import"./useApp-CAw2wdK9.js";import"./Page-pJhfQI2U.js";import"./useMediaQuery-SoLzvs9M.js";import"./Tooltip-BxH5cU7h.js";import"./Popper-BHTXlPRY.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
