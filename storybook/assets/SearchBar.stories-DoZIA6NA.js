const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-s-3oRhRQ.js","./iframe-DfpqVrvR.js","./preload-helper-PPVm8Dsz.js","./iframe-EGYOZfd6.css","./Search-D26opk2D.js","./useDebounce-CBQ3pGzA.js","./translation-1cWDr4S_.js","./SearchContext-BeYMF9OV.js","./lodash-DSlsmB_-.js","./useAsync-BY1DWTpd.js","./useMountedState-BTmbzoDb.js","./api-CO6hh861.js","./useAnalytics-BzwuJCU6.js","./InputAdornment-B8kGoEv9.js","./useFormControl-4531HN9P.js","./Button-Depzz_zY.js","./TextField-_DduLuoO.js","./Select-DbAP1AuQ.js","./index-B9sM2jn7.js","./Popover-C_jE5Tn-.js","./Modal-BWu1sU36.js","./Portal-DJgbgmP8.js","./List-BZpx7np8.js","./ListContext-rrXMk-NT.js","./formControlState-ByiNFc8I.js","./FormLabel-DiK1MWEa.js","./InputLabel-DRdVb8IE.js","./useApp-CcVlq-lF.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-DfpqVrvR.js";import{s as d,M as l}from"./api-CO6hh861.js";import{SearchBar as m}from"./SearchBar-s-3oRhRQ.js";import{S as h}from"./SearchContext-BeYMF9OV.js";import{S as p}from"./Grid-DytBiILQ.js";import{m as S}from"./makeStyles-D6lZMQOZ.js";import{w as B}from"./appWrappers-R6T-iis0.js";import"./Search-D26opk2D.js";import"./useDebounce-CBQ3pGzA.js";import"./translation-1cWDr4S_.js";import"./InputAdornment-B8kGoEv9.js";import"./useFormControl-4531HN9P.js";import"./Button-Depzz_zY.js";import"./TextField-_DduLuoO.js";import"./Select-DbAP1AuQ.js";import"./index-B9sM2jn7.js";import"./Popover-C_jE5Tn-.js";import"./Modal-BWu1sU36.js";import"./Portal-DJgbgmP8.js";import"./List-BZpx7np8.js";import"./ListContext-rrXMk-NT.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DiK1MWEa.js";import"./InputLabel-DRdVb8IE.js";import"./useAnalytics-BzwuJCU6.js";import"./useApp-CcVlq-lF.js";import"./lodash-DSlsmB_-.js";import"./useAsync-BY1DWTpd.js";import"./useMountedState-BTmbzoDb.js";import"./useObservable-CimeOSxy.js";import"./useIsomorphicLayoutEffect-T1QybcqB.js";import"./componentData-n0Ef26c2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Rl36dthR.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-s-3oRhRQ.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
