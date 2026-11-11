import{j as e,r as o,X as h}from"./iframe-C7lYm63e.js";import{s as y,M as S}from"./api-Dtmnv_kY.js";import{c as L}from"./SearchResult-CNQIFoGs.js";import{S as s}from"./SearchResultList-CCooMSyW.js";import{S as q}from"./SearchContext-cUQE8sSp.js";import{L as f}from"./ListItemText-2jmGub62.js";import{H as x}from"./DefaultResultListItem-e-yCQuM-.js";import{C as j}from"./icons-B6Gdz1yF.js";import{w as P,c as C}from"./appWrappers-KdCTgzPu.js";import{L as w}from"./ListItem-CPJiRmSN.js";import{L as A}from"./ListItemIcon-BvWMgP2e.js";import{c as _}from"./Plugin-SLM15rmp.js";import{S as R}from"./Grid-Dx4lFWsU.js";import{L as W}from"./Link-DKhx2tkV.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-QXmmoeIg.js";import"./useAsync-Dlld0t9X.js";import"./useMountedState-Ci8ZHYTe.js";import"./lodash-jlhHekdq.js";import"./useElementFilter-nKTz35H6.js";import"./componentData-DUVVu4D4.js";import"./List--nqukECR.js";import"./ListContext-sxylWf-L.js";import"./translation-TA9dPSs5.js";import"./EmptyState-Cc_1yAPB.js";import"./makeStyles-CNdVE_9m.js";import"./Progress-BZ1n30Ub.js";import"./LinearProgress-D6GOko9f.js";import"./Box-DVl--OQ4.js";import"./styled-DFprPEWi.js";import"./ResponseErrorPanel-B07Hpoxa.js";import"./ErrorPanel-ulP0eNyU.js";import"./WarningPanel-DoV0Juvf.js";import"./ExpandMore-BlheU9Cw.js";import"./AccordionDetails-B6aFR-8U.js";import"./index-B9sM2jn7.js";import"./Collapse-DXEzvYJm.js";import"./MarkdownContent-DlTgNBDg.js";import"./CopyTextButton-DKMB-Qhj.js";import"./useCopyToClipboard-DMQBGdJf.js";import"./Tooltip-BcqrA52i.js";import"./useObjectRef-aANnWHv4.js";import"./useOverlayTriggerState-BmV-E52M.js";import"./utils-BUzKzuKz.js";import"./useFocusRing-DBYmBdNX.js";import"./number-Ctxb0h4T.js";import"./I18nProvider-cMES1Ye-.js";import"./useControlledState-BNzUk4rc.js";import"./animation-DANnDqD6.js";import"./useHover-Dh_5CIee.js";import"./ButtonIcon-Ba0ONmbh.js";import"./Button-9cVhP8ym.js";import"./Label-BN9dytpW.js";import"./Hidden-C01qEBuY.js";import"./useLabel-CLnEY2ws.js";import"./useLabels-B_JIZiXA.js";import"./useButton-DYcDcyWL.js";import"./usePress-DfP9K6Oc.js";import"./textSelection-DvQ0zR-N.js";import"./getMetaValue-C1Arjnva.js";import"./index-YLMOL70x.js";import"./Divider-kHDmbGGk.js";import"./CodeSnippet-D12vdhr-.js";import"./useApp-Ds50W7L8.js";import"./index-FJv8Tr6k.js";import"./WebStorage-DhNM77SW.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CT592Ukx.js";import"./useIsomorphicLayoutEffect-B5WlYeIg.js";import"./BUIProvider-uNuGl61A.js";import"./useRouteRef-Bh_1Sd7o.js";import"./index-DRQcGEH_.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
