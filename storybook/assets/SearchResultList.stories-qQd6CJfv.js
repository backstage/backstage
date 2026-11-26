import{j as e,r as o,X as h}from"./iframe-7sCYbwMA.js";import{s as y,M as S}from"./api-DklWt_2o.js";import{c as L}from"./SearchResult-Brf6lDVM.js";import{S as s}from"./SearchResultList-DXx7z0uU.js";import{S as q}from"./SearchContext-Ds-Ty4FN.js";import{L as f}from"./ListItemText-CjPOMK0o.js";import{H as x}from"./DefaultResultListItem-Dsnj4TUN.js";import{C as j}from"./icons-D2HZZ8i9.js";import{w as P,c as C}from"./appWrappers-DAteEjSC.js";import{L as w}from"./ListItem-tKAcflkD.js";import{L as A}from"./ListItemIcon-CY7XT_Su.js";import{c as _}from"./Plugin-CWiNelQ1.js";import{S as R}from"./Grid-gVLrUN9k.js";import{L as W}from"./Link-Bhg-T8Du.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-5oGCkfyb.js";import"./useAsync-CWtEEALw.js";import"./useMountedState-lQ-fXpOH.js";import"./lodash-CF3MOqf-.js";import"./useElementFilter-CLnDZ7ZA.js";import"./componentData-BqT0gNdh.js";import"./List-BiIsoLBQ.js";import"./ListContext-CefK0ZUa.js";import"./translation-DVrxv3LA.js";import"./EmptyState-t-FjsZOJ.js";import"./makeStyles-B-ZbX8FI.js";import"./Progress-1-eOVA1y.js";import"./LinearProgress-B1f-xxZi.js";import"./Box-CDNKgggc.js";import"./styled-aCG7DPFc.js";import"./ResponseErrorPanel-Ch20Kg5k.js";import"./ErrorPanel-DvSGfW-z.js";import"./WarningPanel-Bq0BQc0s.js";import"./ExpandMore-C9qCVIMs.js";import"./AccordionDetails-zY8vplAw.js";import"./index-B9sM2jn7.js";import"./Collapse-CKfycns5.js";import"./MarkdownContent-BNhYP9Tb.js";import"./CopyTextButton-hdbp3tkM.js";import"./useCopyToClipboard-BATaifjc.js";import"./Tooltip-Kh4-HhuL.js";import"./useObjectRef-B-PPvPC_.js";import"./useOverlayTriggerState-nkxvKS82.js";import"./utils-9GxVsiDp.js";import"./useFocusRing-DtQAi71R.js";import"./number-D8Tvkt0y.js";import"./I18nProvider-CNZdU0-i.js";import"./useControlledState-C8ScjM6r.js";import"./useTooltipTriggerState-BU8FIDCu.js";import"./animation-CpHqW5GJ.js";import"./useHover-Bvne2y_8.js";import"./ButtonIcon-BF7HTXom.js";import"./Button-DGrW_YAy.js";import"./Label-LRQoVPax.js";import"./Hidden-CI0OECmE.js";import"./useLabel-BFjYAAvj.js";import"./useLabels-BJlFaWLE.js";import"./useButton-Drv-lwD1.js";import"./usePress-CQso2Ktw.js";import"./textSelection-oDhLNlBr.js";import"./getMetaValue-BOiM-Q3U.js";import"./index-DXJUlwCm.js";import"./Divider-DXTUocLH.js";import"./CodeSnippet-BIJh80-V.js";import"./useApp-BrC99Fm0.js";import"./index-CohR7ztA.js";import"./WebStorage-BbUkdwyR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D-SzkKSm.js";import"./useIsomorphicLayoutEffect-uwoHbKQB.js";import"./BUIProvider-D7bQEjvA.js";import"./useRouteRef-D_FEt7m2.js";import"./index-Cwb1jpWy.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
