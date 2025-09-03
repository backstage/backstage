import{j as s}from"./jsx-runtime-hv06LKfz.js";import{u as f}from"./useAsync-7M-9CJJS.js";import{l as R}from"./lodash-D1GzKnrP.js";import{s as x}from"./api-YILTVPsk.js";import{r as l}from"./index-D8-PC79C.js";import{H as y}from"./DefaultResultListItem--r-eJIbV.js";import{L as g}from"./ListItem-CIr9U5k9.js";import{L as E}from"./List-Bi5n8Alr.js";import{u as k}from"./useElementFilter-DYcK9Hnf.js";import{a as I}from"./Plugin-IiR5jw9N.js";import{g as L}from"./componentData-DvKcogcx.js";import{u as C,A as j}from"./useAnalytics-Q-nz63z2.js";import{s as q}from"./translation-BIsYolyo.js";import{u as A}from"./SearchContext-DiK7zrkk.js";import{u as T}from"./useTranslationRef-DKy5gnX5.js";import{E as w}from"./EmptyState-BoWowcfp.js";import{P as _}from"./Progress-Bvn6WRkc.js";import{R as N}from"./ResponseErrorPanel-Skct3pVj.js";import{u as P}from"./ApiRef-ByCJBjX1.js";const m="search.results.list.items.extensions.v1",b=(n,t)=>{for(const e of n)if(!(!l.isValidElement(e)||!L(e,m)?.(t)))return l.cloneElement(e,{rank:t.rank,highlight:t.highlight,result:t.document,...e.props});return null},p=n=>{const{rank:t,result:e,noTrack:r,children:a,alignItems:o="flex-start",...u}=n,i=C(),c=l.useCallback(()=>{r||e&&i.captureEvent("discover",e.title,{attributes:{to:e.location},value:t})},[t,e,r,i]);return s.jsx(g,{divider:!0,alignItems:o,onClickCapture:c,...u,children:a})},se=n=>{const{name:t,component:e,predicate:r=()=>!0}=n;return I({name:t,component:{lazy:()=>e().then(a=>o=>s.jsx(p,{rank:o.rank,result:o.result,noTrack:o.noTrack,children:l.createElement(a,o)}))},data:{[m]:r}})},D=n=>{const t=k(n,e=>e.selectByComponentData({key:m}).getElements(),[n]);return l.useCallback((e,r)=>{const a=b(t,e);return s.jsx(l.Fragment,{children:a??s.jsx(p,{rank:e.rank,result:e.document,children:s.jsx(y,{rank:e.rank,highlight:e.highlight,result:e.document})})},r)},[t])},h=n=>{const{results:t,children:e,...r}=n,a=D(e);return s.jsx(E,{...r,children:t.map(a)})};p.__docgenInfo={description:`@internal
Extends children with extension capabilities.
@param props - see {@link SearchResultListItemExtensionProps}.`,methods:[],displayName:"SearchResultListItemExtension"};h.__docgenInfo={description:`@public
Render results using search extensions.
@param props - see {@link SearchResultListItemExtensionsProps}`,methods:[],displayName:"SearchResultListItemExtensions",props:{results:{required:!0,tsType:{name:"Array",elements:[{name:"Result",elements:[{name:"SearchDocument"}],raw:"Result<SearchDocument>"}],raw:"SearchResult[]"},description:"Search result list."}}};const v=n=>{const{children:t}=n,e=A(),{result:r,...a}=e;return t(r,a)},X=n=>{const{query:t,children:e}=n,r=P(x),a=f(()=>{const{term:o="",types:u=[],filters:i={},...c}=t;return r.query({...c,term:o,types:u,filters:i})},[t]);return e(a,t)},d=n=>{const{query:t,children:e}=n;return t?s.jsx(X,{query:t,children:e}):s.jsx(v,{children:e})},S=n=>{const{t}=T(q),{query:e,children:r,noResultsComponent:a=s.jsx(w,{missing:"data",title:t("noResultsDescription")}),...o}=n;return s.jsx(d,{query:e,children:({loading:u,error:i,value:c})=>u?s.jsx(_,{}):i?s.jsx(N,{title:"Error encountered while fetching search results",error:i}):c?.results.length?R.isFunction(r)?r(c):s.jsx(h,{...o,results:c.results,children:r}):a})},J=n=>s.jsx(j,{attributes:{pluginId:"search",extension:"SearchResult"},children:s.jsx(S,{...n})});d.__docgenInfo={description:`Call a child render function passing a search state as an argument.
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
@public`,methods:[],displayName:"SearchResult",props:{children:{required:!1,tsType:{name:"union",raw:"ReactNode | ((resultSet: SearchResultSet) => JSX.Element)",elements:[{name:"ReactNode"},{name:"unknown"}]},description:""},noResultsComponent:{required:!1,tsType:{name:"JSX.Element"},description:""}}};export{d as S,J as a,se as c,D as u};
