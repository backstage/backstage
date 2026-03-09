const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-C0mRwk3a.js","./iframe-CmjKepAK.js","./preload-helper-PPVm8Dsz.js","./iframe-CmXu-F3L.css","./Search-CS5yjIoC.js","./useDebounce-BDQPmvJV.js","./translation-Du9yetw1.js","./SearchContext-CvMYsf4i.js","./lodash-DX7XxPLm.js","./useAsync-DhoQsFBa.js","./useMountedState-CjGZo6tl.js","./api-CMMmHn_k.js","./useAnalytics-C2hMq441.js","./InputAdornment-n0U2nEKR.js","./formControlState--KFx6Tmi.js","./Button-0Iky-ZUc.js","./TextField-CXZO0L0Q.js","./Select-ByJeIivF.js","./index-B9sM2jn7.js","./Popover-BuXPx6d1.js","./Modal-BI6ifavC.js","./Portal-BqvT6j51.js","./List-IEhbKV8f.js","./ListContext-2rvRcxSY.js","./FormLabel-jAM09VPt.js","./InputLabel-Dhw4JOfD.js","./useApp-CYm6BWpS.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i}from"./iframe-CmjKepAK.js";import{s as d,M as l}from"./api-CMMmHn_k.js";import{SearchBar as m}from"./SearchBar-C0mRwk3a.js";import{S as h}from"./SearchContext-CvMYsf4i.js";import{S as p}from"./Grid-BnHJoKKz.js";import{m as S}from"./makeStyles-rFkGMQln.js";import{w as B}from"./appWrappers-EyfP4mPN.js";import"./Search-CS5yjIoC.js";import"./useDebounce-BDQPmvJV.js";import"./translation-Du9yetw1.js";import"./InputAdornment-n0U2nEKR.js";import"./formControlState--KFx6Tmi.js";import"./Button-0Iky-ZUc.js";import"./TextField-CXZO0L0Q.js";import"./Select-ByJeIivF.js";import"./index-B9sM2jn7.js";import"./Popover-BuXPx6d1.js";import"./Modal-BI6ifavC.js";import"./Portal-BqvT6j51.js";import"./List-IEhbKV8f.js";import"./ListContext-2rvRcxSY.js";import"./FormLabel-jAM09VPt.js";import"./InputLabel-Dhw4JOfD.js";import"./useAnalytics-C2hMq441.js";import"./useApp-CYm6BWpS.js";import"./lodash-DX7XxPLm.js";import"./useAsync-DhoQsFBa.js";import"./useMountedState-CjGZo6tl.js";import"./useObservable-DeSzxYtu.js";import"./useIsomorphicLayoutEffect-Dp3BdtFL.js";import"./componentData-BYKFZO45.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-B0ldSqfO.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-C0mRwk3a.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
}`,...n.parameters?.docs?.source}}};const re=["Default","CustomPlaceholder","CustomLabel","Focused","WithoutClearButton","CustomStyles"];export{a as CustomLabel,o as CustomPlaceholder,n as CustomStyles,s as Default,t as Focused,c as WithoutClearButton,re as __namedExportsOrder,ee as default};
