const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-1mp1VpzP.js","./iframe--eVtoH1I.js","./preload-helper-PPVm8Dsz.js","./iframe-EGYOZfd6.css","./Search-BwtnGImO.js","./useDebounce-CGhatMJ8.js","./translation-DaUCzIbx.js","./SearchContext-DYlOyC5b.js","./lodash-CSJy54S8.js","./useAsync-DFhVL4JZ.js","./useMountedState-BJxTErpD.js","./api-DZYXRl_N.js","./useAnalytics-BkWkZjko.js","./InputAdornment-BSgHvUY5.js","./useFormControl-Cchc_mew.js","./Button-DoStUTVe.js","./TextField-B_KzoZw0.js","./Select-DsvmoJmP.js","./index-B9sM2jn7.js","./Popover-Csu5u7SS.js","./Modal-KRqUqHvk.js","./Portal-Cqdnd4y_.js","./List-erwGNY81.js","./ListContext-Dy_vV088.js","./formControlState-ByiNFc8I.js","./FormLabel-B5zN99Ip.js","./InputLabel-cARoGg0v.js","./useApp-Br_-UhXC.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe--eVtoH1I.js";import{s as d,M as l}from"./api-DZYXRl_N.js";import{SearchBar as m}from"./SearchBar-1mp1VpzP.js";import{S as h}from"./SearchContext-DYlOyC5b.js";import{S as p}from"./Grid-BxPVFZFG.js";import{m as S}from"./makeStyles-qwoBpcZQ.js";import{w as B}from"./appWrappers-v3G2RnN5.js";import"./Search-BwtnGImO.js";import"./useDebounce-CGhatMJ8.js";import"./translation-DaUCzIbx.js";import"./InputAdornment-BSgHvUY5.js";import"./useFormControl-Cchc_mew.js";import"./Button-DoStUTVe.js";import"./TextField-B_KzoZw0.js";import"./Select-DsvmoJmP.js";import"./index-B9sM2jn7.js";import"./Popover-Csu5u7SS.js";import"./Modal-KRqUqHvk.js";import"./Portal-Cqdnd4y_.js";import"./List-erwGNY81.js";import"./ListContext-Dy_vV088.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-B5zN99Ip.js";import"./InputLabel-cARoGg0v.js";import"./useAnalytics-BkWkZjko.js";import"./useApp-Br_-UhXC.js";import"./lodash-CSJy54S8.js";import"./useAsync-DFhVL4JZ.js";import"./useMountedState-BJxTErpD.js";import"./useObservable-DePp3QoV.js";import"./useIsomorphicLayoutEffect-BBXBH1QW.js";import"./componentData-ap8ACm6K.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-btJptzr1.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-1mp1VpzP.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
