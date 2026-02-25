const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-qPUu7r-R.js","./iframe-DhudO7cT.js","./preload-helper-PPVm8Dsz.js","./iframe-D3TzzGM-.css","./Search-SBquM9Sa.js","./useDebounce-DSy40S6p.js","./translation-sDvm6KWz.js","./SearchContext-Ci6cvaR5.js","./lodash-D50Mv8ds.js","./useAsync-CTFC4gS_.js","./useMountedState-Cnm9VAPO.js","./api-rLiZlmmd.js","./useAnalytics-CJ0Sk0Lg.js","./InputAdornment-BKc2BRc-.js","./useFormControl-BjKsPsRM.js","./Button-CgvS3Q_x.js","./TextField-DChCEKf2.js","./Select-SVF-WZGg.js","./index-B9sM2jn7.js","./Popover-Co_U8rXS.js","./Modal-D-bP3iV-.js","./Portal-DHDPWTL1.js","./List-CETIUmeh.js","./ListContext-DXxn2Iso.js","./formControlState-ByiNFc8I.js","./FormLabel-BunYcRsf.js","./InputLabel-BzpyGJFz.js","./useApp-rE8BYLs2.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,Z as u}from"./iframe-DhudO7cT.js";import{s as d,M as l}from"./api-rLiZlmmd.js";import{SearchBar as m}from"./SearchBar-qPUu7r-R.js";import{S as h}from"./SearchContext-Ci6cvaR5.js";import{S as p}from"./Grid-jH0iynLg.js";import{m as S}from"./makeStyles-DirKP-uM.js";import{w as B}from"./appWrappers-BORPb0rG.js";import"./Search-SBquM9Sa.js";import"./useDebounce-DSy40S6p.js";import"./translation-sDvm6KWz.js";import"./InputAdornment-BKc2BRc-.js";import"./useFormControl-BjKsPsRM.js";import"./Button-CgvS3Q_x.js";import"./TextField-DChCEKf2.js";import"./Select-SVF-WZGg.js";import"./index-B9sM2jn7.js";import"./Popover-Co_U8rXS.js";import"./Modal-D-bP3iV-.js";import"./Portal-DHDPWTL1.js";import"./List-CETIUmeh.js";import"./ListContext-DXxn2Iso.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BunYcRsf.js";import"./InputLabel-BzpyGJFz.js";import"./useAnalytics-CJ0Sk0Lg.js";import"./useApp-rE8BYLs2.js";import"./lodash-D50Mv8ds.js";import"./useAsync-CTFC4gS_.js";import"./useMountedState-Cnm9VAPO.js";import"./useObservable-CD0inowd.js";import"./useIsomorphicLayoutEffect-BNtsuMGe.js";import"./componentData-ISH3JKjp.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CBf-CADU.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-qPUu7r-R.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
