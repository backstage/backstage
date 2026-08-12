import{bR as e,ca as o,a5 as h}from"./iframe-D690ZVKa.js";import{s as y,M as S}from"./api-Bm1WjpwE.js";import{c as L}from"./SearchResult-CFVHghqO.js";import{S as s}from"./SearchResultList-qvPUDRqz.js";import{S as q}from"./SearchContext-Boda9k3S.js";import{L as f}from"./ListItemText-BIcwxM7j.js";import{H as x}from"./DefaultResultListItem-CqdFqDod.js";import{C as j}from"./icons-Id6Hhiy4.js";import{O as P,a as C}from"./appWrappers-BZe8iQ_o.js";import{L as w}from"./ListItem-CPGGfXK8.js";import{L as A}from"./ListItemIcon-Bl-wpoe7.js";import{a as _}from"./Plugin-DnW7xBpV.js";import{S as R}from"./Grid-DmtR5II5.js";import{L as W}from"./Link-DmZ9GlNp.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-kpSi9Kln.js";import"./useAsync-DBQ95kua.js";import"./useMountedState-DeFYtrKF.js";import"./lodash-CaHtv1AU.js";import"./useElementFilter-B1811Oc6.js";import"./componentData-CKl13ENg.js";import"./List-CzjBo6qt.js";import"./ListContext-Ckz_Cnm1.js";import"./translation-CIkFdPmB.js";import"./EmptyState-DAnoDRtS.js";import"./makeStyles-CJxbGC76.js";import"./Progress-FMuJbSDs.js";import"./LinearProgress-CgFyH3Zt.js";import"./Box-D2Fu4WUc.js";import"./styled-DacKj83C.js";import"./ResponseErrorPanel-C_WOgose.js";import"./ErrorPanel-sSWmcc6L.js";import"./WarningPanel-BAcnD7kk.js";import"./ExpandMore-7P9uOlxg.js";import"./AccordionDetails-Cc9F9Oiq.js";import"./index-B9sM2jn7.js";import"./Collapse-st5wW4EU.js";import"./MarkdownContent-DqF9sZOe.js";import"./CodeSnippet-CxNRGzQC.js";import"./CopyTextButton-W47bcblk.js";import"./useCopyToClipboard-DCigtZZK.js";import"./Tooltip-DRJYQ9XX.js";import"./useObjectRef-BPqBfMfb.js";import"./useOverlayTriggerState-CBv8lv31.js";import"./utils-D1ifMOcR.js";import"./useFocusRing-CBblcblV.js";import"./openLink-DlPHZOe9.js";import"./number-CGXALLEc.js";import"./I18nProvider-D9TsogMC.js";import"./useControlledState-S0N1AjAP.js";import"./animation-C9FyvRVk.js";import"./useHover-Da9hkWGW.js";import"./ButtonIcon-D1vSayV3.js";import"./Button-DsupNxvN.js";import"./Label-CHMEqKLB.js";import"./Hidden--Qykx-Ic.js";import"./useLabel-Bv75J3A8.js";import"./useLabels-D2HAWa9S.js";import"./useButton-D0OzxRTD.js";import"./usePress-BTPot_r7.js";import"./textSelection-30hfHS5F.js";import"./index-Bm8BO3VD.js";import"./Divider-BFUcZtpI.js";import"./useApp-RZivroMa.js";import"./WebStorage-uZ9ub4fb.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BMbSJ5w0.js";import"./useIsomorphicLayoutEffect-DBN132Yc.js";import"./BUIProvider-B1wDIoUd.js";import"./useResolvedHref-DuunraQu.js";import"./useRouteRef-Cg4uZNai.js";import"./index-DrXFpTpJ.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>;
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <SearchResultList query={query} />;
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {})
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {
      throw new Error();
    })
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} noResultsComponent={<ListItemText primary="No results were found" />} />
    </TestApiProvider>;
}`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultList query={query} renderResultItem={({
    type,
    document,
    highlight,
    rank
  }) => {
    switch (type) {
      case 'custom':
        return <CustomResultListItem key={document.location} icon={<CatalogIcon />} result={document} highlight={highlight} rank={rank} />;
      default:
        return <DefaultResultListItem key={document.location} result={document} />;
    }
  }} />;
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultSearchResultListItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResultList query={query}>
      <DefaultSearchResultListItem />
    </SearchResultList>;
}`,...d.parameters?.docs?.source}}};const tt=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,tt as __namedExportsOrder,et as default};
