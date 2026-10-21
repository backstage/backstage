import{j as e,r as o,a3 as h}from"./iframe-CSz7VfT3.js";import{s as y,M as S}from"./api-DoTntPif.js";import{c as L}from"./SearchResult-D-UdliCT.js";import{S as s}from"./SearchResultList-Bt0Io883.js";import{S as q}from"./SearchContext-CSXRfjme.js";import{L as f}from"./ListItemText-Dii_m3Om.js";import{H as x}from"./DefaultResultListItem-DZOYlYOR.js";import{C as j}from"./icons-D-mwtaZm.js";import{w as P,c as C}from"./appWrappers-C6vIovAA.js";import{L as w}from"./ListItem-CIKs1J7B.js";import{L as A}from"./ListItemIcon-Do6ROgfC.js";import{c as _}from"./Plugin-DhkduLRV.js";import{S as R}from"./Grid-BK-uRE6j.js";import{L as W}from"./Link-Df0pdh_K.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CbLpUIzI.js";import"./useAsync-4c1pdS8b.js";import"./useMountedState-Bb4Yyk9k.js";import"./lodash-KZId8LWf.js";import"./useElementFilter-kxM1ZSwK.js";import"./componentData-ClVXnb9_.js";import"./List-BSep9TdZ.js";import"./ListContext-PRAg6M82.js";import"./translation-CNgLf5Mj.js";import"./EmptyState-BQ6DOaZU.js";import"./makeStyles-CC8EE5Qs.js";import"./Progress-CRIEm2Y5.js";import"./LinearProgress-DKJb8qov.js";import"./Box-Bz86QYYh.js";import"./styled-BZdOrxc2.js";import"./ResponseErrorPanel-CVYSC29I.js";import"./ErrorPanel-8woJBBMq.js";import"./WarningPanel-BTvS4Kpf.js";import"./ExpandMore-CT8H60wv.js";import"./AccordionDetails-DXova11v.js";import"./index-B9sM2jn7.js";import"./Collapse-B_-gM8xf.js";import"./MarkdownContent-CUw9F_Zb.js";import"./CodeSnippet-Ct0SFSP9.js";import"./CopyTextButton-CvJJcSKj.js";import"./useCopyToClipboard-CgUWd10c.js";import"./Tooltip-B6cAtNwx.js";import"./useObjectRef-D_q6rl-C.js";import"./useOverlayTriggerState-BU4FYN95.js";import"./utils-DO510V5r.js";import"./useFocusRing-Fbq9rG4I.js";import"./openLink-BZZjesw9.js";import"./number-vPK-eftY.js";import"./I18nProvider-C8LosUml.js";import"./useControlledState-D9BG_cB_.js";import"./animation-CNMihT0b.js";import"./useHover-C4tPk2eu.js";import"./ButtonIcon-C7S555RE.js";import"./Button-Be0Cy88V.js";import"./Label-AZq59z2_.js";import"./Hidden-CM7FbOlL.js";import"./useLabel-B7GfVGDS.js";import"./useLabels-53H5tn1J.js";import"./useButton-0UwCDxtn.js";import"./usePress-BkOB3jXf.js";import"./textSelection-xDV9V9Np.js";import"./getMetaValue-C_A1bvat.js";import"./index-ndNk04vF.js";import"./Divider-C-NbBHFJ.js";import"./useApp-BQDc9GUX.js";import"./WebStorage-DyyQQYc2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-bB0DXUbm.js";import"./useIsomorphicLayoutEffect-xxI4vc_c.js";import"./BUIProvider-DlsqQjlV.js";import"./BUIRoutingProvider-DWliD39c.js";import"./useResolvedHref-Dnk2mOGG.js";import"./useRouteRef-CoayHRgI.js";import"./index-CZ0nvQAS.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
