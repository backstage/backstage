import{r as l,j as s,F as R,J as f}from"./iframe-M9O-K8SB.js";import{u as x}from"./useAsync-CFnaQwpM.js";import{l as y}from"./lodash-Czox7iJy.js";import{s as g}from"./api-JIjLndcE.js";import{H as E}from"./DefaultResultListItem-Pm8pGhKu.js";import{L as k}from"./ListItem-CccU-wMK.js";import{L as I}from"./List-DFXlWgcm.js";import{u as L}from"./useElementFilter-D-bjtJAi.js";import{a as C}from"./Plugin-CnPMefJ2.js";import{g as j}from"./componentData-lwFigNXQ.js";import{u as q,A}from"./useAnalytics-8ya555GT.js";import{s as T}from"./translation-kn3hcwTy.js";import{u as w}from"./SearchContext-3Ne9i5li.js";import{E as _}from"./EmptyState-DYONb9PE.js";import{P as N}from"./Progress-Bmcn_mSX.js";import{R as P}from"./ResponseErrorPanel-BcMIENty.js";const m="search.results.list.items.extensions.v1",b=(n,t)=>{for(const e of n)if(!(!l.isValidElement(e)||!j(e,m)?.(t)))return l.cloneElement(e,{rank:t.rank,highlight:t.highlight,result:t.document,...e.props});return null},p=n=>{const{rank:t,result:e,noTrack:r,children:a,alignItems:o="flex-start",...u}=n,i=q(),c=l.useCallback(()=>{r||e&&i.captureEvent("discover",e.title,{attributes:{to:e.location},value:t})},[t,e,r,i]);return s.jsx(k,{divider:!0,alignItems:o,onClickCapture:c,...u,children:a})},te=n=>{const{name:t,component:e,predicate:r=()=>!0}=n;return C({name:t,component:{lazy:()=>e().then(a=>(o=>s.jsx(p,{rank:o.rank,result:o.result,noTrack:o.noTrack,children:l.createElement(a,o)})))},data:{[m]:r}})},D=n=>{const t=L(n,e=>e.selectByComponentData({key:m}).getElements(),[n]);return l.useCallback((e,r)=>{const a=b(t,e);return s.jsx(l.Fragment,{children:a??s.jsx(p,{rank:e.rank,result:e.document,children:s.jsx(E,{rank:e.rank,highlight:e.highlight,result:e.document})})},r)},[t])},h=n=>{const{results:t,children:e,...r}=n,a=D(e);return s.jsx(I,{...r,children:t.map(a)})};p.__docgenInfo={description:`@internal
Extends children with extension capabilities.
@param props - see {@link SearchResultListItemExtensionProps}.`,methods:[],displayName:"SearchResultListItemExtension"};h.__docgenInfo={description:`@public
Render results using search extensions.
@param props - see {@link SearchResultListItemExtensionsProps}`,methods:[],displayName:"SearchResultListItemExtensions",props:{results:{required:!0,tsType:{name:"Array",elements:[{name:"Result",elements:[{name:"SearchDocument"}],raw:"Result<SearchDocument>"}],raw:"SearchResult[]"},description:"Search result list."}}};const v=n=>{const{children:t}=n,e=w(),{result:r,...a}=e;return t(r,a)},J=n=>{const{query:t,children:e}=n,r=f(g),a=x(()=>{const{term:o="",types:u=[],filters:i={},...c}=t;return r.query({...c,term:o,types:u,filters:i})},[t]);return e(a,t)},d=n=>{const{query:t,children:e}=n;return t?s.jsx(J,{query:t,children:e}):s.jsx(v,{children:e})},S=n=>{const{t}=R(T),{query:e,children:r,noResultsComponent:a=s.jsx(_,{missing:"data",title:t("noResultsDescription")}),...o}=n;return s.jsx(d,{query:e,children:({loading:u,error:i,value:c})=>u?s.jsx(N,{}):i?s.jsx(P,{title:"Error encountered while fetching search results",error:i}):c?.results.length?y.isFunction(r)?r(c):s.jsx(h,{...o,results:c.results,children:r}):a})},X=n=>s.jsx(A,{attributes:{pluginId:"search",extension:"SearchResult"},children:s.jsx(S,{...n})});d.__docgenInfo={description:`Call a child render function passing a search state as an argument.
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
@public`,methods:[],displayName:"SearchResultComponent",props:{children:{required:!1,tsType:{name:"union",raw:"ReactNode | ((resultSet: SearchResultSet) => JSX.Element)",elements:[{name:"ReactNode"},{name:"unknown"}]},description:""},noResultsComponent:{required:!1,tsType:{name:"JSX.Element"},description:""}}};X.__docgenInfo={description:`A component returning the search result from a parent search context or api.
@param props - see {@link SearchResultProps}.
@public`,methods:[],displayName:"SearchResult",props:{children:{required:!1,tsType:{name:"union",raw:"ReactNode | ((resultSet: SearchResultSet) => JSX.Element)",elements:[{name:"ReactNode"},{name:"unknown"}]},description:""},noResultsComponent:{required:!1,tsType:{name:"JSX.Element"},description:""}}};export{X as S,d as a,te as c,D as u};
