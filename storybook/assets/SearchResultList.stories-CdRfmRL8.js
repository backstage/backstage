import{bR as e,ca as o,a5 as h}from"./iframe-e_Pbc_6f.js";import{s as y,M as S}from"./api-B9HnIlt8.js";import{c as L}from"./SearchResult-BXVzY6LN.js";import{S as s}from"./SearchResultList-BZ9Nx0WJ.js";import{S as q}from"./SearchContext-Dxi5rp5p.js";import{L as f}from"./ListItemText-7UhNShIs.js";import{H as x}from"./DefaultResultListItem-qI5gp9a2.js";import{C as j}from"./icons-CNlpusSW.js";import{O as P,a as C}from"./appWrappers-B8y3JmxN.js";import{L as w}from"./ListItem-0H8wmvm_.js";import{L as A}from"./ListItemIcon-3aj-gh8v.js";import{a as _}from"./Plugin-D4pedKjY.js";import{S as R}from"./Grid-DKdjmz4g.js";import{L as W}from"./Link-BPZInZpE.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-ePNxNM33.js";import"./useAsync-rO4qpWMh.js";import"./useMountedState-CKl4uDr9.js";import"./lodash-DAwn35z1.js";import"./useElementFilter-Cr-3An_r.js";import"./componentData-Do5dcuus.js";import"./List-BGzrRdQR.js";import"./ListContext-BTgNrjgi.js";import"./translation-mb4rVlYk.js";import"./EmptyState-Dw2D2mZZ.js";import"./makeStyles-Cp-EYjYJ.js";import"./Progress-B7Wk6lUw.js";import"./LinearProgress-Dd_2M-YT.js";import"./Box-DMUgG59T.js";import"./styled-CxHJsi3Q.js";import"./ResponseErrorPanel-DFSADhNY.js";import"./ErrorPanel-nTkgmpv-.js";import"./WarningPanel-C7NOFBuP.js";import"./ExpandMore-CxlSY5ST.js";import"./AccordionDetails-Cs-LmZLY.js";import"./index-B9sM2jn7.js";import"./Collapse-BpLU1y6R.js";import"./MarkdownContent-C97dERNl.js";import"./CodeSnippet-DJIi0E0w.js";import"./CopyTextButton-B3n0ZUN-.js";import"./useCopyToClipboard-CCxT8mKm.js";import"./Tooltip-BvBLCeHz.js";import"./useObjectRef-DrJIir3F.js";import"./useOverlayTriggerState-CP5VgdLu.js";import"./utils-DxA9yzz1.js";import"./useFocusRing-KWUxPK8x.js";import"./openLink-DeVBsZVT.js";import"./number-CnABZTeS.js";import"./I18nProvider-CEYf4yN0.js";import"./useControlledState-DA3BLMuY.js";import"./animation-yDPRJL1t.js";import"./useHover-C40GJDws.js";import"./ButtonIcon-8ef_tIDz.js";import"./Button-D1InRcXf.js";import"./Label-C-UeOlhu.js";import"./Hidden-C1Rvfh0a.js";import"./useLabel-DuGYdeVZ.js";import"./useLabels-C5Sb3eQn.js";import"./useButton-B-tc2orz.js";import"./usePress-DUFujYJV.js";import"./textSelection-CmT3bbJB.js";import"./index-D1GUm7TG.js";import"./Divider-Crud06p9.js";import"./useApp-CjDlo0PH.js";import"./WebStorage-De9ywh3l.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BladXfKu.js";import"./useIsomorphicLayoutEffect-B1iQlogD.js";import"./BUIProvider-YvBoGo4d.js";import"./useResolvedHref-6YPNP1wf.js";import"./useRouteRef-BGO6weS_.js";import"./index-Cz0En5uD.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
