import{j as e,r as o,X as h}from"./iframe-CR1Jw9dV.js";import{s as y,M as S}from"./api-CZYssnXn.js";import{c as L}from"./SearchResult-BGhU2VRv.js";import{S as s}from"./SearchResultList-BFhfg8KK.js";import{S as q}from"./SearchContext-DWQ7upZn.js";import{L as f}from"./ListItemText-PI8GFBOf.js";import{H as x}from"./DefaultResultListItem-DpG_MmI7.js";import{C as j}from"./icons-CoZW2lrL.js";import{w as P,c as C}from"./appWrappers-C7NUiJk1.js";import{L as w}from"./ListItem-C8ehtjyx.js";import{L as A}from"./ListItemIcon-4XR0TJj_.js";import{c as _}from"./Plugin-B79p-w5l.js";import{S as R}from"./Grid-CxkI-J4A.js";import{L as W}from"./Link-Dhqz-BCc.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-iih8YEd4.js";import"./useAsync-CpxhuWZy.js";import"./useMountedState-Dyynv26Z.js";import"./lodash-5fYZTyfB.js";import"./useElementFilter-DSI11OZ_.js";import"./componentData-X4Zw6trD.js";import"./List-DygGvees.js";import"./ListContext-C50iGKA5.js";import"./translation-C7cspVWc.js";import"./EmptyState-1pY6R8S-.js";import"./makeStyles-Blkp-8Vz.js";import"./Progress-HFg92RjK.js";import"./LinearProgress-Dn47bWsf.js";import"./Box-BaA-dv-7.js";import"./styled-BINEkVaE.js";import"./ResponseErrorPanel-B3bKbTtm.js";import"./ErrorPanel-Cy-zVRNg.js";import"./WarningPanel-Ch8DVuko.js";import"./ExpandMore-BPH7-hk8.js";import"./AccordionDetails-lcit3sf6.js";import"./index-B9sM2jn7.js";import"./Collapse-CNfkhbFo.js";import"./MarkdownContent-BnmsOE6s.js";import"./CopyTextButton-DPmLXo4_.js";import"./useCopyToClipboard-RvuO4m91.js";import"./Tooltip-Cf2zXoVS.js";import"./useObjectRef-CxAJnmky.js";import"./useOverlayTriggerState-BrayxibY.js";import"./utils-f1XPU8sj.js";import"./useFocusRing-CCR0Dk_B.js";import"./number-CXcznxJS.js";import"./I18nProvider-CXlyEy0i.js";import"./useControlledState-BQLBMnzZ.js";import"./animation-reWawdWv.js";import"./useHover-COtbARlD.js";import"./ButtonIcon-B6UbfbyX.js";import"./Button-DzhTBfgP.js";import"./Label-C37_b03j.js";import"./Hidden-B3uAAl_R.js";import"./useLabel-B8RNTxDr.js";import"./useLabels-C65kEDvg.js";import"./useButton-HAI6nP2s.js";import"./usePress-BO_FqSCY.js";import"./textSelection-DRBuEoQO.js";import"./getMetaValue-QyE7lEVK.js";import"./index-CHKdAyZ9.js";import"./Divider-Dk_1lvZ6.js";import"./CodeSnippet-CLkY7bPO.js";import"./useApp-D4i_SxIG.js";import"./index-BBOHwEhV.js";import"./WebStorage-BXNhsB_l.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-B05rprOS.js";import"./useIsomorphicLayoutEffect-BNArkPOk.js";import"./BUIProvider-8s_p7rUM.js";import"./useRouteRef-q0IzcZNO.js";import"./index-CuqShzUV.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
