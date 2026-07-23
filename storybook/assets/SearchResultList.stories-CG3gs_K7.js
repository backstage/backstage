import{bR as e,ca as o,a5 as h}from"./iframe-DEB_XKCy.js";import{s as y,M as S}from"./api-B9w8CkOm.js";import{c as L}from"./SearchResult-DxAcb_nV.js";import{S as s}from"./SearchResultList-DcZaMVNH.js";import{S as q}from"./SearchContext-DpHadVhq.js";import{L as f}from"./ListItemText-_AAoWrN6.js";import{H as x}from"./DefaultResultListItem-Dm2Eq3RA.js";import{C as j}from"./icons-DIujA34m.js";import{O as P,a as C}from"./appWrappers-DFGeGni4.js";import{L as w}from"./ListItem-D1TJUFze.js";import{L as A}from"./ListItemIcon-BNdpuNRU.js";import{a as _}from"./Plugin-CgWyydXj.js";import{S as R}from"./Grid-CEjxPXH5.js";import{L as W}from"./Link-BIYNobCf.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-mLXG6yYh.js";import"./useAsync-BJgBDT4m.js";import"./useMountedState-_5Y0jkw3.js";import"./lodash-fMOpK_K8.js";import"./useElementFilter-BXm3gMDg.js";import"./componentData-CJh87H7J.js";import"./List-BRkGi2Sl.js";import"./ListContext-4fnJmzGu.js";import"./translation-Gt4B-NZx.js";import"./EmptyState-CeWz8CtQ.js";import"./makeStyles-C8eWtwMZ.js";import"./Progress-JGv9Li3g.js";import"./LinearProgress-BvnO3mIw.js";import"./Box-DFSyaomf.js";import"./styled-EI2gKmN5.js";import"./ResponseErrorPanel-46HUdysw.js";import"./ErrorPanel-CkpQwtYQ.js";import"./WarningPanel-BO4revjh.js";import"./ExpandMore-D1Fu8MfR.js";import"./AccordionDetails-9KpCPVWq.js";import"./index-B9sM2jn7.js";import"./Collapse-CxwyE9Og.js";import"./MarkdownContent-Bmux6UAj.js";import"./CodeSnippet-BBeCJGrA.js";import"./CopyTextButton-DF3B6Ur_.js";import"./useCopyToClipboard-4UnV7oUY.js";import"./Tooltip-DtgnmWuT.js";import"./useObjectRef-Ctp5tGlo.js";import"./useOverlayTriggerState-Bzrpe4h8.js";import"./utils-CrlF93yQ.js";import"./useFocusRing-DOwaR7bd.js";import"./openLink-D4lCVjTw.js";import"./number-DUI_xCBM.js";import"./I18nProvider-BHXvn5NR.js";import"./useControlledState-CdUkXr5H.js";import"./animation-EQr5ceW1.js";import"./useHover-BBgMw-bK.js";import"./ButtonIcon-BmcRjrhZ.js";import"./Button-CD6RS4NW.js";import"./Label-CunX4hTS.js";import"./Hidden-Bcf80zYT.js";import"./useLabel-CTUJJsAz.js";import"./useLabels-BcoDEarN.js";import"./useButton-DVtgz3c1.js";import"./usePress-RLqNI-Pb.js";import"./textSelection-LJfdl7Co.js";import"./index-BI-bQJz8.js";import"./Divider-D9LukFhi.js";import"./useApp-VyPYetGM.js";import"./WebStorage-JrbYnOHF.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BQQ3G4GS.js";import"./useIsomorphicLayoutEffect-DphXrB2X.js";import"./BUIProvider-DyDpRobm.js";import"./useResolvedHref-BeosGf4u.js";import"./useRouteRef-NhK-xxXj.js";import"./index-D9sSfquE.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
