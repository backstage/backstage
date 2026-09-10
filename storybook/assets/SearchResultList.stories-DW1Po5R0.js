import{bQ as e,c8 as o,a4 as h}from"./iframe-B771vieD.js";import{s as y,M as S}from"./api-C9HDd0aR.js";import{c as L}from"./SearchResult-BoSpyGU9.js";import{S as s}from"./SearchResultList-C6GflxJJ.js";import{S as q}from"./SearchContext-TzhaI7eV.js";import{L as f}from"./ListItemText-BZSANmap.js";import{H as x}from"./DefaultResultListItem-Cm_pgK8F.js";import{C as j}from"./icons-UazLyeFK.js";import{O as P,a as C}from"./appWrappers-D1IwQ-h2.js";import{L as w}from"./ListItem-CGxMT5ro.js";import{L as A}from"./ListItemIcon-D29PJJW3.js";import{a as _}from"./Plugin-B0Xdwx1X.js";import{S as R}from"./Grid-CkxOXqgi.js";import{L as W}from"./Link-Rn7tZilw.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Di36h0wy.js";import"./useAsync-BcBtnJm4.js";import"./useMountedState-dJd1Klgy.js";import"./lodash-BCHMAmg_.js";import"./useElementFilter-DKux6gD_.js";import"./componentData-C_g83Z90.js";import"./List-BIqut_Cj.js";import"./ListContext-DWmDADWg.js";import"./translation-EFPAFFb1.js";import"./EmptyState-MyABRRwX.js";import"./makeStyles-C1hpTmTF.js";import"./Progress-nuXGd5Sk.js";import"./LinearProgress-CpLOxIVD.js";import"./Box-DejrWpfY.js";import"./styled-DTppfcCN.js";import"./ResponseErrorPanel-Bfi8QdD0.js";import"./ErrorPanel-Dat7fwYv.js";import"./WarningPanel-CUhE3sHm.js";import"./ExpandMore-DPCBtgki.js";import"./AccordionDetails-DDxhgN0L.js";import"./index-B9sM2jn7.js";import"./Collapse-DfPbUesN.js";import"./MarkdownContent-BpqNXrKd.js";import"./CodeSnippet-BtUGVTYs.js";import"./CopyTextButton-CIf5o04I.js";import"./useCopyToClipboard-9J0wh51n.js";import"./Tooltip-X4bjTRJ1.js";import"./useObjectRef-B_q1TfVk.js";import"./useOverlayTriggerState-e3hiHQi-.js";import"./utils-piiChbE4.js";import"./useFocusRing-C2ykLkBs.js";import"./openLink-AzCo47yl.js";import"./number-b5ov0AaU.js";import"./I18nProvider-B3qRoePR.js";import"./useControlledState-xxmVxo9Z.js";import"./animation-CfBUvVtR.js";import"./useHover-B_jF8Yhh.js";import"./ButtonIcon-DMq-EbIm.js";import"./Button-B8TxKSC7.js";import"./Label-CJhGoTGL.js";import"./Hidden-DiCVpsT2.js";import"./useLabel-CXc7CDh8.js";import"./useLabels-2XgX8oa0.js";import"./useButton-CAudcQRr.js";import"./usePress-CNqwnYXg.js";import"./textSelection-Dajp4U4D.js";import"./index-DGRdaIIA.js";import"./Divider-loRxfWr4.js";import"./useApp-CmxPLI0J.js";import"./WebStorage-BSrayqdC.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D1IO1a8O.js";import"./useIsomorphicLayoutEffect-BHnU40rP.js";import"./BUIProvider-Bo_MB1ar.js";import"./BUIRoutingProvider-CA0Vr8wC.js";import"./useResolvedHref-N95SPT_C.js";import"./useRouteRef-W2fREn2c.js";import"./index-DUu8846e.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
