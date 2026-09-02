import{bQ as e,c8 as o,a4 as h}from"./iframe-BiC6vzfc.js";import{s as y,M as S}from"./api-C7zv9PAa.js";import{c as L}from"./SearchResult-CjLSgTUT.js";import{S as s}from"./SearchResultList-C73om8B3.js";import{S as q}from"./SearchContext-07k7kWth.js";import{L as f}from"./ListItemText-DbI1WcNJ.js";import{H as x}from"./DefaultResultListItem-B70YXFG4.js";import{C as j}from"./icons-Dg3lzklB.js";import{O as P,a as C}from"./appWrappers-D9Cr-qww.js";import{L as w}from"./ListItem-Bm0RnmVU.js";import{L as A}from"./ListItemIcon-DbJZ8Es6.js";import{a as _}from"./Plugin-GMqqlhqe.js";import{S as R}from"./Grid-5kX5iYpE.js";import{L as W}from"./Link-BBWT3DGx.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CWeTU5_6.js";import"./useAsync-BfvsCM6Z.js";import"./useMountedState-rwLvoT14.js";import"./lodash-CmicG8li.js";import"./useElementFilter-BYl3zeM6.js";import"./componentData-BSbf9b0a.js";import"./List-DJtEB1Fe.js";import"./ListContext-127C_KA8.js";import"./translation-CSCAcoJs.js";import"./EmptyState-Lo2vOjfT.js";import"./makeStyles-BTRKbQbn.js";import"./Progress-CjijHw8-.js";import"./LinearProgress-CwZQGUib.js";import"./Box-CGVVs5_5.js";import"./styled-BNPRS9hw.js";import"./ResponseErrorPanel-D1rjR2zb.js";import"./ErrorPanel-C1h2VdJ6.js";import"./WarningPanel-eIVpFTHC.js";import"./ExpandMore-Dv72LSow.js";import"./AccordionDetails-CuhjeHp2.js";import"./index-B9sM2jn7.js";import"./Collapse-CdOLWtqx.js";import"./MarkdownContent-f-GJNKWd.js";import"./CodeSnippet-B3kU0HP_.js";import"./CopyTextButton-fAT1swaV.js";import"./useCopyToClipboard-EtHc7wba.js";import"./Tooltip-B5bHPnfj.js";import"./useObjectRef-rJAA83qf.js";import"./useOverlayTriggerState-CjTLIV8R.js";import"./utils-BQPJ15nW.js";import"./useFocusRing-CYz7DZLf.js";import"./openLink-fglnGFM4.js";import"./number-CQJyNM_c.js";import"./I18nProvider-DJaDCNar.js";import"./useControlledState-CjMsoNHV.js";import"./animation-89PtgvT4.js";import"./useHover-CRtjWjkD.js";import"./ButtonIcon-pfvj9qzl.js";import"./Button-CSCohGDT.js";import"./Label-Dt81RO29.js";import"./Hidden-DdtniuZ_.js";import"./useLabel-CfyoKpiQ.js";import"./useLabels-Kk8q7j9x.js";import"./useButton-EPm5NcFx.js";import"./usePress-Czxg5-q_.js";import"./textSelection-BLan3Cos.js";import"./index-BGy42kW1.js";import"./Divider-DflaO4gg.js";import"./useApp-CsAmf1u2.js";import"./WebStorage-Cp2ehJip.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CNB7CHhj.js";import"./useIsomorphicLayoutEffect-VRDt432r.js";import"./BUIProvider-DEMxJ951.js";import"./BUIRoutingProvider-ht1fdH5F.js";import"./useResolvedHref-G7FW9UOs.js";import"./useRouteRef-BkmsmyAx.js";import"./index-HANU7tPZ.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
