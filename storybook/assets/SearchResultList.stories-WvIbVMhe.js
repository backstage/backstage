import{j as e,r as o,a3 as h}from"./iframe-DOtOeTqo.js";import{s as y,M as S}from"./api-SWQpTDEC.js";import{c as L}from"./SearchResult-C8qnWMF_.js";import{S as s}from"./SearchResultList-B_ul5Is4.js";import{S as q}from"./SearchContext-Oywuedwe.js";import{L as f}from"./ListItemText--2Kbl56n.js";import{H as x}from"./DefaultResultListItem-qrd5ixC1.js";import{C as j}from"./icons-Cq_clhAk.js";import{w as P,c as C}from"./appWrappers-DMu6UYHy.js";import{L as w}from"./ListItem-BmxIywAG.js";import{L as A}from"./ListItemIcon-D-U80sPP.js";import{c as _}from"./Plugin-6ZZMa2HU.js";import{S as R}from"./Grid-KxYFYxAG.js";import{L as W}from"./Link-D1jM9Lpj.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DanEeCEV.js";import"./useAsync-C2nV6wwY.js";import"./useMountedState-CMMEaIUk.js";import"./lodash-C_cdduUD.js";import"./useElementFilter-T_0ssoHo.js";import"./componentData-BRW4SeeR.js";import"./List-IyXwRYVt.js";import"./ListContext-qvPrRuDM.js";import"./translation-BbG0C2hx.js";import"./EmptyState-DUWP0cJ7.js";import"./makeStyles-aCtRezqa.js";import"./Progress-l-0vOlVb.js";import"./LinearProgress-DVv72eBF.js";import"./Box-D0ehxfuJ.js";import"./styled-CZEjihDZ.js";import"./ResponseErrorPanel-awwqLenK.js";import"./ErrorPanel-DNhnDHOW.js";import"./WarningPanel-BGxEpT--.js";import"./ExpandMore-8D-WX9pK.js";import"./AccordionDetails-lBJv0gg5.js";import"./index-B9sM2jn7.js";import"./Collapse-COg7M1Hj.js";import"./MarkdownContent-A_WO0S75.js";import"./CodeSnippet-DsbjsTj1.js";import"./CopyTextButton-CfQhmwxW.js";import"./useCopyToClipboard-BGmklS9m.js";import"./Tooltip-BpL3QK8E.js";import"./useObjectRef-BWUUeiPu.js";import"./useOverlayTriggerState-CMprxMq5.js";import"./utils-pgFMei_k.js";import"./useFocusRing-BXb8q1JL.js";import"./openLink-CJNg7ARK.js";import"./number-Bmc2WaUx.js";import"./I18nProvider-DuDY5T7I.js";import"./useControlledState-BfKz3a4E.js";import"./animation-PioyXRyy.js";import"./useHover-CLTRyNT2.js";import"./ButtonIcon-sleBnERd.js";import"./Button-BEAJi762.js";import"./Label-BxIKHFQ8.js";import"./Hidden-CxPa8WIq.js";import"./useLabel-DH87djdw.js";import"./useLabels-BnFtLpP2.js";import"./useButton-nXyYv-0V.js";import"./usePress-BQ7zB3R2.js";import"./textSelection-8fES9RA1.js";import"./index-BlBcDPbs.js";import"./Divider-9aSoofHc.js";import"./useApp-CYz1MO9C.js";import"./WebStorage-Bla2tNIC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CNWNXrVe.js";import"./useIsomorphicLayoutEffect-BSMQrXpd.js";import"./BUIProvider-DMOlRvK1.js";import"./BUIRoutingProvider-CCMgpbyZ.js";import"./useResolvedHref-DUUdLYVO.js";import"./useRouteRef-lvZBGwhn.js";import"./index-7nocqFCe.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
