import{j as r,r as s,a0 as n,a1 as m,a2 as d,a3 as c}from"./iframe-DvAQ9TL9.js";import{F as a}from"./FavoriteToggle--fTWTyKm.js";import{w as v}from"./appWrappers-cPpGWhaa.js";import"./preload-helper-PPVm8Dsz.js";import"./Tooltip-Do0H6o91.js";import"./Popper-DAdC7LWr.js";import"./Portal-CZWMCv81.js";import"./makeStyles-DIoIr_Gz.js";import"./icons-LdYnHCT4.js";import"./useApp-Ce7sGxgT.js";import"./useObservable-CCRlVb_e.js";import"./useIsomorphicLayoutEffect-FaLrxtUy.js";import"./useAnalytics-Dn-hivLl.js";import"./useAsync-BrqKzDbu.js";import"./useMountedState-CA4Rdt3V.js";import"./componentData-D5jAi7Lb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Bpd4QHCD.js";const B={title:"Core/FavoriteToggle",component:a,decorators:[o=>v(r.jsx(o,{}))],tags:["!manifest"]},e=()=>{const[o,i]=s.useState(!1);return r.jsx(a,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})},p=m({...d({palette:c.dark}),components:{BackstageFavoriteToggleIcon:{styleOverrides:{icon:()=>({color:"aqua"}),iconBorder:()=>({color:"white"})}}}}),t=()=>{const[o,i]=s.useState(!1);return r.jsx(n,{theme:p,children:r.jsx(a,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"WithThemeOverride"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <FavoriteToggle
      id="favorite-toggle"
      title="Add entity to favorites"
      isFavorite={isFavorite}
      onToggle={setFavorite}
    />
  );
};
`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const WithThemeOverride = () => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <UnifiedThemeProvider theme={theme}>
      <FavoriteToggle
        id="favorite-toggle"
        title="Add entity to favorites"
        isFavorite={isFavorite}
        onToggle={setFavorite}
      />
    </UnifiedThemeProvider>
  );
};
`,...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const [isFavorite, setFavorite] = useState(false);
  return <FavoriteToggle id="favorite-toggle" title="Add entity to favorites" isFavorite={isFavorite} onToggle={setFavorite} />;
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const [isFavorite, setFavorite] = useState(false);
  return <UnifiedThemeProvider theme={theme}>
      <FavoriteToggle id="favorite-toggle" title="Add entity to favorites" isFavorite={isFavorite} onToggle={setFavorite} />
    </UnifiedThemeProvider>;
}`,...t.parameters?.docs?.source}}};const E=["Default","WithThemeOverride"];export{e as Default,t as WithThemeOverride,E as __namedExportsOrder,B as default};
