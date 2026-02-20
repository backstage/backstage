const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Cq0fuvcg.js","./iframe-BAAMxX04.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-B7w66D-U.js","./useDebounce-yki-Udw8.js","./translation-D_MILFGb.js","./SearchContext-Cijymp9H.js","./lodash-BcT4sL41.js","./useAsync-CkD-aj1D.js","./useMountedState-BHWFcdPM.js","./api-50As9r0t.js","./useAnalytics-BSrF4G5O.js","./InputAdornment-BzZL-mff.js","./useFormControl-D3IphLUA.js","./Button-BpZ_upXh.js","./TextField-BaQblRlm.js","./Select-x1Dasmcz.js","./index-B9sM2jn7.js","./Popover-Dneg8xTB.js","./Modal-D0ZnfcKK.js","./Portal-DE326cIY.js","./List-CWixwH1G.js","./ListContext-COr9ityP.js","./formControlState-ByiNFc8I.js","./FormLabel-BvXXxiUo.js","./InputLabel-CSL6nw83.js","./useApp-CvcYQqjl.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-BAAMxX04.js";import{s as d,M as l}from"./api-50As9r0t.js";import{SearchBar as m}from"./SearchBar-Cq0fuvcg.js";import{S as h}from"./SearchContext-Cijymp9H.js";import{S as p}from"./Grid-bsc20U2v.js";import{m as S}from"./makeStyles-Gcd-M5aY.js";import{w as B}from"./appWrappers-BmtnESU-.js";import"./Search-B7w66D-U.js";import"./useDebounce-yki-Udw8.js";import"./translation-D_MILFGb.js";import"./InputAdornment-BzZL-mff.js";import"./useFormControl-D3IphLUA.js";import"./Button-BpZ_upXh.js";import"./TextField-BaQblRlm.js";import"./Select-x1Dasmcz.js";import"./index-B9sM2jn7.js";import"./Popover-Dneg8xTB.js";import"./Modal-D0ZnfcKK.js";import"./Portal-DE326cIY.js";import"./List-CWixwH1G.js";import"./ListContext-COr9ityP.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BvXXxiUo.js";import"./InputLabel-CSL6nw83.js";import"./useAnalytics-BSrF4G5O.js";import"./useApp-CvcYQqjl.js";import"./lodash-BcT4sL41.js";import"./useAsync-CkD-aj1D.js";import"./useMountedState-BHWFcdPM.js";import"./useObservable-DYc4zXP3.js";import"./useIsomorphicLayoutEffect-DhTuVqBh.js";import"./componentData-f2u_HJXq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DV_MCKd1.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-Cq0fuvcg.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
