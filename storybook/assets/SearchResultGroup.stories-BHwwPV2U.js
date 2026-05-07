import{j as e,r as s,a2 as D}from"./iframe-Cm1o1Xbd.js";import{S as o,D as i,a as _,b as G}from"./InsertDriveFile-C9Os0gKx.js";import{s as F,M as w}from"./api-Cn7FDnlb.js";import{c as Q}from"./SearchResult-D4Ok7I7y.js";import{S as A}from"./SearchContext-DMcG2vUe.js";import{L}from"./ListItemText-BOtbiPEf.js";import{M as q}from"./MenuItem-uZ8io8GD.js";import{w as N,c as b}from"./appWrappers-BunfmKJx.js";import{L as T}from"./ListItem-B3id05WU.js";import{L as E}from"./ListItemIcon-BnX2k0gC.js";import{c as M}from"./Plugin-BW5DJCkR.js";import{H as O}from"./DefaultResultListItem-DQ7Anwru.js";import{S as P}from"./Grid-Bci0B9zS.js";import{L as H}from"./Link-BujjMqyX.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BQdDpX6M.js";import"./Add-bKgtEqaU.js";import"./ArrowForwardIos-CWQk2RGG.js";import"./translation-CSs5G3Vr.js";import"./useAnalytics-BEwOoq4N.js";import"./Select-CLzuZyA4.js";import"./index-B9sM2jn7.js";import"./Popover-CsHm-zYv.js";import"./Modal-DcI2lTu0.js";import"./Portal-BCJJ0GKL.js";import"./List-DSQEbQUU.js";import"./ListContext-Bcv2AtVr.js";import"./formControlState-Dz--SRMG.js";import"./ListSubheader-DB2kYvsR.js";import"./Chip-C57kDIBJ.js";import"./makeStyles-CgDsK_IC.js";import"./EmptyState-Bp4ZXssO.js";import"./Progress-O1qgyKds.js";import"./LinearProgress-Cf80kNZS.js";import"./Box-H3EEpFmb.js";import"./styled-CDaxGVWn.js";import"./ResponseErrorPanel-CcZVdkJl.js";import"./ErrorPanel-BiGslUfc.js";import"./WarningPanel-Dr3kzVSN.js";import"./ExpandMore-FnfrAYVB.js";import"./AccordionDetails-BAp-U8Z2.js";import"./Collapse-BYA1yqoX.js";import"./MarkdownContent-D5BAVgm9.js";import"./CodeSnippet-JBqL3FbK.js";import"./CopyTextButton-DS8F_NJm.js";import"./useCopyToClipboard-CxDIm2O1.js";import"./useMountedState-Blvo2f43.js";import"./Tooltip-CCT5u6cY.js";import"./Popper-FZKJk7TA.js";import"./Divider-D_U4zSui.js";import"./useAsync-GF3_H2EU.js";import"./lodash-DTaZxSKz.js";import"./useElementFilter-BdT6mkQa.js";import"./componentData-ClFrh1_L.js";import"./WebStorage-MrEjFDxR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CI_yBCl2.js";import"./useIsomorphicLayoutEffect-BlGD8AVz.js";import"./useApp-Pblw4TFB.js";import"./BUIProvider-BvKJ30ug.js";import"./openLink-D5lxhsMC.js";import"./useResolvedHref-DkoMOC3w.js";import"./useRouteRef-BzSmmp13.js";import"./index-Dmtd4Pzp.js";const J=b({id:"storybook.search.results.group.route"}),V=new w({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),it={title:"Plugins/Search/SearchResultGroup",component:o,decorators:[t=>N(e.jsx(D,{apis:[[F,V]],children:e.jsx(P,{container:!0,direction:"row",children:e.jsx(P,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":J}})],tags:["!manifest"]},m=()=>e.jsx(A,{children:e.jsx(o,{icon:e.jsx(i,{}),title:"Documentation"})}),d=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})},h=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,{query:()=>new Promise(()=>{})}]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})})},y=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})})},S=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Custom",titleProps:{color:"secondary"}})},f=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Custom",link:"See all custom results",linkProps:{to:"/custom"}})},x=()=>{const[t,n]=s.useState({types:["software-catalog"]}),c=[{label:"Lifecycle",value:"lifecycle"},{label:"Owner",value:"owner"}],C=s.useCallback(r=>()=>{n(l=>{const{filters:u,...p}=l,a={...u,[r]:void 0};return{...p,filters:a}})},[]),j=s.useCallback(r=>l=>{n(u=>{const{filters:p,...a}=u,W={...p,[r]:l};return{...a,filters:W}})},[]),k=s.useCallback(r=>()=>{n(l=>{const{filters:u,...p}=l,a={...u};return delete a[r],{...p,filters:a}})},[]);return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation",filterOptions:c,renderFilterOption:r=>e.jsx(q,{onClick:C(r.value),children:r.label},r.value),renderFilterField:r=>{switch(r){case"lifecycle":return e.jsxs(G,{label:"Lifecycle",value:t.filters?.lifecycle,onChange:j("lifecycle"),onDelete:k("lifecycle"),children:[e.jsx(q,{value:"production",children:"Production"}),e.jsx(q,{value:"experimental",children:"Experimental"})]},r);case"owner":return e.jsx(_,{label:"Owner",value:t.filters?.owner,onChange:j("owner"),onDelete:k("owner")},r);default:return null}}})},R=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,new w]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})})},g=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,new w]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation",noResultsComponent:e.jsx(L,{primary:"No results were found"})})})},z=t=>{const{icon:n,result:c}=t;return e.jsx(H,{to:c.location,children:e.jsxs(T,{alignItems:"flex-start",divider:!0,children:[n&&e.jsx(E,{children:n}),e.jsx(L,{primary:c.title,primaryTypographyProps:{variant:"h6"},secondary:c.text})]})})},I=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Custom",link:"See all custom results",renderResultItem:({document:n,highlight:c,rank:C})=>e.jsx(z,{result:n,highlight:c,rank:C},n.location)})},v=()=>{const[t]=s.useState({types:["techdocs"]}),c=M({id:"plugin"}).provide(Q({name:"DefaultResultListItem",component:async()=>O}));return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation",children:e.jsx(c,{})})};m.__docgenInfo={description:"",methods:[],displayName:"Default"};d.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};h.__docgenInfo={description:"",methods:[],displayName:"Loading"};y.__docgenInfo={description:"",methods:[],displayName:"WithError"};S.__docgenInfo={description:"",methods:[],displayName:"WithCustomTitle"};f.__docgenInfo={description:"",methods:[],displayName:"WithCustomLink"};x.__docgenInfo={description:"",methods:[],displayName:"WithFilters"};R.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};g.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};I.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};v.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultGroup icon={<DocsIcon />} title="Documentation" />
    </SearchContextProvider>;
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />;
}`,...d.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {})
  }]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />
    </TestApiProvider>;
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {
      throw new Error();
    })
  }]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />
    </TestApiProvider>;
}`,...y.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" titleProps={{
    color: 'secondary'
  }} />;
}`,...S.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" link="See all custom results" linkProps={{
    to: '/custom'
  }} />;
}`,...f.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`() => {
  const [query, setQuery] = useState<Partial<SearchQuery>>({
    types: ['software-catalog']
  });
  const filterOptions = [{
    label: 'Lifecycle',
    value: 'lifecycle'
  }, {
    label: 'Owner',
    value: 'owner'
  }];
  const handleFilterAdd = useCallback((key: string) => () => {
    setQuery(prevQuery => {
      const {
        filters: prevFilters,
        ...rest
      } = prevQuery;
      const newFilters = {
        ...prevFilters,
        [key]: undefined
      };
      return {
        ...rest,
        filters: newFilters
      };
    });
  }, []);
  const handleFilterChange = useCallback((key: string) => (value: JsonValue) => {
    setQuery(prevQuery => {
      const {
        filters: prevFilters,
        ...rest
      } = prevQuery;
      const newFilters = {
        ...prevFilters,
        [key]: value
      };
      return {
        ...rest,
        filters: newFilters
      };
    });
  }, []);
  const handleFilterDelete = useCallback((key: string) => () => {
    setQuery(prevQuery => {
      const {
        filters: prevFilters,
        ...rest
      } = prevQuery;
      const newFilters = {
        ...prevFilters
      };
      delete newFilters[key];
      return {
        ...rest,
        filters: newFilters
      };
    });
  }, []);
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" filterOptions={filterOptions} renderFilterOption={option => <MenuItem key={option.value} onClick={handleFilterAdd(option.value)}>
          {option.label}
        </MenuItem>} renderFilterField={(key: string) => {
    switch (key) {
      case 'lifecycle':
        return <SearchResultGroupSelectFilterField key={key} label="Lifecycle" value={query.filters?.lifecycle} onChange={handleFilterChange('lifecycle')} onDelete={handleFilterDelete('lifecycle')}>
                <MenuItem value="production">Production</MenuItem>
                <MenuItem value="experimental">Experimental</MenuItem>
              </SearchResultGroupSelectFilterField>;
      case 'owner':
        return <SearchResultGroupTextFilterField key={key} label="Owner" value={query.filters?.owner} onChange={handleFilterChange('owner')} onDelete={handleFilterDelete('owner')} />;
      default:
        return null;
    }
  }} />;
}`,...x.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />
    </TestApiProvider>;
}`,...R.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" noResultsComponent={<ListItemText primary="No results were found" />} />
    </TestApiProvider>;
}`,...g.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" link="See all custom results" renderResultItem={({
    document,
    highlight,
    rank
  }) => <CustomResultListItem key={document.location} result={document} highlight={highlight} rank={rank} />} />;
}`,...I.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultSearchResultGroupItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation">
      <DefaultSearchResultGroupItem />
    </SearchResultGroup>;
}`,...v.parameters?.docs?.source}}};const nt=["Default","WithQuery","Loading","WithError","WithCustomTitle","WithCustomLink","WithFilters","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{m as Default,h as Loading,f as WithCustomLink,g as WithCustomNoResultsComponent,I as WithCustomResultItem,S as WithCustomTitle,R as WithDefaultNoResultsComponent,y as WithError,x as WithFilters,d as WithQuery,v as WithResultItemExtensions,nt as __namedExportsOrder,it as default};
