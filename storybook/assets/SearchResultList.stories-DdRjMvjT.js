import{j as e,r as o,a3 as h}from"./iframe-piw0-GWS.js";import{s as y,M as S}from"./api-Cw9sRq22.js";import{c as L}from"./SearchResult-DWhy3ay5.js";import{S as s}from"./SearchResultList-DxjHBRhI.js";import{S as q}from"./SearchContext-Bc6mfmaq.js";import{L as f}from"./ListItemText-CMhK63aE.js";import{H as x}from"./DefaultResultListItem-Dk3uKAt5.js";import{C as j}from"./icons-3J9PkQlz.js";import{w as P,c as C}from"./appWrappers--sopDpeI.js";import{L as w}from"./ListItem-DDitZ_mI.js";import{L as A}from"./ListItemIcon-xfpOzsX6.js";import{c as _}from"./Plugin-BwcUJjBy.js";import{S as R}from"./Grid-Bua32Pkj.js";import{L as W}from"./Link-9LmnYNwl.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CWHO13NO.js";import"./useAsync-DQ0Nkrxq.js";import"./useMountedState-CTvcjAp4.js";import"./lodash-Bzqu9al6.js";import"./useElementFilter-C0_4xhl1.js";import"./componentData-CIdyYHhH.js";import"./List-waPtU691.js";import"./ListContext-CZXGcFTa.js";import"./translation-BKGrpYVm.js";import"./EmptyState-CvzrFVNB.js";import"./makeStyles-DDl_fC1G.js";import"./Progress-niXqs3CL.js";import"./LinearProgress-Cis9u28P.js";import"./Box-BadlU00i.js";import"./styled-EqtXE7BT.js";import"./ResponseErrorPanel-BgZz6BE0.js";import"./ErrorPanel-B_VBWO0I.js";import"./WarningPanel-BMhQU64z.js";import"./ExpandMore-Ba6tlNZS.js";import"./AccordionDetails-DJm3cjmM.js";import"./index-B9sM2jn7.js";import"./Collapse-vClSRMBX.js";import"./MarkdownContent-D_hbcDZ9.js";import"./CodeSnippet-MIwjo4lQ.js";import"./CopyTextButton-CyN1ozdc.js";import"./useCopyToClipboard-DAM1cjvF.js";import"./Tooltip-B2jaja2e.js";import"./useObjectRef-IkhajRyJ.js";import"./useOverlayTriggerState-CkdldBFn.js";import"./utils-wuzg6Gut.js";import"./useFocusRing-BpapEP6W.js";import"./openLink-BiQlZAwx.js";import"./number-gEdanb4Y.js";import"./I18nProvider-DMoCT0pg.js";import"./useControlledState-WBvh0vQ5.js";import"./animation-BJ7i84cK.js";import"./useHover-CBlM-Gvk.js";import"./ButtonIcon-BIt07zdx.js";import"./Button-Cm250GNY.js";import"./Label-BZuUhWGV.js";import"./Hidden-ChjLH5Dh.js";import"./useLabel-ETY-Wxlf.js";import"./useLabels-BulSWJbq.js";import"./useButton-Cruw1eRB.js";import"./usePress-Bwx27jrs.js";import"./textSelection-eCd97__a.js";import"./index-Co7WXYIc.js";import"./Divider-EjBdR9pF.js";import"./useApp-Buw1Idw2.js";import"./WebStorage-CL7RPLWP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CKCxz5MB.js";import"./useIsomorphicLayoutEffect-C-lb1VY4.js";import"./BUIProvider-avY07MpV.js";import"./BUIRoutingProvider-DGNvCocA.js";import"./useResolvedHref-RozAxOr0.js";import"./useRouteRef-BDpdho-2.js";import"./index-CH0FH9SW.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
