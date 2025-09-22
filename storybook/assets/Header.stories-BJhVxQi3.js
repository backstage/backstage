import{j as e}from"./iframe-BKfEGE7G.js";import{H as o}from"./Header-DiUuL--H.js";import{P as p}from"./Page-Dv4eQxQD.js";import{H as r}from"./HeaderLabel-_NftGi1N.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-BTYN8qmy.js";import"./Box-BJlQ2iQy.js";import"./styled-B4-rL4TL.js";import"./Grid-vX9qBbX0.js";import"./Breadcrumbs-CeVPXq0i.js";import"./index-DnL3XN75.js";import"./Popover-BDMv4xbF.js";import"./Modal-CvEZPVbb.js";import"./Portal-Dl4iECMi.js";import"./List-xqk2zBI-.js";import"./ListContext-1tRnwUCo.js";import"./ListItem-DH54cTxL.js";import"./Link-CDMP9pev.js";import"./lodash-CwBbdt2Q.js";import"./index-DxVjIFhW.js";import"./useAnalytics-BLOfhO-l.js";import"./useApp-_11zMdcF.js";import"./Page-D_c3Yzdb.js";import"./useMediaQuery-DTZzhyji.js";import"./Tooltip-BkpGifwK.js";import"./Popper-Cl6P73dl.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
