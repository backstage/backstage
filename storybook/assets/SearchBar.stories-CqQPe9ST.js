const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DX_-ON3R.js","./iframe-DuvNW6Xv.js","./preload-helper-PPVm8Dsz.js","./iframe-D3TzzGM-.css","./Search-DjxQHUpj.js","./useDebounce-DjFBl-U-.js","./translation-DIkRI0pa.js","./SearchContext-CdqEcvGC.js","./lodash-D4DPSOUM.js","./useAsync-yNTUxeMe.js","./useMountedState-BooP3pH9.js","./api-Ccd-ZB-G.js","./useAnalytics-C22xHozv.js","./InputAdornment-Cpt7Vtqb.js","./useFormControl-BHHnR_-k.js","./Button-CrQJY2kf.js","./TextField-DOkdJyZN.js","./Select-BllrwJg9.js","./index-B9sM2jn7.js","./Popover-DXuECRR4.js","./Modal-CGrUoTEz.js","./Portal-C6ZvXkAX.js","./List-BJbmfEoB.js","./ListContext-3Q_S_JMo.js","./formControlState-ByiNFc8I.js","./FormLabel-5An11EO7.js","./InputLabel-BXTIeKid.js","./useApp-CGYzobcC.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,Z as u}from"./iframe-DuvNW6Xv.js";import{s as d,M as l}from"./api-Ccd-ZB-G.js";import{SearchBar as m}from"./SearchBar-DX_-ON3R.js";import{S as h}from"./SearchContext-CdqEcvGC.js";import{S as p}from"./Grid-DlD5tHny.js";import{m as S}from"./makeStyles-Z7w_QLhf.js";import{w as B}from"./appWrappers-xFk9T2x3.js";import"./Search-DjxQHUpj.js";import"./useDebounce-DjFBl-U-.js";import"./translation-DIkRI0pa.js";import"./InputAdornment-Cpt7Vtqb.js";import"./useFormControl-BHHnR_-k.js";import"./Button-CrQJY2kf.js";import"./TextField-DOkdJyZN.js";import"./Select-BllrwJg9.js";import"./index-B9sM2jn7.js";import"./Popover-DXuECRR4.js";import"./Modal-CGrUoTEz.js";import"./Portal-C6ZvXkAX.js";import"./List-BJbmfEoB.js";import"./ListContext-3Q_S_JMo.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-5An11EO7.js";import"./InputLabel-BXTIeKid.js";import"./useAnalytics-C22xHozv.js";import"./useApp-CGYzobcC.js";import"./lodash-D4DPSOUM.js";import"./useAsync-yNTUxeMe.js";import"./useMountedState-BooP3pH9.js";import"./useObservable-Cw9PrxeN.js";import"./useIsomorphicLayoutEffect-B7NJ_Hqy.js";import"./componentData-7p5WJ3gq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Do6NpL29.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-DX_-ON3R.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
