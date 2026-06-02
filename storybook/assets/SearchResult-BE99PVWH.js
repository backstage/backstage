import{ca as l,bR as r,cY as R,cD as f}from"./iframe-DogXi1kP.js";import{u as x}from"./useAsync-Dwi-mC7O.js";import{a as y}from"./lodash-Bl4KCeDg.js";import{s as g}from"./api-pe4Jk8Pn.js";import{b as E}from"./Plugin-C47UInpE.js";import{u as k}from"./useElementFilter-DetdypbB.js";import{H as I}from"./DefaultResultListItem-BSxEdWyW.js";import{g as L}from"./componentData-Bwbss29D.js";import{u as C,A as q}from"./useAnalytics-DWMKXBU9.js";import{L as j}from"./ListItem-BXUM3Mts.js";import{L as A}from"./List-DYZA-_Cd.js";import{s as T}from"./translation-DhoBILl4.js";import{a as w}from"./SearchContext-OqF0SfrF.js";import{E as _}from"./EmptyState-D6K9iG1c.js";import{P as b}from"./Progress-DlmWEUd4.js";import{R as D}from"./ResponseErrorPanel-DquXKOU7.js";const m="search.results.list.items.extensions.v1",N=(n,t)=>{for(const e of n)if(!(!l.isValidElement(e)||!L(e,m)?.(t)))return l.cloneElement(e,{rank:t.rank,highlight:t.highlight,result:t.document,...e.props});return null},p=n=>{const{rank:t,result:e,noTrack:s,children:a,alignItems:o="flex-start",...u}=n,i=C(),c=l.useCallback(()=>{s||e&&i.captureEvent("discover",e.title,{attributes:{to:e.location},value:t})},[t,e,s,i]);return r.jsx(j,{divider:!0,alignItems:o,onClickCapture:c,...u,children:a})},te=n=>{const{name:t,component:e,predicate:s=()=>!0}=n;return E({name:t,component:{lazy:()=>e().then(a=>(o=>r.jsx(p,{rank:o.rank,result:o.result,noTrack:o.noTrack,children:l.createElement(a,o)})))},data:{[m]:s}})},P=n=>{const t=k(n,e=>e.selectByComponentData({key:m}).getElements(),[n]);return l.useCallback((e,s)=>{const a=N(t,e);return r.jsx(l.Fragment,{children:a??r.jsx(p,{rank:e.rank,result:e.document,children:r.jsx(I,{rank:e.rank,highlight:e.highlight,result:e.document})})},s)},[t])},h=n=>{const{results:t,children:e,...s}=n,a=P(e);return r.jsx(A,{...s,children:t.map(a)})};p.__docgenInfo={description:`@internal
Extends children with extension capabilities.
@param props - see {@link SearchResultListItemExtensionProps}.`,methods:[],displayName:"SearchResultListItemExtension"};h.__docgenInfo={description:`@public
Render results using search extensions.
@param props - see {@link SearchResultListItemExtensionsProps}`,methods:[],displayName:"SearchResultListItemExtensions",props:{results:{required:!0,tsType:{name:"Array",elements:[{name:"Result",elements:[{name:"SearchDocument"}],raw:"Result<SearchDocument>"}],raw:"SearchResult[]"},description:"Search result list."}}};const v=n=>{const{children:t}=n,e=w(),{result:s,...a}=e;return t(s,a)},X=n=>{const{query:t,children:e}=n,s=f(g),a=x(()=>{const{term:o="",types:u=[],filters:i={},...c}=t;return s.query({...c,term:o,types:u,filters:i})},[t]);return e(a,t)},d=n=>{const{query:t,children:e}=n;return t?r.jsx(X,{query:t,children:e}):r.jsx(v,{children:e})},S=n=>{const{t}=R(T),{query:e,children:s,noResultsComponent:a=r.jsx(_,{missing:"data",title:t("noResultsDescription")}),...o}=n;return r.jsx(d,{query:e,children:({loading:u,error:i,value:c})=>u?r.jsx(b,{}):i?r.jsx(D,{title:"Error encountered while fetching search results",error:i}):c?.results.length?y.isFunction(s)?s(c):r.jsx(h,{...o,results:c.results,children:s}):a})},J=n=>r.jsx(q,{attributes:{pluginId:"search",extension:"SearchResult"},children:r.jsx(S,{...n})});d.__docgenInfo={description:`Call a child render function passing a search state as an argument.
@remarks By default, results are taken from context, but when a "query" prop is set, results are requested from the search api.
@param props - see {@link SearchResultStateProps}.
@example
Consuming results from context:
\`\`\`
<SearchResultState>
  {({ loading, error, value }) => (
    <List>
      {value?.map(({ document }) => (
        <DefaultSearchResultListItem
          key={document.location}
          result={document}
        />
      ))}
    </List>
  )}
</SearchResultState>
\`\`\`
@example
Requesting results using the search api:
\`\`\`
<SearchResultState query={{ term: 'documentation' }}>
  {({ loading, error, value }) => (
    <List>
      {value?.map(({ document }) => (
        <DefaultSearchResultListItem
          key={document.location}
          result={document}
        />
      ))}
    </List>
  )}
</SearchResultState>
\`\`\`
@public`,methods:[],displayName:"SearchResultState",props:{children:{required:!0,tsType:{name:"signature",type:"function",raw:`(
  state: AsyncState<SearchResultSet>,
  query: Partial<SearchQuery>,
) => JSX.Element | null`,signature:{arguments:[{type:{name:"AsyncState",elements:[{name:"ResultSet",elements:[{name:"SearchDocument"}],raw:"ResultSet<SearchDocument>"}],raw:"AsyncState<SearchResultSet>"},name:"state"},{type:{name:"Partial",elements:[{name:"SearchQuery"}],raw:"Partial<SearchQuery>"},name:"query"}],return:{name:"union",raw:"JSX.Element | null",elements:[{name:"JSX.Element"},{name:"null"}]}}},description:"A child function that receives an asynchronous result set and returns a react element."}}};S.__docgenInfo={description:`Renders results from a parent search context or api.
@remarks default components for loading, error and empty variants are returned.
@param props - see {@link SearchResultProps}.
@public`,methods:[],displayName:"SearchResultComponent",props:{children:{required:!1,tsType:{name:"union",raw:"ReactNode | ((resultSet: SearchResultSet) => JSX.Element)",elements:[{name:"ReactNode"},{name:"unknown"}]},description:""},noResultsComponent:{required:!1,tsType:{name:"JSX.Element"},description:""}}};J.__docgenInfo={description:`A component returning the search result from a parent search context or api.
@param props - see {@link SearchResultProps}.
@public`,methods:[],displayName:"SearchResult",props:{children:{required:!1,tsType:{name:"union",raw:"ReactNode | ((resultSet: SearchResultSet) => JSX.Element)",elements:[{name:"ReactNode"},{name:"unknown"}]},description:""},noResultsComponent:{required:!1,tsType:{name:"JSX.Element"},description:""}}};export{J as S,d as a,te as c,P as u};
