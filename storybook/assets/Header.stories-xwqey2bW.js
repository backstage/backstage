import{bR as e}from"./iframe-BSg6SOip.js";import{H as o}from"./Header-CGb-H508.js";import{P as p}from"./Page-B1iUqD9r.js";import{H as r}from"./HeaderLabel-BmfDASSn.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DJ5yfjk0.js";import"./Box-DbXzz4Cf.js";import"./styled-DmIK-8cq.js";import"./Grid-BN_wjj9Y.js";import"./makeStyles-eJb4jbID.js";import"./Breadcrumbs-Cm0CQfBi.js";import"./index-B9sM2jn7.js";import"./Popover-CZxMOKBU.js";import"./Modal-Ctja9z0k.js";import"./Portal-BuoCh0-n.js";import"./List-KWBrKoXi.js";import"./ListContext-CyjS2JBq.js";import"./ListItem-B4NbXtSx.js";import"./Link-DlJ370hJ.js";import"./index-dK8gvQuo.js";import"./lodash-D2GC-5Cr.js";import"./useAnalytics-BZjevC_t.js";import"./useApp-B5sJzxPh.js";import"./Page-DgIGYuA_.js";import"./useMediaQuery-AMMABF1K.js";import"./Tooltip-3BsbxjC7.js";import"./Popper-CkPJpC3f.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,N as default};
