import{bQ as e,c8 as o,a4 as h}from"./iframe-CJeP2vvm.js";import{s as y,M as S}from"./api-CfEdcScA.js";import{c as L}from"./SearchResult-DL9H0Z6S.js";import{S as s}from"./SearchResultList-BPXPFNlS.js";import{S as q}from"./SearchContext-CGNmnvTx.js";import{L as f}from"./ListItemText-8DdXN6RA.js";import{H as x}from"./DefaultResultListItem-2upde_fj.js";import{C as j}from"./icons-CYjrWhbC.js";import{O as P,a as C}from"./appWrappers-D5u8a8ls.js";import{L as w}from"./ListItem-Dr_x9euU.js";import{L as A}from"./ListItemIcon-C0R3CNiT.js";import{a as _}from"./Plugin-oIYVuWiP.js";import{S as R}from"./Grid-udHwzQNb.js";import{L as W}from"./Link--Fc6A4Yf.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-De2cbPtm.js";import"./useAsync-CUJKoC7E.js";import"./useMountedState-BT60qhs5.js";import"./lodash-LkEJAKVD.js";import"./useElementFilter-CzQn0qGA.js";import"./componentData-Dr1PaZhI.js";import"./List-CzxNgMf8.js";import"./ListContext-CAbC7OWa.js";import"./translation-CZ7Ni9_h.js";import"./EmptyState-80qcPm4R.js";import"./makeStyles-CtzsXOCL.js";import"./Progress-B5ZcNPgN.js";import"./LinearProgress-BShqyqsv.js";import"./Box-EvvPk6ng.js";import"./styled-CFBPwnSz.js";import"./ResponseErrorPanel-BZpANGTn.js";import"./ErrorPanel-D6j0V2Ak.js";import"./WarningPanel-B7xyxMmr.js";import"./ExpandMore-BvAXGe0b.js";import"./AccordionDetails-BMIMOQ7y.js";import"./index-B9sM2jn7.js";import"./Collapse-D3B3pAYG.js";import"./MarkdownContent-DMAI3FnV.js";import"./CodeSnippet-Drggz90x.js";import"./CopyTextButton-Dmjgnv5K.js";import"./useCopyToClipboard-zy_unyJQ.js";import"./Tooltip-DzyZsiuV.js";import"./useObjectRef-C-2dJx3K.js";import"./useOverlayTriggerState-Drctaywp.js";import"./utils-Ci9aOot6.js";import"./useFocusRing-o6_0h1DB.js";import"./openLink-Dw-jVqrV.js";import"./number-BSFxjcvW.js";import"./I18nProvider-C7P3l0dN.js";import"./useControlledState-CqCclfwn.js";import"./animation-CvMuFemQ.js";import"./useHover-Bg3BX-Db.js";import"./ButtonIcon-DHwAGLxp.js";import"./Button-BDYf5QxC.js";import"./Label-D4bUC6Na.js";import"./Hidden-BDNd3cL9.js";import"./useLabel-CmJz89mn.js";import"./useLabels-DRlool0j.js";import"./useButton-DUAdcx1U.js";import"./usePress-BBcvFLiN.js";import"./textSelection-C5htZZfI.js";import"./index-DyrFOjzE.js";import"./Divider-DTCcGHVc.js";import"./useApp-CK6pVRGl.js";import"./WebStorage-CTW9J7rK.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BrAie7q7.js";import"./useIsomorphicLayoutEffect-CyOi9XEE.js";import"./BUIProvider-Di2647ue.js";import"./BUIRoutingProvider-B_ktoSaA.js";import"./useResolvedHref-DW2cHm9P.js";import"./useRouteRef-yMd4s_24.js";import"./index-BPSuVA-o.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const rt=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,rt as __namedExportsOrder,tt as default};
