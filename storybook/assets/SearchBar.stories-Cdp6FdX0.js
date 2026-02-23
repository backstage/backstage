const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-eKeU7QoS.js","./iframe-CT0kqbtx.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-Bwfpmnf1.js","./useDebounce-REgkGx5c.js","./translation-CLuk9WYr.js","./SearchContext-Mmvk1abL.js","./lodash-BBZYXrTl.js","./useAsync-BNL7GVzz.js","./useMountedState-uZD7XVdG.js","./api-DIsr2-jB.js","./useAnalytics-Cwz45vQ0.js","./InputAdornment-2iGAS4ex.js","./useFormControl-BIYrfHLt.js","./Button-zP28n0U_.js","./TextField-BRUVaSB6.js","./Select-BCZtDEeR.js","./index-B9sM2jn7.js","./Popover-DV6slOQA.js","./Modal-Il3Pl7UL.js","./Portal-BtLj93zy.js","./List-CI6msm6Y.js","./ListContext-CFe7K_lB.js","./formControlState-ByiNFc8I.js","./FormLabel-C84PWemP.js","./InputLabel-BAdNWiVD.js","./useApp-B6I2yL-o.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-CT0kqbtx.js";import{s as d,M as l}from"./api-DIsr2-jB.js";import{SearchBar as m}from"./SearchBar-eKeU7QoS.js";import{S as h}from"./SearchContext-Mmvk1abL.js";import{S as p}from"./Grid-BDVcufVA.js";import{m as S}from"./makeStyles-DcVFc7tY.js";import{w as B}from"./appWrappers-DqGnnVBb.js";import"./Search-Bwfpmnf1.js";import"./useDebounce-REgkGx5c.js";import"./translation-CLuk9WYr.js";import"./InputAdornment-2iGAS4ex.js";import"./useFormControl-BIYrfHLt.js";import"./Button-zP28n0U_.js";import"./TextField-BRUVaSB6.js";import"./Select-BCZtDEeR.js";import"./index-B9sM2jn7.js";import"./Popover-DV6slOQA.js";import"./Modal-Il3Pl7UL.js";import"./Portal-BtLj93zy.js";import"./List-CI6msm6Y.js";import"./ListContext-CFe7K_lB.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-C84PWemP.js";import"./InputLabel-BAdNWiVD.js";import"./useAnalytics-Cwz45vQ0.js";import"./useApp-B6I2yL-o.js";import"./lodash-BBZYXrTl.js";import"./useAsync-BNL7GVzz.js";import"./useMountedState-uZD7XVdG.js";import"./useObservable-DPa0kBqA.js";import"./useIsomorphicLayoutEffect-D0Q3L9Ht.js";import"./componentData-B6F2nED4.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BogYrcCc.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-eKeU7QoS.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
  return <SearchBar />;
};
`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const CustomPlaceholder = () => {
  return <SearchBar placeholder="This is a custom placeholder" />;
};
`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const CustomLabel = () => {
  return <SearchBar label="This is a custom label" />;
};
`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const Focused = () => {
  return (
    // decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <SearchBar autoFocus />
  );
};
`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const WithoutClearButton = () => {
  return <SearchBar clearButton={false} />;
};
`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const CustomStyles = () => {
  const classes = useStyles();
  return (
    <SearchBar
      InputProps={{
        classes: {
          root: classes.searchBarRoot,
          notchedOutline: classes.searchBarOutline,
        },
      }}
    />
  );
};
`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar />;
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar placeholder="This is a custom placeholder" />;
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar label="This is a custom label" />;
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return (
    // decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <SearchBar autoFocus />
  );
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar clearButton={false} />;
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  return <SearchBar InputProps={{
    classes: {
      root: classes.searchBarRoot,
      notchedOutline: classes.searchBarOutline
    }
  }} />;
}`,...n.parameters?.docs?.source}}};const se=["Default","CustomPlaceholder","CustomLabel","Focused","WithoutClearButton","CustomStyles"];export{a as CustomLabel,o as CustomPlaceholder,n as CustomStyles,s as Default,t as Focused,c as WithoutClearButton,se as __namedExportsOrder,re as default};
