import{bQ as e,c8 as o,a4 as h}from"./iframe-C1Du46eF.js";import{s as y,M as S}from"./api-CKYAuhVw.js";import{c as L}from"./SearchResult-CkWm7czK.js";import{S as s}from"./SearchResultList-AZijjwPd.js";import{S as q}from"./SearchContext-Bay9O7_S.js";import{L as f}from"./ListItemText-Ml-aOV6O.js";import{H as x}from"./DefaultResultListItem-D4-KsFMg.js";import{C as j}from"./icons-Dvdf5zfh.js";import{O as P,a as C}from"./appWrappers-Bdlnewr6.js";import{L as w}from"./ListItem-CdzCtbN9.js";import{L as A}from"./ListItemIcon-Bl1SY3-K.js";import{a as _}from"./Plugin-L1luujr4.js";import{S as R}from"./Grid-DNU8Z8x6.js";import{L as W}from"./Link-BV4tUmIi.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-C9i1P1xg.js";import"./useAsync-D-ssdVeo.js";import"./useMountedState-DkfAqiXU.js";import"./lodash-Dvbzgryf.js";import"./useElementFilter-KLwmgrp6.js";import"./componentData-Cy0c4Ylw.js";import"./List-BNs0QNsL.js";import"./ListContext-D4W1XVLG.js";import"./translation-CLqDEqJI.js";import"./EmptyState-B5DBDX_k.js";import"./makeStyles-tNrkWhA3.js";import"./Progress-BaRiTJQn.js";import"./LinearProgress-C8Q7boyQ.js";import"./Box-ClfRlZ9E.js";import"./styled-CZd-VRab.js";import"./ResponseErrorPanel-B-QI0umn.js";import"./ErrorPanel-BTpb21PM.js";import"./WarningPanel-DXHtQ2IX.js";import"./ExpandMore-BWuE-7hQ.js";import"./AccordionDetails-CSzlYiZ9.js";import"./index-B9sM2jn7.js";import"./Collapse-BcGM4pdS.js";import"./MarkdownContent-GsgyxCqe.js";import"./CodeSnippet-DhHZhmcj.js";import"./CopyTextButton-DV_-9GPA.js";import"./useCopyToClipboard-B8foAEFP.js";import"./Tooltip-CbbOey0w.js";import"./useObjectRef-DOq-huoO.js";import"./useOverlayTriggerState-MXUE1IGe.js";import"./utils-hkspyz06.js";import"./useFocusRing-C0uj4VUP.js";import"./openLink-CByF1g0c.js";import"./number-DRYzdm3i.js";import"./I18nProvider-B27jmHNy.js";import"./useControlledState-BHe0N0Aq.js";import"./animation-Cp8UTTIv.js";import"./useHover-CFEPcSqQ.js";import"./ButtonIcon-CDLdhfta.js";import"./Button-kKzp0Xb2.js";import"./Label-CPEk2ZbI.js";import"./Hidden-BsQwcHXl.js";import"./useLabel-C8HhkV7I.js";import"./useLabels-CQnXJWhI.js";import"./useButton-DUAO8AkZ.js";import"./usePress-CiBw4CLk.js";import"./textSelection-DIl4JRXM.js";import"./index-C0MspUWn.js";import"./Divider-DaXw5YH4.js";import"./useApp-O4d2mQzz.js";import"./WebStorage-uxDeFZia.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CUFWMNlO.js";import"./useIsomorphicLayoutEffect-DCRut9bm.js";import"./BUIProvider-BsjCr296.js";import"./BUIRoutingProvider-DL2sT8fx.js";import"./useResolvedHref-gr1P5MbU.js";import"./useRouteRef-fP0wB5bl.js";import"./index-CMoliSBC.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
