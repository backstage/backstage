const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-EtzPT73s.js","./iframe-DC0HuKGF.js","./preload-helper-PPVm8Dsz.js","./iframe-Bp3akXZ8.css","./Search-xpbqMMGb.js","./useDebounce-BBDL4OCc.js","./translation-BeJ9cqj6.js","./SearchContext-D_r8S1EG.js","./lodash-CrNJApB2.js","./useAsync-pX4Qh_w3.js","./useMountedState-DsJQXF1h.js","./api-qFrVV7Y9.js","./useAnalytics-BaWCJwCB.js","./InputAdornment-BtLTJVZn.js","./useFormControl-C9u7aH6n.js","./Button-DV2xQJT-.js","./TextField-Bg7cslY6.js","./Select-DnZ_kkyZ.js","./index-B9sM2jn7.js","./Popover-DGTyTaBx.js","./Modal-BmT395tY.js","./Portal-BQrNoYBv.js","./List-CssDjDLP.js","./ListContext-P3rTeiNo.js","./formControlState-ByiNFc8I.js","./FormLabel-DDi_9Eij.js","./InputLabel-DNeoskIJ.js","./useApp-qCrtr9Gq.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-DC0HuKGF.js";import{s as d,M as l}from"./api-qFrVV7Y9.js";import{SearchBar as m}from"./SearchBar-EtzPT73s.js";import{S as h}from"./SearchContext-D_r8S1EG.js";import{S as p}from"./Grid-B4PBabAQ.js";import{m as S}from"./makeStyles-CdFTekTr.js";import{w as B}from"./appWrappers-tP4ySi-x.js";import"./Search-xpbqMMGb.js";import"./useDebounce-BBDL4OCc.js";import"./translation-BeJ9cqj6.js";import"./InputAdornment-BtLTJVZn.js";import"./useFormControl-C9u7aH6n.js";import"./Button-DV2xQJT-.js";import"./TextField-Bg7cslY6.js";import"./Select-DnZ_kkyZ.js";import"./index-B9sM2jn7.js";import"./Popover-DGTyTaBx.js";import"./Modal-BmT395tY.js";import"./Portal-BQrNoYBv.js";import"./List-CssDjDLP.js";import"./ListContext-P3rTeiNo.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DDi_9Eij.js";import"./InputLabel-DNeoskIJ.js";import"./useAnalytics-BaWCJwCB.js";import"./useApp-qCrtr9Gq.js";import"./lodash-CrNJApB2.js";import"./useAsync-pX4Qh_w3.js";import"./useMountedState-DsJQXF1h.js";import"./useObservable-CHbz0Rru.js";import"./useIsomorphicLayoutEffect-Btshp-T3.js";import"./componentData-D6GUiLTG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-B88MtuqO.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-EtzPT73s.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
