import{j as e,r as o,a3 as h}from"./iframe-BYYe_BET.js";import{s as y,M as S}from"./api-DSkHVJEe.js";import{c as L}from"./SearchResult-BlnK_b-h.js";import{S as s}from"./SearchResultList-B2so7Gjd.js";import{S as q}from"./SearchContext-ae2lEUFv.js";import{L as f}from"./ListItemText-Y-vaEivY.js";import{H as x}from"./DefaultResultListItem-DezEwn1c.js";import{C as j}from"./icons-jN0N4pHp.js";import{w as P,c as C}from"./appWrappers-DyEyzG1j.js";import{L as w}from"./ListItem-t-HbrJXm.js";import{L as A}from"./ListItemIcon-kuVToy9n.js";import{c as _}from"./Plugin-CbRjWlm4.js";import{S as R}from"./Grid-DwakReSX.js";import{L as W}from"./Link-DQQIOfhH.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DWxEYXCC.js";import"./useAsync-DsoY5cPF.js";import"./useMountedState-BJL-WLRQ.js";import"./lodash-lhI2pBpB.js";import"./useElementFilter-BYIIJPU-.js";import"./componentData-CK11yto-.js";import"./List-DdhsJ4F5.js";import"./ListContext-DCNSGU5g.js";import"./translation-DOlyCArf.js";import"./EmptyState-DKsAJBWS.js";import"./makeStyles-BqAzHYwu.js";import"./Progress-CunIqhQP.js";import"./LinearProgress-C-XNioff.js";import"./Box-0Ecv0mGg.js";import"./styled-D32qgjdu.js";import"./ResponseErrorPanel-DqiycXij.js";import"./ErrorPanel-DpueJr42.js";import"./WarningPanel-Bw52NOZl.js";import"./ExpandMore-CiDqCMb1.js";import"./AccordionDetails-CS7mUXMa.js";import"./index-B9sM2jn7.js";import"./Collapse-dimKAT4N.js";import"./MarkdownContent-WNB-yFQn.js";import"./CodeSnippet-CZ2XO4Zf.js";import"./CopyTextButton-Cug5hb1r.js";import"./useCopyToClipboard-Cn49hS36.js";import"./Tooltip-B3Py3aUh.js";import"./useObjectRef-9OXtpzcu.js";import"./useOverlayTriggerState-B9znxEmb.js";import"./utils-CJSyyO3-.js";import"./useFocusRing-BRx5O8Da.js";import"./openLink-BON_CNZm.js";import"./number-CtW1NSkQ.js";import"./I18nProvider-rRNMaJeu.js";import"./useControlledState-DguQehpe.js";import"./animation-DtpQ2ZDK.js";import"./useHover-DawSjhGk.js";import"./ButtonIcon-I4aSAKuo.js";import"./Button-DEPxcD8C.js";import"./Label-Bs-x77sn.js";import"./Hidden-c60OiMP4.js";import"./useLabel-dcXziXhr.js";import"./useLabels-4i8ghj68.js";import"./useButton-f7nJByYc.js";import"./usePress-CdThG8-6.js";import"./textSelection-D5BzNUOh.js";import"./getMetaValue-Bn1etyTW.js";import"./index-COE7Jz9g.js";import"./Divider-pRXEZ2ju.js";import"./useApp-C6DR3uil.js";import"./WebStorage-g40bNH0A.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CeFjkftX.js";import"./useIsomorphicLayoutEffect-DF6pJLwM.js";import"./BUIProvider-By5rpXjK.js";import"./BUIRoutingProvider-DagVjI_D.js";import"./useResolvedHref-C1qAVxpR.js";import"./useRouteRef-DYVMkFsX.js";import"./index-C_fPlOPu.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
