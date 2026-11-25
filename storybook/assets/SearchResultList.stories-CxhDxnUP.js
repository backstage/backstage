import{j as e,r as o,X as h}from"./iframe-T196ztmH.js";import{s as y,M as S}from"./api-B4LpBijw.js";import{c as L}from"./SearchResult-B9-fSmhl.js";import{S as s}from"./SearchResultList-D_mVufVX.js";import{S as q}from"./SearchContext-CM_tQmPU.js";import{L as f}from"./ListItemText-BKGelt8m.js";import{H as x}from"./DefaultResultListItem-Ci56i_g_.js";import{C as j}from"./icons-HGzNn7cl.js";import{w as P,c as C}from"./appWrappers-DTrP08Rq.js";import{L as w}from"./ListItem-C46GhWUf.js";import{L as A}from"./ListItemIcon-NtJdCcYr.js";import{c as _}from"./Plugin-DdqYS0zi.js";import{S as R}from"./Grid-tsQx5ZlT.js";import{L as W}from"./Link-CM7hnzwh.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-hRuUiONW.js";import"./useAsync-VzOG_5Oq.js";import"./useMountedState-Csk1KXf2.js";import"./lodash-CKeCnM0L.js";import"./useElementFilter-CoD5p6Ac.js";import"./componentData-DV5XxZVR.js";import"./List-uBQ_jjoq.js";import"./ListContext-C26h6ShK.js";import"./translation-CRXbvBZf.js";import"./EmptyState-D8hMk3nW.js";import"./makeStyles-wXls5oBk.js";import"./Progress-CJIT8gNQ.js";import"./LinearProgress-CYm_Oiiw.js";import"./Box-D0Hsb4cf.js";import"./styled-D8t9NQsp.js";import"./ResponseErrorPanel-C4Tie216.js";import"./ErrorPanel-DWaS0ZBO.js";import"./WarningPanel-Css5OhBO.js";import"./ExpandMore-nDb0_CUc.js";import"./AccordionDetails-CI3aIhTi.js";import"./index-B9sM2jn7.js";import"./Collapse-DCAKfow3.js";import"./MarkdownContent-Bvn4luNB.js";import"./CopyTextButton-DkFPXC7w.js";import"./useCopyToClipboard-DHFE9qEU.js";import"./Tooltip-giAPcCGO.js";import"./useObjectRef-_dSsW1Fk.js";import"./useOverlayTriggerState-D9Xb0gJN.js";import"./utils-zm3gdQCr.js";import"./useFocusRing-DNtHiErB.js";import"./number-0emrtaiX.js";import"./I18nProvider-DNS4_F5r.js";import"./useControlledState-DuQaVgle.js";import"./animation-CpmNWIfH.js";import"./useHover-7-pgp0Ky.js";import"./ButtonIcon-r0XYIMXr.js";import"./Button-CrpaGjWm.js";import"./Label-sNbExByb.js";import"./Hidden-BBV6Ld8l.js";import"./useLabel-BnuV1o8f.js";import"./useLabels-Cvihbbwm.js";import"./useButton-vSodW6MB.js";import"./usePress-C69aPbO8.js";import"./textSelection-BG3cATkn.js";import"./getMetaValue-DwQluMyN.js";import"./index-WrKC2aIj.js";import"./Divider-C7Oe7uel.js";import"./CodeSnippet-U9qw4ckE.js";import"./useApp-BYWpjzsK.js";import"./index-DQMgTQ6t.js";import"./WebStorage-B8046LOY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Bmztdeu0.js";import"./useIsomorphicLayoutEffect-BvTpWRpR.js";import"./BUIProvider-B84iVJlz.js";import"./useRouteRef-DCzvXfLN.js";import"./index-CHb-0WlO.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
