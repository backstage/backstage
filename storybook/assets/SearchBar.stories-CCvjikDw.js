const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BIwiphER.js","./iframe-ONoB0Qo9.js","./preload-helper-PPVm8Dsz.js","./iframe-B_oWJXoW.css","./Search-CjuTdGtU.js","./useDebounce-3sWWTQ-t.js","./translation-CdEyx7dS.js","./SearchContext-CR3I0-uI.js","./lodash-BHbbKwIp.js","./useAsync-Bxn3NH_j.js","./useMountedState-BkZqADEE.js","./api-C4l3NUen.js","./useAnalytics-Dfpcn-Os.js","./InputAdornment-Dip6gS-i.js","./useFormControl-CcFIJveN.js","./Button-BmqRVCQk.js","./TextField-puXQDIDz.js","./Select-CvrGAMpQ.js","./index-B9sM2jn7.js","./Popover-BHOdxM3Q.js","./Modal-DIHdFi4H.js","./Portal-B76g_OhK.js","./List-BrOrhSy2.js","./ListContext-DWK5PcRa.js","./formControlState-ByiNFc8I.js","./FormLabel-PnIKs-UG.js","./InputLabel-CpGLk1P6.js","./useApp-Bpmtfts2.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-ONoB0Qo9.js";import{s as d,M as l}from"./api-C4l3NUen.js";import{SearchBar as m}from"./SearchBar-BIwiphER.js";import{S as h}from"./SearchContext-CR3I0-uI.js";import{S as p}from"./Grid-Bsj_4SyV.js";import{m as S}from"./makeStyles-dBjLM41z.js";import{w as B}from"./appWrappers-DtFB9wFA.js";import"./Search-CjuTdGtU.js";import"./useDebounce-3sWWTQ-t.js";import"./translation-CdEyx7dS.js";import"./InputAdornment-Dip6gS-i.js";import"./useFormControl-CcFIJveN.js";import"./Button-BmqRVCQk.js";import"./TextField-puXQDIDz.js";import"./Select-CvrGAMpQ.js";import"./index-B9sM2jn7.js";import"./Popover-BHOdxM3Q.js";import"./Modal-DIHdFi4H.js";import"./Portal-B76g_OhK.js";import"./List-BrOrhSy2.js";import"./ListContext-DWK5PcRa.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-PnIKs-UG.js";import"./InputLabel-CpGLk1P6.js";import"./useAnalytics-Dfpcn-Os.js";import"./useApp-Bpmtfts2.js";import"./lodash-BHbbKwIp.js";import"./useAsync-Bxn3NH_j.js";import"./useMountedState-BkZqADEE.js";import"./useObservable-BM0-m4YT.js";import"./useIsomorphicLayoutEffect-CLcJoxBM.js";import"./componentData-B5_0x5Xz.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-D2HI0Bg7.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-BIwiphER.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
