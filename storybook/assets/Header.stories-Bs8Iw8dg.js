import{j as e}from"./iframe-Dyaavudc.js";import{H as o}from"./Header-yk78lAuC.js";import{P as p}from"./Page-KDqQho-S.js";import{H as r}from"./HeaderLabel-BwRWuHhd.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-DjAh2DoP.js";import"./Box-BBMZCdvE.js";import"./styled-DUE4Vhg9.js";import"./Grid-yjQsuTcw.js";import"./Breadcrumbs-YVWYqOFj.js";import"./index-DnL3XN75.js";import"./Popover-ivVHntkx.js";import"./Modal-CXTgK8no.js";import"./Portal-CUQx1RGJ.js";import"./List-CD5TLS8H.js";import"./ListContext-tHxur0ox.js";import"./ListItem-Cw_mLBpk.js";import"./Link-BzX_mGVi.js";import"./lodash-CwBbdt2Q.js";import"./index-QN8QI6Oa.js";import"./useAnalytics-DFiGEzjB.js";import"./useApp-zMMbOjHG.js";import"./Page-DgaJmYab.js";import"./useMediaQuery-DUW0Qb7e.js";import"./Tooltip-Ty7zpOlh.js";import"./Popper-DhZ8DQVo.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
