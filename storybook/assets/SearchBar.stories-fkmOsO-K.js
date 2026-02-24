const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Bmp1rvGj.js","./iframe-n0fImp44.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-BwgABF7c.js","./useDebounce-BeMcBey_.js","./translation-DCc4tQWw.js","./SearchContext-B6K2-AbH.js","./lodash-W9bRznJ2.js","./useAsync-BaYKehuj.js","./useMountedState-2Tq8J5yq.js","./api-BSllHYH-.js","./useAnalytics-Z90ozCE5.js","./InputAdornment-D8JAgJ6_.js","./useFormControl-X2sPpEO-.js","./Button-CvgGVM_K.js","./TextField-BvYJTarc.js","./Select-B9EAlykS.js","./index-B9sM2jn7.js","./Popover-CxSL2zjC.js","./Modal-BKH7lGiL.js","./Portal-DaF9Kh8d.js","./List-B1pnwKZO.js","./ListContext-BL95jnEy.js","./formControlState-ByiNFc8I.js","./FormLabel-Dg5xWOWF.js","./InputLabel-CQAfhFwr.js","./useApp-8qQHYFVi.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-n0fImp44.js";import{s as d,M as l}from"./api-BSllHYH-.js";import{SearchBar as m}from"./SearchBar-Bmp1rvGj.js";import{S as h}from"./SearchContext-B6K2-AbH.js";import{S as p}from"./Grid-XRj5X-dC.js";import{m as S}from"./makeStyles-7xRdzCom.js";import{w as B}from"./appWrappers-Zn1Dzz5V.js";import"./Search-BwgABF7c.js";import"./useDebounce-BeMcBey_.js";import"./translation-DCc4tQWw.js";import"./InputAdornment-D8JAgJ6_.js";import"./useFormControl-X2sPpEO-.js";import"./Button-CvgGVM_K.js";import"./TextField-BvYJTarc.js";import"./Select-B9EAlykS.js";import"./index-B9sM2jn7.js";import"./Popover-CxSL2zjC.js";import"./Modal-BKH7lGiL.js";import"./Portal-DaF9Kh8d.js";import"./List-B1pnwKZO.js";import"./ListContext-BL95jnEy.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-Dg5xWOWF.js";import"./InputLabel-CQAfhFwr.js";import"./useAnalytics-Z90ozCE5.js";import"./useApp-8qQHYFVi.js";import"./lodash-W9bRznJ2.js";import"./useAsync-BaYKehuj.js";import"./useMountedState-2Tq8J5yq.js";import"./useObservable-CVilGQrk.js";import"./useIsomorphicLayoutEffect-Dw9zUxRi.js";import"./componentData-CRFypemT.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DIbljhmp.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-Bmp1rvGj.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
