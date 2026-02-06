import{j as e,U as D,r as s}from"./iframe-DPEQU9sg.js";import{S as n,D as o,a as A,b as L}from"./InsertDriveFile-B9Xbyw6G.js";import{s as F,M as C}from"./api-D1aB2rhI.js";import{c as W}from"./SearchResult-CAvFb1sq.js";import{S as j}from"./Grid-V2KC8DrR.js";import{S as T}from"./SearchContext-Dejq-K2O.js";import{M as w}from"./MenuItem-DBga-0Jj.js";import{L as Q}from"./ListItemText-xJVltyzR.js";import{L as b}from"./ListItem-C3tAmyko.js";import{L as _}from"./ListItemIcon-CypjUHeE.js";import{H as N}from"./DefaultResultListItem-D1EWy0Xn.js";import{w as M,c as E}from"./appWrappers-Bk2njHpK.js";import{c as O}from"./Plugin-Dd2xY8WF.js";import{L as H}from"./Link-DnuEQx-0.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dagz_pTm.js";import"./Add-Tw_egT4-.js";import"./ArrowForwardIos-_13Utd0r.js";import"./translation-BfJviIKI.js";import"./List-DquDfnLJ.js";import"./ListContext-DyGfW3pa.js";import"./ListSubheader-LP_DYjSV.js";import"./Chip-BDOVbdu0.js";import"./Select-B-khT1R0.js";import"./index-B9sM2jn7.js";import"./Popover-CRfqc1ul.js";import"./Modal-BY3dMB2D.js";import"./Portal-AonZoDqn.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CnLv8su9.js";import"./useAnalytics-odk5YTGP.js";import"./EmptyState-D1m-gnLI.js";import"./Progress-CoLUHfH1.js";import"./LinearProgress-DN73H_Vz.js";import"./Box-DFPXS1uh.js";import"./styled-_ZhQ2JBl.js";import"./ResponseErrorPanel-BG9foovc.js";import"./ErrorPanel-Bv595yjm.js";import"./WarningPanel-C_F8xUzg.js";import"./ExpandMore-D_QIxzGY.js";import"./AccordionDetails-0XhIBkyu.js";import"./Collapse-ggEsDBaY.js";import"./MarkdownContent-D28GpyhI.js";import"./CodeSnippet-DGpkezw4.js";import"./CopyTextButton-CyVbES63.js";import"./useCopyToClipboard-D4G45ymZ.js";import"./useMountedState-BqkaBMSv.js";import"./Tooltip-1rkaBdpM.js";import"./Popper-BxGyCUHY.js";import"./Divider-DubjQnze.js";import"./useAsync-BqETPqxv.js";import"./lodash-Czox7iJy.js";import"./useElementFilter-CDIJo0HV.js";import"./componentData-DiYtav-w.js";import"./useObservable-Bl5WmSl_.js";import"./useIsomorphicLayoutEffect-8D8X83kR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-9w1oJKxU.js";import"./useApp-WY7YhADn.js";import"./useRouteRef-PDyeC6uZ.js";const J=E({id:"storybook.search.results.group.route"}),V=new C({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultGroup",component:n,decorators:[t=>M(e.jsx(D,{apis:[[F,V]],children:e.jsx(j,{container:!0,direction:"row",children:e.jsx(j,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":J}})],tags:["!manifest"]},a=()=>e.jsx(T,{children:e.jsx(n,{icon:e.jsx(o,{}),title:"Documentation"})}),u=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(n,{query:t,icon:e.jsx(o,{}),title:"Documentation"})},l=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,{query:()=>new Promise(()=>{})}]],children:e.jsx(n,{query:t,icon:e.jsx(o,{}),title:"Documentation"})})},p=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(n,{query:t,icon:e.jsx(o,{}),title:"Documentation"})})},m=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(n,{query:t,icon:e.jsx(o,{}),title:"Custom",titleProps:{color:"secondary"}})},d=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(n,{query:t,icon:e.jsx(o,{}),title:"Custom",link:"See all custom results",linkProps:{to:"/custom"}})},h=()=>{const[t,c]=s.useState({types:["software-catalog"]}),i=[{label:"Lifecycle",value:"lifecycle"},{label:"Owner",value:"owner"}],x=s.useCallback(r=>()=>{c(I=>{const{filters:g,...q}=I,v={...g,[r]:void 0};return{...q,filters:v}})},[]),k=s.useCallback(r=>I=>{c(g=>{const{filters:q,...v}=g,G={...q,[r]:I};return{...v,filters:G}})},[]),P=s.useCallback(r=>()=>{c(I=>{const{filters:g,...q}=I,v={...g};return delete v[r],{...q,filters:v}})},[]);return e.jsx(n,{query:t,icon:e.jsx(o,{}),title:"Documentation",filterOptions:i,renderFilterOption:r=>e.jsx(w,{onClick:x(r.value),children:r.label},r.value),renderFilterField:r=>{switch(r){case"lifecycle":return e.jsxs(L,{label:"Lifecycle",value:t.filters?.lifecycle,onChange:k("lifecycle"),onDelete:P("lifecycle"),children:[e.jsx(w,{value:"production",children:"Production"}),e.jsx(w,{value:"experimental",children:"Experimental"})]},r);case"owner":return e.jsx(A,{label:"Owner",value:t.filters?.owner,onChange:k("owner"),onDelete:P("owner")},r);default:return null}}})},y=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,new C]],children:e.jsx(n,{query:t,icon:e.jsx(o,{}),title:"Documentation"})})},S=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,new C]],children:e.jsx(n,{query:t,icon:e.jsx(o,{}),title:"Documentation",noResultsComponent:e.jsx(Q,{primary:"No results were found"})})})},U=t=>{const{icon:c,result:i}=t;return e.jsx(H,{to:i.location,children:e.jsxs(b,{alignItems:"flex-start",divider:!0,children:[c&&e.jsx(_,{children:c}),e.jsx(Q,{primary:i.title,primaryTypographyProps:{variant:"h6"},secondary:i.text})]})})},f=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(n,{query:t,icon:e.jsx(o,{}),title:"Custom",link:"See all custom results",renderResultItem:({document:c,highlight:i,rank:x})=>e.jsx(U,{result:c,highlight:i,rank:x},c.location)})},R=()=>{const[t]=s.useState({types:["techdocs"]}),i=O({id:"plugin"}).provide(W({name:"DefaultResultListItem",component:async()=>N}));return e.jsx(n,{query:t,icon:e.jsx(o,{}),title:"Documentation",children:e.jsx(i,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};u.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"Loading"};p.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithCustomTitle"};d.__docgenInfo={description:"",methods:[],displayName:"WithCustomLink"};h.__docgenInfo={description:"",methods:[],displayName:"WithFilters"};y.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};S.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};f.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};R.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
  return (
    <SearchContextProvider>
      <SearchResultGroup icon={<DocsIcon />} title="Documentation" />
    </SearchContextProvider>
  );
};
`,...a.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{code:`const WithQuery = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <SearchResultGroup
      query={query}
      icon={<DocsIcon />}
      title="Documentation"
    />
  );
};
`,...u.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{code:`const Loading = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider
      apis={[
        [searchApiRef, { query: () => new Promise<SearchResultSet>(() => {}) }],
      ]}
    >
      <SearchResultGroup
        query={query}
        icon={<DocsIcon />}
        title="Documentation"
      />
    </TestApiProvider>
  );
};
`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{code:`const WithError = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider
      apis={[
        [
          searchApiRef,
          {
            query: () =>
              new Promise<SearchResultSet>(() => {
                throw new Error();
              }),
          },
        ],
      ]}
    >
      <SearchResultGroup
        query={query}
        icon={<DocsIcon />}
        title="Documentation"
      />
    </TestApiProvider>
  );
};
`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{code:`const WithCustomTitle = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["custom"],
  });

  return (
    <SearchResultGroup
      query={query}
      icon={<DocsIcon />}
      title="Custom"
      titleProps={{ color: "secondary" }}
    />
  );
};
`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{code:`const WithCustomLink = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["custom"],
  });

  return (
    <SearchResultGroup
      query={query}
      icon={<DocsIcon />}
      title="Custom"
      link="See all custom results"
      linkProps={{ to: "/custom" }}
    />
  );
};
`,...d.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{code:`const WithFilters = () => {
  const [query, setQuery] = useState<Partial<SearchQuery>>({
    types: ["software-catalog"],
  });

  const filterOptions = [
    {
      label: "Lifecycle",
      value: "lifecycle",
    },
    {
      label: "Owner",
      value: "owner",
    },
  ];

  const handleFilterAdd = useCallback(
    (key: string) => () => {
      setQuery((prevQuery) => {
        const { filters: prevFilters, ...rest } = prevQuery;
        const newFilters = { ...prevFilters, [key]: undefined };
        return { ...rest, filters: newFilters };
      });
    },
    []
  );

  const handleFilterChange = useCallback(
    (key: string) => (value: JsonValue) => {
      setQuery((prevQuery) => {
        const { filters: prevFilters, ...rest } = prevQuery;
        const newFilters = { ...prevFilters, [key]: value };
        return { ...rest, filters: newFilters };
      });
    },
    []
  );

  const handleFilterDelete = useCallback(
    (key: string) => () => {
      setQuery((prevQuery) => {
        const { filters: prevFilters, ...rest } = prevQuery;
        const newFilters = { ...prevFilters };
        delete newFilters[key];
        return { ...rest, filters: newFilters };
      });
    },
    []
  );

  return (
    <SearchResultGroup
      query={query}
      icon={<DocsIcon />}
      title="Documentation"
      filterOptions={filterOptions}
      renderFilterOption={(option) => (
        <MenuItem key={option.value} onClick={handleFilterAdd(option.value)}>
          {option.label}
        </MenuItem>
      )}
      renderFilterField={(key: string) => {
        switch (key) {
          case "lifecycle":
            return (
              <SearchResultGroupSelectFilterField
                key={key}
                label="Lifecycle"
                value={query.filters?.lifecycle}
                onChange={handleFilterChange("lifecycle")}
                onDelete={handleFilterDelete("lifecycle")}
              >
                <MenuItem value="production">Production</MenuItem>
                <MenuItem value="experimental">Experimental</MenuItem>
              </SearchResultGroupSelectFilterField>
            );
          case "owner":
            return (
              <SearchResultGroupTextFilterField
                key={key}
                label="Owner"
                value={query.filters?.owner}
                onChange={handleFilterChange("owner")}
                onDelete={handleFilterDelete("owner")}
              />
            );
          default:
            return null;
        }
      }}
    />
  );
};
`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{code:`const WithDefaultNoResultsComponent = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup
        query={query}
        icon={<DocsIcon />}
        title="Documentation"
      />
    </TestApiProvider>
  );
};
`,...y.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{code:`const WithCustomNoResultsComponent = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup
        query={query}
        icon={<DocsIcon />}
        title="Documentation"
        noResultsComponent={<ListItemText primary="No results were found" />}
      />
    </TestApiProvider>
  );
};
`,...S.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{code:`const WithCustomResultItem = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["custom"],
  });

  return (
    <SearchResultGroup
      query={query}
      icon={<DocsIcon />}
      title="Custom"
      link="See all custom results"
      renderResultItem={({ document, highlight, rank }) => (
        <CustomResultListItem
          key={document.location}
          result={document}
          highlight={highlight}
          rank={rank}
        />
      )}
    />
  );
};
`,...f.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{code:`const WithResultItemExtensions = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });
  const plugin = createPlugin({ id: "plugin" });
  const DefaultSearchResultGroupItem = plugin.provide(
    createSearchResultListItemExtension({
      name: "DefaultResultListItem",
      component: async () => DefaultResultListItem,
    })
  );
  return (
    <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation">
      <DefaultSearchResultGroupItem />
    </SearchResultGroup>
  );
};
`,...R.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultGroup icon={<DocsIcon />} title="Documentation" />
    </SearchContextProvider>;
}`,...a.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />;
}`,...u.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {})
  }]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />
    </TestApiProvider>;
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
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
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" titleProps={{
    color: 'secondary'
  }} />;
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" link="See all custom results" linkProps={{
    to: '/custom'
  }} />;
}`,...d.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`() => {
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
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />
    </TestApiProvider>;
}`,...y.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" noResultsComponent={<ListItemText primary="No results were found" />} />
    </TestApiProvider>;
}`,...S.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" link="See all custom results" renderResultItem={({
    document,
    highlight,
    rank
  }) => <CustomResultListItem key={document.location} result={document} highlight={highlight} rank={rank} />} />;
}`,...f.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`() => {
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
}`,...R.parameters?.docs?.source}}};const rt=["Default","WithQuery","Loading","WithError","WithCustomTitle","WithCustomLink","WithFilters","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{a as Default,l as Loading,d as WithCustomLink,S as WithCustomNoResultsComponent,f as WithCustomResultItem,m as WithCustomTitle,y as WithDefaultNoResultsComponent,p as WithError,h as WithFilters,u as WithQuery,R as WithResultItemExtensions,rt as __namedExportsOrder,tt as default};
