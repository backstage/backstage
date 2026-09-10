import{bQ as e,c8 as o,a4 as h}from"./iframe-BjdV6pPy.js";import{s as y,M as S}from"./api-DCgXs1lz.js";import{c as L}from"./SearchResult-ar0GZR2K.js";import{S as s}from"./SearchResultList-BXW2t6Dr.js";import{S as q}from"./SearchContext-B9wo7j7X.js";import{L as f}from"./ListItemText-CMQK_Tem.js";import{H as x}from"./DefaultResultListItem-DNNHl_AT.js";import{C as j}from"./icons-BiMEYnl4.js";import{O as P,a as C}from"./appWrappers-C5iPRsOT.js";import{L as w}from"./ListItem-CihulhwT.js";import{L as A}from"./ListItemIcon-DitPl7-w.js";import{a as _}from"./Plugin-DJ3rcgJI.js";import{S as R}from"./Grid-ZTRqCXbs.js";import{L as W}from"./Link-q9zDyQ1s.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BS2qsBtP.js";import"./useAsync-CXf74ZGw.js";import"./useMountedState-D5k_dox-.js";import"./lodash-Diin1sQj.js";import"./useElementFilter-H5wMGhwm.js";import"./componentData-7cSKP3EG.js";import"./List-5AuHBILY.js";import"./ListContext-Cz3i0xyJ.js";import"./translation-CQuOkf-v.js";import"./EmptyState-agVYjh2y.js";import"./makeStyles-PWq3kkan.js";import"./Progress-OdMvFB6U.js";import"./LinearProgress-DKU7B6Lm.js";import"./Box-CGkRuXu1.js";import"./styled-CGu5BtQw.js";import"./ResponseErrorPanel-CvOYI3a2.js";import"./ErrorPanel-ClIxziH4.js";import"./WarningPanel-k0bYlxSq.js";import"./ExpandMore-BtQI-HHY.js";import"./AccordionDetails-BUva2n36.js";import"./index-B9sM2jn7.js";import"./Collapse-C-HZGOOx.js";import"./MarkdownContent-BsLy_-C7.js";import"./CodeSnippet-BGIHtbkn.js";import"./CopyTextButton-Baj9whgw.js";import"./useCopyToClipboard-DunXi1VD.js";import"./Tooltip-CBiKcEb6.js";import"./useObjectRef-BWm5y5ll.js";import"./useOverlayTriggerState-CHBpPTe6.js";import"./utils-DS91ArTN.js";import"./useFocusRing-BtM4iWFp.js";import"./openLink-2_8aeNBf.js";import"./number-DfMxFCvL.js";import"./I18nProvider-C9qy98Iq.js";import"./useControlledState-CC4OZRef.js";import"./animation-CUNcUTdh.js";import"./useHover-wrMqleU9.js";import"./ButtonIcon-DOguw-E3.js";import"./Button-BT4zDcIq.js";import"./Label-wgpa9Qzo.js";import"./Hidden-CWD5f7cO.js";import"./useLabel-rYSXIktO.js";import"./useLabels-BRtq5QIX.js";import"./useButton-Ds0I4pCp.js";import"./usePress-CbZGFUaz.js";import"./textSelection-Bw3EsPUC.js";import"./index-Bt664Isb.js";import"./Divider-4oCyrbP3.js";import"./useApp-BEYDC2Xe.js";import"./WebStorage-CIiGz18F.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Czrr2fJd.js";import"./useIsomorphicLayoutEffect-Bc7-73bB.js";import"./BUIProvider-hQPe3HQo.js";import"./BUIRoutingProvider-a7k64s_W.js";import"./useResolvedHref-CbsOzEeI.js";import"./useRouteRef-Bipsn3ev.js";import"./index-DF9y2Kef.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
