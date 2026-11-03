import{j as e,r as o,a3 as h}from"./iframe-BteMx7zj.js";import{s as y,M as S}from"./api-BjMO7ARA.js";import{c as L}from"./SearchResult-BvX1aF6G.js";import{S as s}from"./SearchResultList-eU4U3jpw.js";import{S as q}from"./SearchContext-B4DQRosL.js";import{L as f}from"./ListItemText-9BhXH5Ta.js";import{H as x}from"./DefaultResultListItem-iPETBIRK.js";import{C as j}from"./icons-xsbo07R5.js";import{w as P,c as C}from"./appWrappers-BtBpHXg5.js";import{L as w}from"./ListItem-DaGBUtFz.js";import{L as A}from"./ListItemIcon-DcluqsoI.js";import{c as _}from"./Plugin-ILh5X73T.js";import{S as R}from"./Grid-D5ZyNHnh.js";import{L as W}from"./Link-DkdOcJD_.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CzrCeQK4.js";import"./useAsync-DyWgphio.js";import"./useMountedState-CHelMk4j.js";import"./lodash-DsduVVuc.js";import"./useElementFilter-CQM3vbvZ.js";import"./componentData-DQx1Zps_.js";import"./List-B42bmojS.js";import"./ListContext-C3evAAl8.js";import"./translation-BBuO9eks.js";import"./EmptyState-C5LlBcLY.js";import"./makeStyles-DGUes2su.js";import"./Progress-BjFbVntY.js";import"./LinearProgress-B6QHBUO9.js";import"./Box-DCV742gE.js";import"./styled-DB7WYmRd.js";import"./ResponseErrorPanel-Bf6A31Q-.js";import"./ErrorPanel-gYSSuqn2.js";import"./WarningPanel-PFKymQsA.js";import"./ExpandMore-CLriPX-N.js";import"./AccordionDetails-cmey2Utz.js";import"./index-B9sM2jn7.js";import"./Collapse-7fl1HXkq.js";import"./MarkdownContent-Cc7ZmKdx.js";import"./CodeSnippet-j4NpQLPu.js";import"./CopyTextButton-BBPy9XyY.js";import"./useCopyToClipboard-CzCPJLic.js";import"./Tooltip-KfFi-nNX.js";import"./useObjectRef-Dv9hKxnj.js";import"./useOverlayTriggerState-jQQVBlrg.js";import"./utils-Csf2qqlx.js";import"./useFocusRing-Yxf_B4Dt.js";import"./openLink-8VSUUPMi.js";import"./number-B2HcLMyw.js";import"./I18nProvider-D7X1BqX1.js";import"./useControlledState-B_XVpnvb.js";import"./animation-HCfLZl62.js";import"./useHover-ZUHUyvdU.js";import"./ButtonIcon-BMdh_09p.js";import"./Button-DbBRcBsa.js";import"./Label-BS5nCX70.js";import"./Hidden-DJWYjR2p.js";import"./useLabel-CNCzQYRH.js";import"./useLabels-DAYEkzeR.js";import"./useButton-B0unMpfY.js";import"./usePress-Cuj1vnv1.js";import"./textSelection-pyBJCDu1.js";import"./getMetaValue-CM24UgTH.js";import"./index-Dfq8zbsI.js";import"./Divider-DGB92JHx.js";import"./useApp-CQY1dbvI.js";import"./WebStorage-2yAAATz5.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-B1KyI6ep.js";import"./useIsomorphicLayoutEffect-B4k77VyC.js";import"./BUIProvider-D3_d0bOb.js";import"./BUIRoutingProvider-CPad7EDH.js";import"./useResolvedHref-DazIgbZb.js";import"./useRouteRef-B7F6kW1A.js";import"./index-Bgp4cglI.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const st=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,st as __namedExportsOrder,rt as default};
