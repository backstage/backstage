const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CQzFr7BV.js","./iframe-BmigQEv-.js","./preload-helper-PPVm8Dsz.js","./iframe-Bp3akXZ8.css","./Search-DuocKKhp.js","./useDebounce-Fqcw51g_.js","./translation-DVFD9jnp.js","./SearchContext-BXNtrlBt.js","./lodash-BZheRUGK.js","./useAsync-kJRCmhqz.js","./useMountedState-DFB9Hb7L.js","./api-y-CS0LOC.js","./useAnalytics-Cv3q-2FZ.js","./InputAdornment-bqHK7bE_.js","./useFormControl-DE4q5ARv.js","./Button-lq2xJD9H.js","./TextField-Iy4_7lHj.js","./Select-Ds8DNeOJ.js","./index-B9sM2jn7.js","./Popover-CBw5Z0ap.js","./Modal-DG7NhvRI.js","./Portal-BhbQiPPq.js","./List-DPvCCYNu.js","./ListContext-DDrpeIYl.js","./formControlState-ByiNFc8I.js","./FormLabel-DdUqLGGh.js","./InputLabel-DFtm2ncK.js","./useApp-CTkrqPOE.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-BmigQEv-.js";import{s as d,M as l}from"./api-y-CS0LOC.js";import{SearchBar as m}from"./SearchBar-CQzFr7BV.js";import{S as h}from"./SearchContext-BXNtrlBt.js";import{S as p}from"./Grid-BZioZTwU.js";import{m as S}from"./makeStyles-0-n1Rujo.js";import{w as B}from"./appWrappers-mMtjOYp0.js";import"./Search-DuocKKhp.js";import"./useDebounce-Fqcw51g_.js";import"./translation-DVFD9jnp.js";import"./InputAdornment-bqHK7bE_.js";import"./useFormControl-DE4q5ARv.js";import"./Button-lq2xJD9H.js";import"./TextField-Iy4_7lHj.js";import"./Select-Ds8DNeOJ.js";import"./index-B9sM2jn7.js";import"./Popover-CBw5Z0ap.js";import"./Modal-DG7NhvRI.js";import"./Portal-BhbQiPPq.js";import"./List-DPvCCYNu.js";import"./ListContext-DDrpeIYl.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DdUqLGGh.js";import"./InputLabel-DFtm2ncK.js";import"./useAnalytics-Cv3q-2FZ.js";import"./useApp-CTkrqPOE.js";import"./lodash-BZheRUGK.js";import"./useAsync-kJRCmhqz.js";import"./useMountedState-DFB9Hb7L.js";import"./useObservable-BQVD3ffY.js";import"./useIsomorphicLayoutEffect-BK5x3ypD.js";import"./componentData-DQLrmcS3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BfwtKwvN.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-CQzFr7BV.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
