import{j as e,r as o,a3 as h}from"./iframe-DxBRWUiK.js";import{s as y,M as S}from"./api-BNflrItp.js";import{c as L}from"./SearchResult-26w07QTw.js";import{S as s}from"./SearchResultList-DM31jO_4.js";import{S as q}from"./SearchContext-3hIi30Sh.js";import{L as f}from"./ListItemText-Cm2hGlUF.js";import{H as x}from"./DefaultResultListItem-o2nw_J6A.js";import{C as j}from"./icons-CV_L39xb.js";import{w as P,c as C}from"./appWrappers-DLFuy7KW.js";import{L as w}from"./ListItem-CJmzm5qP.js";import{L as A}from"./ListItemIcon-C6Cs14oK.js";import{c as _}from"./Plugin-D5m3DAxi.js";import{S as R}from"./Grid-Dnrsaaez.js";import{L as W}from"./Link-DCSer0-z.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DhjjGYXj.js";import"./useAsync-CltTyTRu.js";import"./useMountedState-DRsk22-r.js";import"./lodash-DkCje28P.js";import"./useElementFilter-DHyqfFWU.js";import"./componentData-CkAmMJOv.js";import"./List-M_b7JZxV.js";import"./ListContext-BOD_g-hg.js";import"./translation-DTzdkFxB.js";import"./EmptyState-DID7SC91.js";import"./makeStyles-CpnAmrz_.js";import"./Progress-8aFoN5q9.js";import"./LinearProgress-BR0wridY.js";import"./Box-ZChtCTCt.js";import"./styled-DbZYE8_6.js";import"./ResponseErrorPanel-BbaB0k1A.js";import"./ErrorPanel-BCoE3qS2.js";import"./WarningPanel-DpCW17mV.js";import"./ExpandMore-BSXXttTp.js";import"./AccordionDetails-BwoejbO6.js";import"./index-B9sM2jn7.js";import"./Collapse-DD9CXN_Q.js";import"./MarkdownContent-BUd6GQ0P.js";import"./CodeSnippet-DS2Zycb8.js";import"./CopyTextButton-i96hU3rB.js";import"./useCopyToClipboard-DFIAMGy4.js";import"./Tooltip-DBNAjYz5.js";import"./useObjectRef-VkTcKCoy.js";import"./useOverlayTriggerState-2jFvCPDw.js";import"./utils-Cv-9sHfj.js";import"./useFocusRing-BqPZGEXT.js";import"./openLink-a1B1hwMM.js";import"./number-CGe6QRer.js";import"./I18nProvider-C0Z_fwek.js";import"./useControlledState-bDAdDYhT.js";import"./animation-LN_WEzBA.js";import"./useHover-Cr5thQm_.js";import"./ButtonIcon-C-uXe0cp.js";import"./Button-Dc1PTGgx.js";import"./Label-DB2E6Ibv.js";import"./Hidden-BdHYJNpU.js";import"./useLabel-DFfcinVE.js";import"./useLabels-DXt0FSFN.js";import"./useButton-CoWwmPj-.js";import"./usePress-CsaJDvcb.js";import"./textSelection-BAaw7jcY.js";import"./getMetaValue-CUMJm42D.js";import"./index-DdTIbfdH.js";import"./Divider-XExc0LBW.js";import"./useApp-nhNhp-L5.js";import"./WebStorage-sckTpqNX.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BQCoeNMP.js";import"./useIsomorphicLayoutEffect-BE3G-SCC.js";import"./BUIProvider-BTuxSVSJ.js";import"./BUIRoutingProvider-ouU5VIyg.js";import"./useResolvedHref-CDpKBnHn.js";import"./useRouteRef-CML3kP8F.js";import"./index-CvQne7Xm.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
